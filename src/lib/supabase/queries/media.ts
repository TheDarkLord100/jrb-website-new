import { supabase } from '@/lib/supabase/client';
import { slugify } from '@/lib/slugify';

export type MediaBucket = 'media' | 'documents';

// Folders are listed here rather than discovered from Storage: a folder
// only exists in Supabase once a file is in it, so a brand-new section
// would otherwise be impossible to upload into. Add a folder here before
// using it. Accepted types and size caps mirror the bucket settings in the
// Supabase dashboard -- the dashboard enforces them, these just let the UI
// say no before uploading.
export const BUCKETS = {
  media: {
    label: 'Images',
    folders: ['projects', 'people', 'labs', 'events', 'gallery', 'partners'],
    accept: ['image/webp', 'image/jpeg', 'image/png'],
    maxBytes: 2 * 1024 * 1024,
  },
  documents: {
    label: 'Documents',
    folders: ['general', 'admissions', 'academics'],
    accept: ['application/pdf'],
    maxBytes: 10 * 1024 * 1024,
  },
} as const satisfies Record<
  MediaBucket,
  { label: string; folders: readonly string[]; accept: readonly string[]; maxBytes: number }
>;

export type MediaFile = {
  bucket: MediaBucket;
  name: string; // stored file name, e.g. "a8f3k2-soft-gripper.webp"
  path: string; // folder/name, e.g. "projects/a8f3k2-soft-gripper.webp"
  url: string; // public URL
  size: number | null;
  mimeType: string | null;
  createdAt: string | null;
};

// Uploads never overwrite: every file gets a random prefix, so a URL always
// points at the same bytes and caches can keep it for a year. The one
// exception is replaceDocument() below.
const LONG_CACHE_SECONDS = '31536000';
// Replaced documents keep their URL, so browsers should check back soon.
const SHORT_CACHE_SECONDS = '60';

function randomId(length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => (b % 36).toString(36)).join('');
}

// "Admissions Brochure 2026.pdf" -> "k3x9qa-admissions-brochure-2026.pdf"
export function uniqueFileName(originalName: string, extension: string): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${randomId()}-${slugify(base) || 'file'}.${extension}`;
}

// Undo uniqueFileName for display: "k3x9qa-admissions-brochure-2026.pdf"
// -> "Admissions brochure 2026".
export function displayName(fileName: string): string {
  const readable = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/^[a-z0-9]{6}-/, '')
    .replace(/-/g, ' ');
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

function toMediaFile(bucket: MediaBucket, path: string, extra: Partial<MediaFile> = {}): MediaFile {
  const { data } = supabase!.storage.from(bucket).getPublicUrl(path);
  return {
    bucket,
    name: path.split('/').pop() ?? path,
    path,
    url: data.publicUrl,
    size: null,
    mimeType: null,
    createdAt: null,
    ...extra,
  };
}

// Files directly inside one folder, newest first. Needs the authenticated
// select policy on storage.objects -- logged-out callers get nothing.
export async function listMediaFiles(bucket: MediaBucket, folder: string): Promise<MediaFile[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    console.error(`Error listing ${bucket}/${folder}:`, error);
    throw error;
  }

  return (data ?? [])
    .filter((item) => item.id !== null && item.name !== '.emptyFolderPlaceholder')
    .map((item) =>
      toMediaFile(bucket, `${folder}/${item.name}`, {
        size: item.metadata?.size ?? null,
        mimeType: item.metadata?.mimetype ?? null,
        createdAt: item.created_at,
      })
    );
}

export async function uploadMediaFile(
  bucket: MediaBucket,
  folder: string,
  file: Blob,
  fileName: string
): Promise<MediaFile | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const path = `${folder}/${fileName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: LONG_CACHE_SECONDS,
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error(`Error uploading ${bucket}/${path}:`, error);
    return null;
  }
  return toMediaFile(bucket, path, {
    size: file.size,
    mimeType: file.type,
    createdAt: new Date().toISOString(),
  });
}

// Overwrites a document in place so its URL -- and every link to it --
// stays the same. Documents only; images are always uploaded fresh.
export async function replaceDocument(path: string, file: Blob): Promise<MediaFile | null> {
  if (!supabase) {
    console.error(
      'Supabase is not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
    return null;
  }

  const { error } = await supabase.storage.from('documents').upload(path, file, {
    cacheControl: SHORT_CACHE_SECONDS,
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    console.error(`Error replacing documents/${path}:`, error);
    return null;
  }
  return toMediaFile('documents', path, {
    size: file.size,
    mimeType: file.type,
    createdAt: new Date().toISOString(),
  });
}