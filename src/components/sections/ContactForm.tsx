"use client";

import { useRef } from "react";

export default function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const subject = subjectRef.current?.value.trim() || "Contact from Website";
    const message = messageRef.current?.value.trim() ?? "";

    if (!name || !email || !message) {
      alert("Please fill all required fields.");
      return;
    }

    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:robotics@iitd.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#001A23] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input ref={nameRef} type="text" placeholder="Your Name" required className={inputClass} />
      <input ref={emailRef} type="email" placeholder="Your Email" required className={inputClass} />
      <input ref={subjectRef} type="text" placeholder="Subject" className={inputClass} />
      <textarea
        ref={messageRef}
        rows={5}
        placeholder="Message"
        className={`${inputClass} resize-y`}
      ></textarea>

      <button
        type="submit"
        className="rounded-full bg-[#001A23] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00303f]"
      >
        Send Message
      </button>
      <p className="text-xs text-gray-400">
        Clicking &ldquo;Send Message&rdquo; will open your email app.
      </p>
    </form>
  );
}
