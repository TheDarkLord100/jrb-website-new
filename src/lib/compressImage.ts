// Resizes an image so its longer side is at most `maxDimension` and
// re-encodes it as WebP, in the browser, before upload. Typical phone
// photos drop from several MB to a few hundred KB.
//
// Falls back to JPEG on browsers whose canvas can't encode WebP, and keeps
// the original file when re-encoding wouldn't make it any smaller (e.g. an
// already-optimised small PNG).
export async function compressImage(
  file: File,
  { maxDimension = 1920, quality = 0.82 } = {}
): Promise<{ blob: Blob; extension: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  // A browser that can't encode WebP silently returns PNG instead, so check
  // what actually came back.
  let blob = await encode('image/webp');
  let extension = 'webp';
  if (!blob || blob.type !== 'image/webp') {
    blob = await encode('image/jpeg');
    extension = 'jpg';
  }
  if (!blob) throw new Error('Image encoding failed');

  if (scale === 1 && blob.size >= file.size) {
    return { blob: file, extension: originalExtension(file) };
  }
  return { blob, extension };
}

function originalExtension(file: File): string {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}