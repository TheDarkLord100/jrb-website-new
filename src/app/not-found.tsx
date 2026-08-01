// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-5 py-20 text-center">
      <svg
        viewBox="0 0 400 330"
        className="h-64 w-64 sm:h-72 sm:w-72"
        role="img"
        aria-label="Illustration of a broken robot with a cracked eye and a detached arm"
      >
        {/* ground */}
        <line x1="60" y1="304" x2="340" y2="304" stroke="#001A23" strokeWidth="2" strokeLinecap="round" />

        {/* detached arm on the ground */}
        <line
          x1="285"
          y1="292"
          x2="332"
          y2="300"
          stroke="#001A23"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="332" cy="300" r="9" fill="white" stroke="#001A23" strokeWidth="3" />
        {/* loose bolts */}
        <polygon points="255,296 259,298.5 259,303.5 255,306 251,303.5 251,298.5" fill="#fbbf24" />
        <polygon points="270,300 274,302.5 274,307.5 270,310 266,307.5 266,302.5" fill="#fbbf24" />

        {/* dashed wire from empty shoulder socket to the detached arm */}
        <path
          d="M252 192 Q276 230 288 288"
          fill="none"
          stroke="#001A23"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* legs */}
        <line x1="172" y1="278" x2="172" y2="300" stroke="#001A23" strokeWidth="9" strokeLinecap="round" />
        <line x1="228" y1="278" x2="228" y2="300" stroke="#001A23" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="172" cy="303" rx="12" ry="5" fill="white" stroke="#001A23" strokeWidth="3" />
        <ellipse cx="228" cy="303" rx="12" ry="5" fill="white" stroke="#001A23" strokeWidth="3" />

        {/* left arm (still attached) */}
        <line x1="150" y1="192" x2="112" y2="238" stroke="#001A23" strokeWidth="9" strokeLinecap="round" />
        <circle cx="112" cy="238" r="10" fill="white" stroke="#001A23" strokeWidth="3" />

        {/* torso */}
        <rect x="150" y="170" width="100" height="110" rx="8" fill="white" stroke="#001A23" strokeWidth="4" />

        {/* empty right shoulder socket with a spark */}
        <circle cx="250" cy="192" r="6" fill="white" stroke="#001A23" strokeWidth="3" />
        <path
          d="M250 178 L256 188 L248 188 L254 198"
          fill="none"
          stroke="#d97706"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* chest screen */}
        <rect x="170" y="196" width="60" height="34" rx="3" fill="#001A23" />
        <text
          x="200"
          y="220"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="18"
          fontWeight="700"
          fill="#fbbf24"
        >
          404
        </text>

        {/* neck joint */}
        <circle cx="198" cy="168" r="6" fill="#fbbf24" stroke="#001A23" strokeWidth="2" />

        {/* head, tilted for a "broken" posture */}
        <g transform="rotate(-8 200 108)">
          <rect x="155" y="68" width="90" height="80" rx="10" fill="white" stroke="#001A23" strokeWidth="4" />

          {/* left eye -- normal */}
          <rect x="172" y="98" width="14" height="14" rx="2" fill="#001A23" />

          {/* right eye -- broken, X'd out */}
          <line x1="210" y1="98" x2="224" y2="112" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="224" y1="98" x2="210" y2="112" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />

          {/* mouth grille, one bar knocked crooked */}
          <line x1="180" y1="130" x2="180" y2="138" stroke="#001A23" strokeWidth="3" strokeLinecap="round" />
          <line x1="198" y1="130" x2="196" y2="140" stroke="#001A23" strokeWidth="3" strokeLinecap="round" />
          <line x1="216" y1="130" x2="216" y2="138" stroke="#001A23" strokeWidth="3" strokeLinecap="round" />

          {/* crack across the head */}
          <path
            d="M228 74 L222 88 L230 96 L221 112"
            fill="none"
            stroke="#d97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* bent antenna with a spark at the tip */}
          <path d="M188 68 L172 42" fill="none" stroke="#001A23" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M172 42 L182 32 L172 30 L184 18"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <h1 className="font-serif mt-4 text-2xl font-bold text-[#001A23] sm:text-3xl">
        Page Not Found
      </h1>
      <div className="mx-auto mt-2 h-0.5 w-12 bg-amber-400" />

      <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist, may have been moved, or the link
        might be broken.
      </p>

      <Link
        href="/"
        className="mt-8 border border-gray-300 px-6 py-2.5 text-sm font-medium text-[#001A23] transition-colors hover:border-amber-400 hover:text-amber-700"
      >
        ← Back to Home
      </Link>
    </div>
  );
}