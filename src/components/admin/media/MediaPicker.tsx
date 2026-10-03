'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, FileText, Search, Upload } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import {
  BUCKETS,
  displayName,
  listMediaFiles,
  replaceDocument,
  uniqueFileName,
  uploadMediaFile,
  type MediaBucket,
  type MediaFile,
} from '@/lib/supabase/queries';
import { compressImage } from '@/lib/compressImage';

function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Browse a bucket folder, upload into it, and pick one file. Knows nothing
// about which table the result ends up in -- the caller gets a MediaFile
// and decides what to do with its URL.
//
// Rendered through a portal into <body>: pickers are usually opened from
// inside another modal's <form>, and a portal keeps Enter in the search box
// from submitting that outer form.
export default function MediaPicker({
  bucket,
  initialFolder,
  onSelect,
  onClose,
}: {
  bucket: MediaBucket;
  initialFolder?: string;
  onSelect: (file: MediaFile) => void;
  onClose: () => void;
}) {
  const config = BUCKETS[bucket];
  const isImages = bucket === 'media';
  const toast = useToast();

  const [folder, setFolder] = useState<string>(
    initialFolder && (config.folders as readonly string[]).includes(initialFolder)
      ? initialFolder
      : config.folders[0]
  );
  const [files, setFiles] = useState<MediaFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState<MediaFile | null>(null);

  useEffect(() => {
    let cancelled = false;

    listMediaFiles(bucket, folder)
      .then((data) => {
        if (!cancelled) setFiles(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load files. Check that you're logged in.");
      });

    return () => {
      cancelled = true;
    };
  }, [bucket, folder]);

  const changeFolder = (next: string) => {
    setFolder(next);
    setFiles(null);
    setError(null);
    setSelected(null);
    setSearch('');
  };

  // Shared checks for upload and replace: type first, then size. Images
  // are size-checked after compression, since that's what actually lands.
  const rejectReason = (file: File | Blob, stage: 'before' | 'after'): string | null => {
    if (stage === 'before' && !(config.accept as readonly string[]).includes(file.type)) {
      return isImages ? 'Only JPEG, PNG or WebP images.' : 'Only PDF files.';
    }
    if (stage === 'after' && file.size > config.maxBytes) {
      return `File is ${formatBytes(file.size)}; the limit is ${formatBytes(config.maxBytes)}.`;
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const typeProblem = rejectReason(file, 'before');
    if (typeProblem) {
      toast.error(typeProblem);
      return;
    }

    setUploading(true);
    try {
      let blob: Blob = file;
      let extension = 'pdf';
      if (isImages) {
        ({ blob, extension } = await compressImage(file));
      }

      const sizeProblem = rejectReason(blob, 'after');
      if (sizeProblem) {
        toast.error(sizeProblem);
        return;
      }

      const uploaded = await uploadMediaFile(
        bucket,
        folder,
        blob,
        uniqueFileName(file.name, extension)
      );
      if (!uploaded) {
        toast.error('Upload failed. Check the console for details.');
        return;
      }

      setFiles((prev) => [uploaded, ...(prev ?? [])]);
      setSelected(uploaded);
      toast.success(
        isImages ? `Uploaded (${formatBytes(file.size)} → ${formatBytes(blob.size)}).` : 'Uploaded.'
      );
    } catch (e) {
      console.error('Error preparing upload:', e);
      toast.error("Couldn't read that file.");
    } finally {
      setUploading(false);
    }
  };

  const handleReplace = async (target: MediaFile, file: File) => {
    const problem = rejectReason(file, 'before') ?? rejectReason(file, 'after');
    if (problem) {
      toast.error(problem);
      return;
    }
    if (
      !confirm(
        `Replace "${displayName(target.name)}" with "${file.name}"? Every link to it will show the new file.`
      )
    )
      return;

    setUploading(true);
    const replaced = await replaceDocument(target.path, file);
    setUploading(false);

    if (!replaced) {
      toast.error('Replace failed. Check the console for details.');
      return;
    }
    setFiles((prev) => (prev ?? []).map((f) => (f.path === replaced.path ? replaced : f)));
    toast.success('Document replaced. Links may show the old version for about a minute.');
  };

  const query = search.trim().toLowerCase();
  const visibleFiles = (files ?? []).filter(
    (f) => !query || displayName(f.name).toLowerCase().includes(query)
  );

  const picker = (
    <Modal
      title={isImages ? 'Choose an image' : 'Choose a document'}
      subtitle={`Upload to or pick from the ${config.label.toLowerCase()} library`}
      onClose={onClose}
      maxWidth="max-w-4xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected || uploading}
            onClick={() => selected && onSelect(selected)}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            Use selected
          </button>
        </>
      }
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
        className={`min-h-[320px] rounded ${dragging ? 'bg-teal-50 outline-2 outline-teal-400 outline-dashed' : ''}`}
      >
        <div className="mb-4 flex items-center gap-2">
          <select
            value={folder}
            onChange={(e) => changeFolder(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-xs"
          >
            {config.folders.map((f) => (
              <option key={f} value={f}>
                {f}/
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search this folder"
              className="w-full rounded border border-gray-300 py-1.5 pr-3 pl-8 text-xs"
            />
          </div>

          <button
            type="button"
            disabled={uploading}
            onClick={() => uploadInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            <Upload size={13} />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <input
            ref={uploadInputRef}
            type="file"
            accept={config.accept.join(',')}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = ''; // allow re-picking the same file
              if (file) handleUpload(file);
            }}
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept={config.accept.join(',')}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file && replacing) handleReplace(replacing, file);
              setReplacing(null);
            }}
          />
        </div>

        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {!error && !files && (
          <div className="grid animate-pulse grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded bg-gray-100" />
            ))}
          </div>
        )}

        {files && visibleFiles.length === 0 && (
          <p className="py-16 text-center text-sm text-stone-400">
            {files.length === 0
              ? `Nothing in ${folder}/ yet. Upload a file or drop one here.`
              : `No files match "${search}".`}
          </p>
        )}

        {files && visibleFiles.length > 0 && isImages && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleFiles.map((file) => {
              const isSelected = selected?.path === file.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelected(file)}
                  onDoubleClick={() => onSelect(file)}
                  className={`group relative overflow-hidden rounded border text-left ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-600'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full bg-stone-100 object-cover"
                  />
                  <div className="truncate px-2 py-1 text-xs text-stone-600">
                    {displayName(file.name)}
                  </div>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 rounded-full bg-teal-600 p-0.5 text-white">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {files && visibleFiles.length > 0 && !isImages && (
          <ul className="divide-y divide-stone-100 rounded border border-stone-200">
            {visibleFiles.map((file) => {
              const isSelected = selected?.path === file.path;
              return (
                <li
                  key={file.path}
                  onClick={() => setSelected(file)}
                  onDoubleClick={() => onSelect(file)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                    isSelected ? 'bg-teal-50' : 'hover:bg-stone-50'
                  }`}
                >
                  <FileText size={16} className="shrink-0 text-stone-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-stone-800">
                      {displayName(file.name)}
                    </div>
                    <div className="truncate font-mono text-xs text-stone-400">{file.name}</div>
                  </div>
                  <span className="text-xs text-stone-400">{formatBytes(file.size)}</span>
                  <span className="w-24 text-right text-xs text-stone-400">
                    {formatDate(file.createdAt)}
                  </span>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-stone-500 hover:text-teal-700"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplacing(file);
                      replaceInputRef.current?.click();
                    }}
                    className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Replace
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-4 text-xs text-stone-400">
          {isImages
            ? 'Images are resized to at most 1920px and converted to WebP before upload.'
            : `PDFs up to ${formatBytes(config.maxBytes)}. Replacing a document keeps its link the same.`}
        </p>
      </div>
    </Modal>
  );

  return createPortal(picker, document.body);
}