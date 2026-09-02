'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeading from '@/components/ui/PageHeading';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

export default function AdminPage() {
  const router = useRouter();
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      setError('Invalid email or password.');
      return;
    }

    router.push('/admin/dashboard');
  };

  return (
    <div>
      <PageHeading title="Admin Login" />
      <div className="bg-white text-gray-700 antialiased">
        <div className="mx-auto max-w-[75rem] px-5 pt-10 pb-16">
          <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-9 shadow-sm">
            <h2 className="text-lg font-bold text-[#001A23]">Sign in</h2>
            <p className="mt-1 mb-6 text-sm text-gray-400">Authorized personnel only.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@iitd.ac.in"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#001A23] focus:ring-4 focus:ring-[#001A23]/10"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#001A23] focus:ring-4 focus:ring-[#001A23]/10"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 rounded-lg bg-[#001A23] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Not an admin?{' '}
              <a href="/" className="font-semibold text-[#001A23] hover:underline">
                Return to site
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}