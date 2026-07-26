'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { sendContactMessage } from '@/lib/contact';

type Status = 'idle' | 'sending' | 'success' | 'error';

const COLLABORATION_TYPES = [
  'Exploratory Engagement',
  'Project Collaboration',
  'Strategic Partnership',
  'Technology Transfer',
  'Other',
];

export default function IndustryContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [collaborationType, setCollaborationType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill all required fields.');
      return;
    }

    setStatus('sending');
    const result = await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim(),
      phone: phone.trim(),
      collaborationType,
      subject: `Industry Inquiry${collaborationType ? `: ${collaborationType}` : ''}`,
      message: message.trim(),
    });

    if (result.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error);
    }
  };

  const inputClass =
    'w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400';

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center bg-amber-50 text-amber-600">
          <Check size={24} />
        </div>
        <h3 className="mt-4 font-serif text-lg font-bold text-[#001A23]">Message Sent</h3>
        <p className="mt-2 max-w-xs text-sm text-gray-600">
          Thanks for reaching out — we&apos;ve received your message and will get back to you soon.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setName('');
            setEmail('');
            setOrganization('');
            setPhone('');
            setCollaborationType('');
            setMessage('');
          }}
          className="mt-5 text-sm font-medium text-amber-700 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          disabled={status === 'sending'}
          className={inputClass}
        />
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Organization"
          disabled={status === 'sending'}
          className={inputClass}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          disabled={status === 'sending'}
          className={inputClass}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          disabled={status === 'sending'}
          className={inputClass}
        />
      </div>

      <select
        value={collaborationType}
        onChange={(e) => setCollaborationType(e.target.value)}
        disabled={status === 'sending'}
        className={`${inputClass} ${collaborationType ? 'text-[#001A23]' : 'text-gray-400'}`}
      >
        <option value="">Type of Collaboration</option>
        {COLLABORATION_TYPES.map((t) => (
          <option key={t} value={t} className="text-[#001A23]">
            {t}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="Tell us about your interest / requirements"
        required
        disabled={status === 'sending'}
        className={`${inputClass} resize-y`}
      ></textarea>

      {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="border border-[#001A23] bg-[#001A23] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00303f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
