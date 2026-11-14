import React from 'react';

export default function BuildoffRobotSvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground Line */}
      <line x1="10" y1="215" x2="310" y2="215" stroke="#FBBF24" strokeWidth="3" />
      {/* 10L Onboard Bin */}
      <rect
        x="35"
        y="75"
        width="85"
        height="60"
        rx="4"
        fill="#1E293B"
        stroke="#475569"
        strokeWidth="2"
      />
      <rect x="30" y="70" width="95" height="8" rx="3" fill="#334155" />
      <text x="55" y="110" fill="#94A3B8" fontSize="11" fontWeight="bold">
        10L BIN
      </text>
      {/* Camera Mast */}
      <rect x="130" y="55" width="8" height="80" fill="#1E293B" />
      <rect
        x="120"
        y="42"
        width="28"
        height="18"
        rx="4"
        fill="#0F172A"
        stroke="#38BDF8"
        strokeWidth="2"
      />
      <circle cx="134" cy="51" r="4" fill="#38BDF8" />
      {/* AMR Chassis */}
      <rect x="25" y="135" width="185" height="55" rx="10" fill="#F59E0B" />
      <line
        x1="85"
        y1="152"
        x2="95"
        y2="172"
        stroke="#001A23"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="152"
        x2="110"
        y2="172"
        stroke="#001A23"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="115"
        y1="152"
        x2="125"
        y2="172"
        stroke="#001A23"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Robotic Manipulator Arm */}
      <path
        d="M165 135 L215 45 L275 140"
        stroke="#FBBF24"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="165" cy="135" r="12" fill="#1E293B" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="215" cy="45" r="10" fill="#1E293B" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="275" cy="140" r="9" fill="#1E293B" stroke="#FBBF24" strokeWidth="3" />
      {/* Gripper & Can */}
      <path
        d="M275 148 L263 172 M275 148 L287 172"
        stroke="#1E293B"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="264" y="175" width="22" height="32" rx="3" fill="#EA580C" />
      {/* Wheels */}
      <circle cx="65" cy="190" r="24" fill="#0F172A" stroke="#334155" strokeWidth="4" />
      <circle cx="65" cy="190" r="10" fill="#F59E0B" />
      <circle cx="165" cy="190" r="24" fill="#0F172A" stroke="#334155" strokeWidth="4" />
      <circle cx="165" cy="190" r="10" fill="#F59E0B" />
    </svg>
  );
}
