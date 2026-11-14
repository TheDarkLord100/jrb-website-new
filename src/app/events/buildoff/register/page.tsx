import Link from 'next/link';
import BuildoffRegistrationForm from '@/components/sections/events/BuildoffRegistrationForm';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Register for BuildOff 2026',
  description: 'Team registration for the CoE-BIRD IIT Delhi BuildOff 2026 Robotics Challenge.',
  path: '/events/buildoff/register',
});

export default function BuildoffRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-5 py-12 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/events/buildoff"
            className="text-sm font-semibold text-[#001A23] transition-colors hover:text-amber-600"
          >
            ← Back to Event Details
          </Link>
        </div>

        <div className="rounded-3xl bg-[#001A23] p-8 text-white shadow-2xl sm:p-14">
          <div className="text-center">
            <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300">
              BuildOff 2026
            </span>
            <h1 className="mt-3 text-3xl font-bold">Team Registration</h1>
            <p className="mx-auto mt-2 mb-10 max-w-xl text-sm text-gray-300">
              Register your team of 3–5 IIT Delhi students for the Autonomous Garbage-Collecting
              Robot Challenge.
            </p>
          </div>

          {/* Form component loaded in isolation here */}
          <BuildoffRegistrationForm />
        </div>
      </div>
    </div>
  );
}
