'use client';

import { useState } from 'react';
import { ImageIcon, Video } from 'lucide-react';
import MediaPicker from './MediaPicker';

export type MediaValue = { url: string; type: 'image' | 'video' } | null;

// The form-level wrapper around MediaPicker: a preview of what's chosen,
// plus Choose / Change / Remove. Drop it into any admin form that stores an
// image (and optionally a video) URL.
//
// Images come from the `media` bucket via the picker. Videos live on the
// Apache server (uploaded by hand), so for those the admin pastes a URL.
// Alt text is opt-in: pass `alt` + `onAltChange` when the table has a
// column for it.
export default function MediaField({
  value,
  onChange,
  folder,
  allowVideo = false,
  alt,
  onAltChange,
}: {
  value: MediaValue;
  onChange: (value: MediaValue) => void;
  folder: string;
  allowVideo?: boolean;
  alt?: string | null;
  onAltChange?: (alt: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [videoMode, setVideoMode] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const applyVideoUrl = () => {
    const url = videoUrl.trim();
    if (!/^(https?:\/\/|\/)/.test(url)) return;
    onChange({ url, type: 'video' });
    setVideoMode(false);
    setVideoUrl('');
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex gap-3 rounded border border-stone-200 p-2">
          <div className="h-20 w-32 shrink-0 overflow-hidden rounded bg-stone-100">
            {value.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.url} alt="" className="h-full w-full object-cover" />
            ) : (
              <video src={value.url} muted playsInline className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="truncate text-xs text-stone-500">
              <span className="font-semibold text-stone-700 capitalize">{value.type}</span> ·{' '}
              <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-700"
              >
                {value.url}
              </a>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => (value.type === 'image' ? setPickerOpen(true) : setVideoMode(true))}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        !videoMode && (
          <div className="flex items-center gap-2 rounded border border-dashed border-stone-300 px-3 py-3">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
            >
              <ImageIcon size={13} />
              Choose image
            </button>
            {allowVideo && (
              <button
                type="button"
                onClick={() => setVideoMode(true)}
                className="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                <Video size={13} />
                Paste video URL
              </button>
            )}
          </div>
        )
      )}

      {videoMode && (
        <div className="space-y-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => {
                // Don't let Enter submit the surrounding form.
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyVideoUrl();
                }
              }}
              placeholder="https://robotics.iitd.ac.in/videos/… or /videos/…"
              className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={applyVideoUrl}
              className="rounded bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800"
            >
              Use
            </button>
            <button
              type="button"
              onClick={() => {
                setVideoMode(false);
                setVideoUrl('');
              }}
              className="rounded px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-stone-400">
            Upload the video to the server first, then paste its full URL or site path.
          </p>
        </div>
      )}

      {value && onAltChange && (
        <input
          type="text"
          value={alt ?? ''}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder={
            value.type === 'image'
              ? 'Alt text — describe the image for screen readers'
              : 'Short description of the video, for screen readers'
          }
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm"
        />
      )}

      {pickerOpen && (
        <MediaPicker
          bucket="media"
          initialFolder={folder}
          onSelect={(file) => {
            onChange({ url: file.url, type: 'image' });
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}