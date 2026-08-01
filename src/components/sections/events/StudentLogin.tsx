"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Lock, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import { useStudentSession } from "@/lib/hooks/useStudentSession";
import { isValidStudentEmailFormat, requestStudentOtp, verifyStudentOtp } from "@/lib/studentAuth";

type Step = "idle" | "email" | "otp";

export default function StudentLogin() {
  const { isLoggedIn, loading } = useStudentSession();
  const [step, setStep] = useState<Step>("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (loading) return null;

  if (isLoggedIn) {
    return (
      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#001A23]">
          <Check size={16} className="text-amber-600" />
          You&apos;re logged in
        </div>
        <p className="mt-2 text-sm text-gray-600">
          <Link href="/internal" className="text-amber-700 hover:underline">
            Go to the Internal page →
          </Link>
        </p>
      </Card>
    );
  }

  const handleSendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isValidStudentEmailFormat(email)) {
      setError(
        "Please enter a valid JRB student email (jrb...@iitd.ac.in or ...@bird.iitd.ac.in)."
      );
      return;
    }

    setBusy(true);
    const result = await requestStudentOtp(email);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStep("otp");
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (otp.trim().length === 0) {
      setError("Please enter the code sent to your email.");
      return;
    }

    setBusy(true);
    const result = await verifyStudentOtp(email, otp);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    // useStudentSession picks up the new session automatically via
    // onAuthStateChange -- no manual state update needed here.
  };

  return (
    <Card>
      <h2 className="font-serif text-lg font-bold text-[#001A23]">Student Login</h2>

      {step === "idle" && (
        <>
          <p className="mt-2 text-sm text-gray-600">
            Login as a student to see student-specific announcements.
          </p>
          <button
            onClick={() => setStep("email")}
            className="mt-4 flex w-full items-center justify-center gap-2 border border-[#001A23] bg-[#001A23] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00303f]"
          >
            <Lock size={14} />
            Login
          </button>
        </>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode} className="mt-4 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jrb...@iitd.ac.in"
            disabled={busy}
            className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none disabled:bg-gray-50"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="border border-[#001A23] bg-[#001A23] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00303f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send Code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("idle");
              setError("");
            }}
            className="text-xs text-gray-500 hover:text-amber-700"
          >
            Cancel
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerify} className="mt-4 flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            We sent a code to <span className="font-medium text-[#001A23]">{email}</span>.
          </p>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter code"
            disabled={busy}
            className="w-full border border-gray-300 px-4 py-2.5 text-center text-sm tracking-widest focus:border-amber-400 focus:outline-none disabled:bg-gray-50"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="border border-[#001A23] bg-[#001A23] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00303f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
              setError("");
            }}
            className="text-xs text-gray-500 hover:text-amber-700"
          >
            Use a different email
          </button>
        </form>
      )}
    </Card>
  );
}