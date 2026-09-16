'use client';

import type { ReactNode } from 'react';

// Shared shell for every admin modal: backdrop, centering, rounded white
// box with a max-height + internal scroll, a header (title/subtitle/close),
// and an optional footer bar.
//
// Two shapes this covers:
//  - Form modals (Course/Basket/Specialization/Section/CreditCategory):
//    put the <form> in `children` with an `id`, and reference that id from
//    a `<button type="submit" form="that-id">` in `footer` -- the HTML
//    `form` attribute submits a form from anywhere else in the document,
//    so the footer can sit outside the scrollable/form area while still
//    submitting it natively (Enter-to-submit still works too).
//  - List-management modals (BasketCourses/SpecializationRequirements):
//    no form at all -- `children` is the scrollable list/picker content,
//    `footer` is just a single "Done" button.
export default function Modal({
  title,
  subtitle,
  onClose,
  maxWidth = 'max-w-lg',
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-lg bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            {subtitle && <p className="text-xs text-stone-400">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-stone-100 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}