'use client';

import { useRef, useState } from 'react';
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Strikethrough,
} from 'lucide-react';
import Markdown from '@/components/ui/Markdown';

// Wraps the current selection in `before`/`after` (or inserts `placeholder`
// between them if nothing is selected), then restores focus with the
// inserted/selected text re-selected -- so a second click toggles it again
// and typing immediately replaces a placeholder.
function applyWrap(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string,
  onChange: (value: string) => void
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd) || placeholder;
  const next =
    value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    const start = selectionStart + before.length;
    textarea.setSelectionRange(start, start + selected.length);
  });
}

// Prefixes every line touched by the current selection, via `prefixFn(line,
// indexWithinSelection)` -- used for bullet/numbered lists, which can span
// several lines at once.
function applyLinePrefix(
  textarea: HTMLTextAreaElement,
  prefixFn: (line: string, i: number) => string,
  onChange: (value: string) => void
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const nextBreak = value.indexOf('\n', selectionEnd);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;

  const block = value.slice(lineStart, lineEnd);
  const newBlock = block.split('\n').map(prefixFn).join('\n');
  const next = value.slice(0, lineStart) + newBlock + value.slice(lineEnd);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(lineStart, lineStart + newBlock.length);
  });
}

// Heading only ever applies to the single line the cursor is on -- multiple
// lines each becoming an H2 rarely makes sense.
function applyHeading(textarea: HTMLTextAreaElement, onChange: (value: string) => void) {
  const { selectionStart, value } = textarea;
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const nextBreak = value.indexOf('\n', selectionStart);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;

  const line = value.slice(lineStart, lineEnd);
  const cleaned = line.replace(/^#+\s*/, '');
  const newLine = `## ${cleaned}`;
  const next = value.slice(0, lineStart) + newLine + value.slice(lineEnd);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(lineStart, lineStart + newLine.length);
  });
}

function insertText(
  textarea: HTMLTextAreaElement,
  text: string,
  onChange: (value: string) => void
) {
  const { selectionStart, value } = textarea;
  const next = value.slice(0, selectionStart) + text + value.slice(selectionStart);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    const pos = selectionStart + text.length;
    textarea.setSelectionRange(pos, pos);
  });
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep focus (and selection) in the textarea
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-800"
    >
      {children}
    </button>
  );
}

// A reusable Markdown field: a toolbar that inserts real Markdown/GFM
// syntax into a plain textarea (not a WYSIWYG contentEditable editor), plus
// a Preview tab that renders through the exact same <Markdown> component
// the public site uses -- so what you see here is what ships.
export default function MarkdownEditor({
  value,
  onChange,
  rows = 6,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const withTextarea = (fn: (el: HTMLTextAreaElement) => void) => {
    if (textareaRef.current) fn(textareaRef.current);
  };

  return (
    <div className="overflow-hidden rounded border border-stone-300">
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-2 py-1">
        <div
          className={`flex flex-wrap gap-0.5 ${mode === 'preview' ? 'pointer-events-none opacity-30' : ''}`}
        >
          <ToolbarButton
            label="Bold"
            onClick={() => withTextarea((el) => applyWrap(el, '**', '**', 'bold text', onChange))}
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            onClick={() => withTextarea((el) => applyWrap(el, '*', '*', 'italic text', onChange))}
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            onClick={() =>
              withTextarea((el) => applyWrap(el, '~~', '~~', 'strikethrough text', onChange))
            }
          >
            <Strikethrough size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Heading"
            onClick={() => withTextarea((el) => applyHeading(el, onChange))}
          >
            <Heading2 size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet list"
            onClick={() =>
              withTextarea((el) =>
                applyLinePrefix(
                  el,
                  (line) => (line.startsWith('- ') ? line : `- ${line}`),
                  onChange
                )
              )
            }
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            onClick={() =>
              withTextarea((el) => applyLinePrefix(el, (line, i) => `${i + 1}. ${line}`, onChange))
            }
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Link"
            onClick={() =>
              withTextarea((el) => applyWrap(el, '[', '](url)', 'link text', onChange))
            }
          >
            <Link2 size={14} />
          </ToolbarButton>
          <ToolbarButton
            label="Paragraph break"
            onClick={() => withTextarea((el) => insertText(el, '\n\n', onChange))}
          >
            <Pilcrow size={14} />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`rounded px-2 py-1 ${mode === 'write' ? 'bg-white text-teal-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`rounded px-2 py-1 ${mode === 'preview' ? 'bg-white text-teal-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full resize-y px-3 py-2 font-mono text-sm text-stone-800 focus:outline-none"
        />
      ) : (
        <div className="min-h-[3lh] px-3 py-2" style={{ minHeight: `${rows * 1.6}em` }}>
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-stone-400 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
