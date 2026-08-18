import PageHeading from '@/components/ui/PageHeading';

export const metadata = { title: 'Admin Login' };

export default function AdminPage() {
  return (
    <div>
      <PageHeading title="Admin Login" />
      <div className="bg-white text-gray-700 antialiased">
        <div className="mx-auto max-w-[75rem] px-5 pt-10 pb-16">
          <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-9 shadow-sm">
            <h2 className="text-lg font-bold text-[#001A23]">Sign in</h2>
            <p className="mt-1 mb-6 text-sm text-gray-400">Authorized personnel only.</p>
            <form className="flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  User ID
                </label>
                <div className="relative">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  <input
                    id="email"
                    type="text"
                    placeholder="user id"
                    required
                    className="w-full rounded-lg border border-gray-200 py-2.5 pr-3.5 pl-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#001A23] focus:ring-4 focus:ring-[#001A23]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  >
                    <rect x="4" y="11" width="16" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-gray-200 py-2.5 pr-3.5 pl-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#001A23] focus:ring-4 focus:ring-[#001A23]/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-1 rounded-lg bg-[#001A23] py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001A23]"
              >
                Sign in
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
