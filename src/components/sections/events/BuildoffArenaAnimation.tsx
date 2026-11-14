'use client';

import React, { useState, useEffect, useRef } from 'react';

const TOTAL_DURATION = 34; // 34-second 60fps continuous loop

interface GarbageItem {
  id: number;
  x: number;
  y: number;
  label: string;
  shape: 'can' | 'cup' | 'bottle';
  color: string;
  pickStart: number;
  pickEnd: number;
  dumpTime: number;
  onRaisedDeck?: boolean;
}

const PLANTS = [
  { id: 1, x: 175, y: 175, r: 24, label: 'Plant 1' },
  { id: 2, x: 430, y: 115, r: 26, label: 'Plant 2' },
  { id: 3, x: 545, y: 342, r: 23, label: 'Plant 3' },
];

const GARBAGE: GarbageItem[] = [
  {
    id: 1,
    x: 250,
    y: 72,
    label: 'Can #1 (3.3L)',
    shape: 'can',
    color: '#EA580C',
    pickStart: 4.5,
    pickEnd: 7.5,
    dumpTime: 24.7,
  },
  {
    id: 2,
    x: 370,
    y: 295,
    label: 'Cup #2 (3.3L)',
    shape: 'cup',
    color: '#D97706',
    pickStart: 11.0,
    pickEnd: 14.0,
    dumpTime: 25.0,
  },
  {
    id: 3,
    x: 642,
    y: 98,
    label: 'Bottle #3 (3.4L)',
    shape: 'bottle',
    color: '#0284C7',
    pickStart: 17.5,
    pickEnd: 20.5,
    dumpTime: 25.3,
    onRaisedDeck: true,
  },
  {
    id: 4,
    x: 675,
    y: 275,
    label: 'Can #4 (3.3L)',
    shape: 'can',
    color: '#EA580C',
    pickStart: 28.2,
    pickEnd: 31.0,
    dumpTime: 32.8,
  },
];

// --- MATH & KINEMATICS HELPERS ---
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(min: number, max: number, value: number) {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function quadBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  t: number
): [number, number] {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

function cubicBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number
): { x: number; y: number; angle: number; speed: number } {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
  const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];

  const dx =
    3 * uu * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * tt * (p3[0] - p2[0]);
  const dy =
    3 * uu * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * tt * (p3[1] - p2[1]);

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const speed = Math.hypot(dx, dy);
  return { x, y, angle, speed };
}

function lerpAngle(a: number, b: number, t: number) {
  const diff = ((((b - a) % 360) + 540) % 360) - 180;
  return a + diff * t;
}

function solveIK(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  L1: number,
  L2: number
) {
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = clamp(Math.hypot(dx, dy), Math.abs(L1 - L2) + 0.1, L1 + L2 - 0.1);
  const baseAngle = Math.atan2(dy, dx);
  const cosAlpha = clamp(
    (dist * dist + L1 * L1 - L2 * L2) / (2 * dist * L1),
    -1,
    1
  );
  const alpha = Math.acos(cosAlpha);
  const theta1 = baseAngle - alpha;
  const ex = sx + L1 * Math.cos(theta1);
  const ey = sy + L1 * Math.sin(theta1);
  return { ex, ey, wx: tx, wy: ty };
}

export default function BuildoffArenaAnimation() {
  const [isMounted, setIsMounted] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = null;
      return;
    }
    let animId: number;
    const tick = (now: number) => {
      if (lastFrameRef.current !== null) {
        const dt = (now - lastFrameRef.current) / 1000;
        setTime((prev) => (prev + dt * speed) % TOTAL_DURATION);
      }
      lastFrameRef.current = now;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed]);

  if (!isMounted) {
    return <div className="min-h-[450px] w-full animate-pulse rounded-3xl border border-slate-800 bg-[#00141B] shadow-2xl" />;
  }

  // --- 1. MOVING OBSTACLE TRAJECTORY ---
  const movObsX = 252 + Math.sin((time / TOTAL_DURATION) * Math.PI * 4) * 14;
  const movObsY = 192 + Math.cos((time / TOTAL_DURATION) * Math.PI * 6) * 26;

  // --- 2. ROBOT POSE, ODOMETRY & RAMP ELEVATION ---
  let rx = 95;
  let ry = 335;
  let rAngle = 0;
  let phaseName = '1. Undocking & Arena Scan';
  let phaseDetail = 'Onboard compute initialized; LiDAR scanning arena obstacles.';
  let chassisPitch = 0;
  let deckElevation = 0;
  let odomDist = 0;
  let isMoving = false;

  if (time < 1.0) {
    const s = smoothstep(0, 1.0, time);
    rx = lerp(95, 128, s);
    ry = 335;
    rAngle = 0;
    odomDist = s * 35;
    isMoving = true;
  } else if (time < 4.5) {
    const s = smoothstep(1.0, 4.5, time);
    const pos = cubicBezier([128, 335], [88, 175], [120, 72], [206, 72], s);
    rx = pos.x;
    ry = pos.y;
    rAngle = lerpAngle(pos.angle, 0, smoothstep(0.8, 1.0, s));
    odomDist = 35 + s * 290;
    isMoving = true;
    phaseName = '1. Active Obstacle Avoidance (Plant #1)';
    phaseDetail = 'Curving trajectory around Plant #1 using onboard LiDAR costmap.';
  } else if (time < 7.5) {
    rx = 206;
    ry = 72;
    rAngle = 0;
    odomDist = 325;
    phaseName = '2. Pick & Bin — Item #1 (Can)';
    phaseDetail = '2-DOF arm grasps can, lifts over vision mast, and drops into 10 L rear bin.';
  } else if (time < 11.0) {
    const s = smoothstep(7.5, 11.0, time);
    const pos = cubicBezier([206, 72], [355, 72], [385, 200], [326, 295], s);
    rx = pos.x;
    ry = pos.y;
    rAngle = lerpAngle(pos.angle, 0, smoothstep(0.78, 1.0, s));
    odomDist = 325 + s * 280;
    isMoving = true;
    phaseName = '3. Dynamic Moving Obstacle Avoidance';
    phaseDetail = 'Direct path blocked! Local planner detours wide around the moving obstacle.';
  } else if (time < 14.0) {
    rx = 326;
    ry = 295;
    rAngle = 0;
    odomDist = 605;
    phaseName = '2. Pick & Bin — Item #2 (Cup)';
    phaseDetail = 'Stowing cup into the 10 L rear bin (67% capacity).';
  } else if (time < 17.5) {
    const s = smoothstep(14.0, 17.5, time);
    const pos = cubicBezier([326, 295], [510, 300], [548, 225], [598, 98], s);
    rx = pos.x;
    ry = pos.y;
    rAngle = lerpAngle(pos.angle, 0, smoothstep(0.75, 1.0, s));
    odomDist = 605 + s * 310;
    isMoving = true;
    const climbProgress = smoothstep(0.32, 0.78, s);
    deckElevation = climbProgress * 34;
    if (s > 0.28 && s < 0.82) {
      chassisPitch = -11 * Math.sin(((s - 0.28) / 0.54) * Math.PI);
    }
    phaseName = '2. Climbing Ramp to Raised Platform';
    phaseDetail = 'Ascending the 12° incline ramp onto the raised platform.';
  } else if (time < 20.5) {
    rx = 598;
    ry = 98;
    rAngle = 0;
    odomDist = 915;
    deckElevation = 34;
    phaseName = '2. Pick on Raised Ground — Bin 100% Full!';
    phaseDetail = 'Bottle #3 stowed on raised platform. 10 L onboard bin has reached 100% capacity!';
  } else if (time < 24.0) {
    const s = smoothstep(20.5, 24.0, time);
    const pos = cubicBezier([598, 98], [545, 245], [370, 335], [122, 335], s);
    rx = pos.x;
    ry = pos.y;
    rAngle = lerpAngle(pos.angle, 0, smoothstep(0.6, 0.95, s));
    odomDist = s < 0.82 ? 915 + (s / 0.82) * 340 : 1255 - ((s - 0.82) / 0.18) * 45;
    isMoving = true;
    const descendProgress = 1 - smoothstep(0.12, 0.48, s);
    deckElevation = descendProgress * 34;
    if (s > 0.1 && s < 0.5) {
      chassisPitch = 11 * Math.sin(((s - 0.1) / 0.4) * Math.PI);
    }
    phaseName = '4. Returning to Station (Bin Full)';
    phaseDetail = 'Descending ramp and backing rear-first into the docking station.';
  } else if (time < 26.2) {
    rx = 122;
    ry = 335;
    rAngle = 0;
    odomDist = 1210;
    phaseName = '4. Empty When Full (Hydraulic Bin Tip)';
    phaseDetail = 'Actuator tilts 10 L bin 68°; tailgate opens and tips waste into station.';
  } else if (time < 28.2) {
    const s = smoothstep(26.2, 28.2, time);
    const pos = cubicBezier([122, 335], [340, 320], [470, 235], [631, 275], s);
    rx = pos.x;
    ry = pos.y;
    rAngle = lerpAngle(pos.angle, 0, smoothstep(0.75, 1.0, s));
    odomDist = 1210 + s * 320;
    isMoving = true;
    phaseName = '1. Sweeping Final Sector (Avoiding Plant #3)';
    phaseDetail = 'Navigating around Plant #3 to collect the final garbage item.';
  } else if (time < 31.0) {
    rx = 631;
    ry = 275;
    rAngle = 0;
    odomDist = 1530;
    phaseName = '2. Pick & Bin — Final Item #4';
    phaseDetail = 'Collecting the last piece of litter in the arena.';
  } else if (time < 32.5) {
    const s = smoothstep(31.0, 32.5, time);
    const pos = cubicBezier([631, 275], [460, 235], [290, 335], [122, 335], s);
    rx = pos.x;
    ry = pos.y;
    rAngle = lerpAngle(pos.angle, 0, smoothstep(0.65, 1.0, s));
    odomDist = s < 0.8 ? 1530 + (s / 0.8) * 280 : 1810 - ((s - 0.8) / 0.2) * 40;
    isMoving = true;
    phaseName = '5. Returning for Final Dock';
    phaseDetail = 'Arena clear! Returning to base station.';
  } else {
    rx = 122;
    ry = 335;
    rAngle = 0;
    odomDist = 1770;
    phaseName = '5. Finish at Rest — Arena 100% Clear';
    phaseDetail = 'Final item tipped into station. Robot parked autonomously at rest.';
  }

  // --- 3. ANALYTICAL INVERSE KINEMATICS FOR 2-DOF ARM ---
  let activePickItem: GarbageItem | null = null;
  let pickProgress = 0;

  let approachingItem: GarbageItem | null = null;
  let approachOffset = 0;

  for (const item of GARBAGE) {
    if (time >= item.pickStart && time <= item.pickEnd) {
      activePickItem = item;
      pickProgress = (time - item.pickStart) / (item.pickEnd - item.pickStart);
      break;
    }
    if (time >= item.pickStart - 1.8 && time < item.pickStart) {
      approachingItem = item;
      const p = smoothstep(item.pickStart - 1.8, item.pickStart, time);
      approachOffset = (1 - p) * 115;
    }
  }

  const shoulderX = 190;
  const shoulderY = 134;
  let wristTargetX = 212;
  let wristTargetY = 92;
  let jawSpread = 6;
  let gripperAngleDeg = 45;
  let itemState: 'on_ground' | 'in_gripper' | 'falling_in_bin' | 'stowed' = 'stowed';

  // FIX: Properly ground the items down to Y = 201 so they sit exactly on the floor line
  let itemSideX = 258;
  let itemSideY = 201;
  let itemSideRot = 0;

  let turretAngle = 0;
  let topDownReach = 18;

  if (activePickItem) {
    if (pickProgress < 0.18) {
      const p = smoothstep(0, 0.18, pickProgress);
      wristTargetX = lerp(212, 258, p);
      wristTargetY = lerp(92, 144, p); // Fixed
      jawSpread = lerp(6, 13, p);
      gripperAngleDeg = lerp(45, 90, p);
      itemState = 'on_ground';
      turretAngle = 0;
      topDownReach = lerp(18, 29, p);
    } else if (pickProgress < 0.3) {
      const descend = smoothstep(0.18, 0.25, pickProgress);
      const clampP = smoothstep(0.24, 0.3, pickProgress);
      wristTargetX = 258;
      wristTargetY = lerp(144, 185, descend); // Fixed
      jawSpread = lerp(13, 9, clampP);
      gripperAngleDeg = 90;
      itemState = pickProgress < 0.26 ? 'on_ground' : 'in_gripper';
      turretAngle = 0;
      topDownReach = 31;
    } else if (pickProgress < 0.64) {
      const p = smoothstep(0.3, 0.64, pickProgress);
      const [bx, by] = quadBezier([258, 185], [184, 14], [112, 58], p); // Fixed
      wristTargetX = bx;
      wristTargetY = by;
      jawSpread = 9;
      gripperAngleDeg = lerp(90, 90, p);
      itemState = 'in_gripper';
      turretAngle = lerp(0, 180, p);
      topDownReach = lerp(31, 21, p);
    } else if (pickProgress < 0.82) {
      const p = clamp((pickProgress - 0.64) / 0.18, 0, 1);
      wristTargetX = 112;
      wristTargetY = 58;
      jawSpread = lerp(9, 13, smoothstep(0, 0.35, p));
      gripperAngleDeg = 90;
      itemState = 'falling_in_bin';
      itemSideX = 112;
      itemSideY = lerp(74, 114, p * p);
      itemSideRot = p * 25;
      turretAngle = 180;
      topDownReach = 21;
    } else {
      const p = smoothstep(0.82, 1.0, pickProgress);
      const [bx, by] = quadBezier([112, 58], [176, 24], [212, 92], p);
      wristTargetX = bx;
      wristTargetY = by;
      jawSpread = lerp(13, 6, p);
      gripperAngleDeg = lerp(90, 45, p);
      itemState = 'stowed';
      turretAngle = lerp(180, 0, p);
      topDownReach = lerp(21, 18, p);
    }
  }

  const ik = solveIK(shoulderX, shoulderY, wristTargetX, wristTargetY, 58, 56);

  if (itemState === 'in_gripper') {
    const rad = (gripperAngleDeg * Math.PI) / 180;
    itemSideX = ik.wx + Math.cos(rad) * 16;
    itemSideY = ik.wy + Math.sin(rad) * 16;
  }

  // --- 4. REAR BIN TIPPING & TAILGATE KINEMATICS ---
  let binTiltDeg = 0;
  if (time >= 24.1 && time <= 26.1) {
    const p = (time - 24.1) / 2.0;
    binTiltDeg =
      p < 0.35
        ? smoothstep(0, 0.35, p) * 68
        : p < 0.75
          ? 68
          : (1 - smoothstep(0.75, 1.0, p)) * 68;
  } else if (time >= 32.4 && time <= 33.6) {
    const p = (time - 32.4) / 1.2;
    binTiltDeg =
      p < 0.4
        ? smoothstep(0, 0.4, p) * 68
        : p < 0.75
          ? 68
          : (1 - smoothstep(0.75, 1.0, p)) * 68;
  }

  const itemsInRobotBin = GARBAGE.filter(
    (g) =>
      time >= g.pickStart + (g.pickEnd - g.pickStart) * 0.78 && time < g.dumpTime
  );
  const itemsInStationBin = GARBAGE.filter((g) => time >= g.dumpTime);
  const binLitres = Math.min(10, Number((itemsInRobotBin.length * 3.34).toFixed(1)));
  const binPercent = Math.min(100, Math.round((binLitres / 10) * 100));

  // --- 5. 360° LIDAR RAYCASTING ---
  const lidarRays = Array.from({ length: 28 }).map((_, idx) => {
    const relAngle = (idx / 28) * Math.PI * 2;
    const worldAngle = relAngle + (rAngle * Math.PI) / 180;
    const maxDist = 92;
    let hitDist = maxDist;
    let hitObstacle = false;

    const obstacles = [
      ...PLANTS.map((p) => ({ x: p.x, y: p.y, r: p.r + 4 })),
      { x: movObsX, y: movObsY, r: 18 },
    ];

    const dx = Math.cos(worldAngle);
    const dy = Math.sin(worldAngle);

    for (const obs of obstacles) {
      const fx = rx - obs.x;
      const fy = ry - obs.y;
      const b = 2 * (fx * dx + fy * dy);
      const c = fx * fx + fy * fy - obs.r * obs.r;
      const disc = b * b - 4 * c;
      if (disc >= 0) {
        const tHit = (-b - Math.sqrt(disc)) / 2;
        if (tHit > 0 && tHit < hitDist) {
          hitDist = tHit;
          hitObstacle = true;
        }
      }
    }

    return {
      x2: Math.cos(relAngle) * hitDist,
      y2: Math.sin(relAngle) * hitDist,
      hitObstacle,
    };
  });

  const groundScrollOffset = ((odomDist * 1.4) % 40 + 40) % 40;
  const wheelRotDeg = odomDist * 2.6;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#00141B] text-white shadow-2xl">
      {/* TOP TELEMETRY & MISSION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#001A23] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase">
                {phaseName}
              </span>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                ONBOARD COMPUTE • IK + NAV2
              </span>
            </div>
            <p className="text-xs text-gray-300">{phaseDetail}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5">
            <span className="text-gray-400">10 L Rear Bin:</span>
            <div className="h-2.5 w-20 overflow-hidden rounded-full bg-gray-800">
              <div
                className={`h-full transition-all duration-150 ${
                  binPercent >= 100 ? 'bg-red-500' : 'bg-amber-400'
                }`}
                style={{ width: `${binPercent}%` }}
              />
            </div>
            <span
              className={`font-mono font-bold ${
                binPercent >= 100 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {binLitres.toFixed(1)}/10L
            </span>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5">
            <span className="text-gray-400">Station Bin: </span>
            <span className="font-mono font-bold text-emerald-400">
              {itemsInStationBin.length}/4 Cleared
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-lg bg-amber-400 px-3.5 py-1.5 font-bold text-[#001A23] transition hover:bg-amber-300"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
              className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono font-semibold text-white transition hover:bg-white/15"
            >
              {speed}x
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.5fr_1.05fr]">
        {/* VIEW 1: TOP-DOWN AUTONOMOUS ARENA */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#F7F4EB]">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md bg-[#001A23]/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Top-Down Arena Navigation & Dynamic Avoidance
          </div>

          <svg viewBox="0 0 740 400" className="h-auto w-full">
            <defs>
              <pattern id="floorGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#E5E0D5" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="740" height="400" fill="url(#floorGrid)" />
            <rect x="6" y="6" width="728" height="388" rx="14" fill="none" stroke="#1E293B" strokeWidth="3" />

            <g>
              <rect x="500" y="20" width="220" height="165" rx="10" fill="#EAE5D9" stroke="#94A3B8" strokeWidth="2.5" />
              <text x="610" y="42" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold">
                RAISED PLATFORM (+15 CM)
              </text>
              <rect x="518" y="185" width="76" height="68" fill="#F2EFE9" stroke="#94A3B8" strokeWidth="2" />
              {[198, 211, 224, 237].map((yLine) => (
                <line key={yLine} x1="518" y1={yLine} x2="594" y2={yLine} stroke="#CBD5E1" strokeWidth="2" />
              ))}
              <text x="556" y="266" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold">RAMP</text>
            </g>

            <path
              d="M 128 335 C 88 175, 120 72, 206 72 C 355 72, 385 200, 326 295 C 510 300, 548 225, 598 98 C 545 245, 370 335, 122 335 C 340 320, 470 235, 631 275"
              fill="none"
              stroke="#65A30D"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              opacity="0.55"
            />

            {time >= 7.0 && time <= 11.2 && (
              <g>
                <line x1="206" y1="72" x2="326" y2="295" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
                <path d="M 206 72 C 355 72, 385 200, 326 295" fill="none" stroke="#16A34A" strokeWidth="3.5" />
                <rect x="308" y="118" width="116" height="18" rx="4" fill="#16A34A" />
                <text x="366" y="130" textAnchor="middle" fill="#FFF" fontSize="8.5" fontWeight="bold">✓ REPLANNED DETOUR</text>
              </g>
            )}

            <g transform="translate(22, 280)">
              <rect x="0" y="0" width="92" height="100" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
              <rect x="14" y="16" width="64" height="56" rx="6" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              <text x="46" y="88" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontWeight="bold">STATION BIN</text>
              {itemsInStationBin.map((item, idx) => (
                <circle key={item.id} cx={28 + (idx % 2) * 24} cy={34 + Math.floor(idx / 2) * 20} r="7" fill={item.color} stroke="#FFF" strokeWidth="1.5" />
              ))}
            </g>

            {PLANTS.map((plant) => {
              const dist = Math.hypot(rx - plant.x, ry - plant.y);
              const isNear = dist < 105;
              return (
                <g key={plant.id} transform={`translate(${plant.x}, ${plant.y})`}>
                  <circle cx="0" cy="0" r={plant.r + 18} fill={isNear ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.05)'} stroke={isNear ? '#EF4444' : '#94A3B8'} strokeWidth={isNear ? '2' : '1'} strokeDasharray="4 4" />
                  <circle cx="0" cy="0" r={plant.r} fill="#15803D" />
                  <circle cx="-5" cy="-5" r={plant.r * 0.65} fill="#22C55E" />
                  <circle cx="-9" cy="-9" r={plant.r * 0.28} fill="#86EFAC" />
                  <text x="0" y={plant.r + 13} textAnchor="middle" fill={isNear ? '#DC2626' : '#166534'} fontSize="9" fontWeight="bold">{isNear ? '⚠ AVOIDING PLANT' : plant.label}</text>
                </g>
              );
            })}

            {(() => {
              const distToMov = Math.hypot(rx - movObsX, ry - movObsY);
              const isAvoidingMov = distToMov < 125;
              return (
                <g transform={`translate(${movObsX}, ${movObsY})`}>
                  <circle cx="0" cy="0" r="30" fill={isAvoidingMov ? 'rgba(239, 68, 68, 0.16)' : 'rgba(245, 158, 11, 0.12)'} stroke={isAvoidingMov ? '#EF4444' : '#F59E0B'} strokeWidth={isAvoidingMov ? '2' : '1.5'} strokeDasharray="4 3" />
                  <circle cx="0" cy="0" r="13" fill="#334155" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill="#F59E0B" />
                  <text x="0" y="-34" textAnchor="middle" fill={isAvoidingMov ? '#DC2626' : '#475569'} fontSize="8.5" fontWeight="bold">{isAvoidingMov ? '⚠ AVOIDING DYNAMIC OBS' : 'MOVING OBSTACLE'}</text>
                </g>
              );
            })()}

            {GARBAGE.map((item) => {
              const pickedTime = item.pickStart + (item.pickEnd - item.pickStart) * 0.26;
              if (time >= pickedTime) return null;
              const isBeingTargeted = time >= item.pickStart - 0.8 && time < pickedTime;

              return (
                <g key={item.id} transform={`translate(${item.x}, ${item.y})`}>
                  {isBeingTargeted && (
                    <g>
                      <rect x="-16" y="-16" width="32" height="32" rx="4" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 2" />
                      <text x="0" y="-20" textAnchor="middle" fill="#0284C7" fontSize="8.5" fontWeight="bold">TARGET LOCKED</text>
                    </g>
                  )}
                  {item.shape === 'bottle' ? (
                    <rect x="-8" y="-8" width="16" height="16" rx="3" fill={item.color} stroke="#FFF" strokeWidth="1.5" />
                  ) : (
                    <circle cx="0" cy="0" r="8.5" fill={item.color} stroke="#FFF" strokeWidth="1.5" />
                  )}
                </g>
              );
            })}

            <g transform={`translate(${rx}, ${ry}) rotate(${rAngle})`}>
              {lidarRays.map((ray, i) => (
                <g key={i}>
                  <line x1="0" y1="0" x2={ray.x2} y2={ray.y2} stroke={ray.hitObstacle ? '#EF4444' : '#0284C7'} strokeWidth={ray.hitObstacle ? '1.2' : '0.6'} opacity={ray.hitObstacle ? '0.65' : '0.22'} />
                  {ray.hitObstacle && <circle cx={ray.x2} cy={ray.y2} r="2" fill="#EF4444" />}
                </g>
              ))}

              <rect x="-22" y="-22" width="44" height="6" rx="2" fill="#0F172A" />
              <rect x="-22" y="16" width="44" height="6" rx="2" fill="#0F172A" />
              <rect x="-24" y="-17" width="48" height="34" rx="6" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />

              <g transform={`translate(${-binTiltDeg * 0.15}, 0)`}>
                <rect x="-21" y="-13" width="22" height="26" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                {itemsInRobotBin.map((it, idx) => (
                  <circle key={it.id} cx={-14 + (idx % 2) * 8 - binTiltDeg * 0.2} cy={-6 + Math.floor(idx / 2) * 11} r="4" fill={it.color} stroke="#FFF" strokeWidth="0.8" />
                ))}
              </g>

              <g transform={`translate(10, 0) rotate(${turretAngle})`}>
                <line x1="0" y1="0" x2={topDownReach} y2="0" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
                <line x1="0" y1="0" x2={topDownReach} y2="0" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <path
                  d={
                    jawSpread < 8
                      ? `M ${topDownReach} -3.5 L ${topDownReach + 8} -1.5 M ${topDownReach} 3.5 L ${topDownReach + 8} 1.5`
                      : `M ${topDownReach} -6 L ${topDownReach + 8} -5.5 M ${topDownReach} 6 L ${topDownReach + 8} 5.5`
                  }
                  stroke="#0F172A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {(itemState === 'in_gripper' || itemState === 'falling_in_bin') && activePickItem && (
                  <circle cx={topDownReach + 5} cy="0" r="5.5" fill={activePickItem.color} stroke="#FFF" strokeWidth="1.2" />
                )}
                <circle cx="0" cy="0" r="5.5" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.5" />
              </g>
            </g>
          </svg>
        </div>

        {/* VIEW 2: LIVE SIDE-PROFILE KINEMATICS, SCROLLING GROUND & RAMP CAM */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#071E26] p-4">
          <div className="flex flex-col items-start gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold tracking-wider text-white uppercase">
                Side-Profile Cam: IK Arm, 10 L Bin & Terrain
              </span>
            </div>
            <span className="rounded bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
              {binTiltDeg > 5
                ? 'ACTION: HYDRAULIC BIN DUMP'
                : activePickItem
                  ? `PICKING: ${activePickItem.label.toUpperCase()}`
                  : deckElevation > 2
                    ? `RAMP / RAISED DECK (+${Math.round((deckElevation / 34) * 15)}cm)`
                    : isMoving
                      ? 'LOCOMOTION: CRUISING'
                      : 'MODE: STANDBY'}
            </span>
          </div>

          <svg viewBox="0 0 350 240" className="my-auto h-auto w-full">
            <defs>
              <pattern
                id="movingGroundTicks"
                width="40"
                height="18"
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${-groundScrollOffset}, 0)`}
              >
                <line x1="0" y1="0" x2="20" y2="0" stroke="#38BDF8" strokeWidth="2" opacity="0.35" />
                <line x1="12" y1="3" x2="4" y2="15" stroke="#334155" strokeWidth="2" />
                <line x1="32" y1="3" x2="24" y2="15" stroke="#334155" strokeWidth="2" />
              </pattern>
            </defs>

            <rect x="0" y="212" width="350" height="22" fill="#0F172A" />
            <rect x="0" y="212" width="350" height="18" fill="url(#movingGroundTicks)" />
            <line x1="0" y1="212" x2="350" y2="212" stroke="#FBBF24" strokeWidth="2.5" />

            {deckElevation > 0.2 && (
              <g>
                <polygon
                  points={`35,${212} 85,${212 - deckElevation} 350,${212 - deckElevation} 350,212`}
                  fill="#1E293B"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
                <line
                  x1="85"
                  y1={212 - deckElevation}
                  x2="350"
                  y2={212 - deckElevation}
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeDasharray="14 12"
                  strokeDashoffset={groundScrollOffset}
                />
                <text x="215" y={226 - deckElevation} textAnchor="middle" fill="#FBBF24" fontSize="8.5" fontWeight="bold">
                  ▲ RAISED PLATFORM (+15 CM ELEVATION)
                </text>
              </g>
            )}

            {(time >= 23.4 && time <= 26.5) || time >= 32.0 ? (
              <g transform="translate(6, 134)">
                <rect x="0" y="0" width="56" height="76" rx="5" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
                <rect x="6" y="8" width="44" height="52" rx="3" fill="#0F172A" />
                {itemsInStationBin.map((it, idx) => (
                  <rect key={it.id} x={12 + (idx % 2) * 18} y={40 - Math.floor(idx / 2) * 16} width="13" height="14" rx="2" fill={it.color} stroke="#FFF" strokeWidth="1" />
                ))}
                <text x="28" y="71" textAnchor="middle" fill="#FBBF24" fontSize="7.5" fontWeight="bold">STATION BIN</text>
              </g>
            ) : null}

            {approachingItem && (
              <g transform={`translate(${258 + approachOffset}, ${201 - deckElevation})`}>
                <rect x="-9" y="-11" width="18" height="22" rx="3" fill={approachingItem.color} stroke="#FFF" strokeWidth="1.5" />
                <text x="0" y="-15" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">{approachingItem.label}</text>
              </g>
            )}

            <g transform={`translate(0, ${-deckElevation}) rotate(${chassisPitch}, 152, 190)`}>
              {binTiltDeg > 1 && (
                <line x1="125" y1="142" x2={125 - Math.sin((binTiltDeg * Math.PI) / 180) * 35} y2={136 - Math.cos((binTiltDeg * Math.PI) / 180) * 38} stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
              )}

              <g transform={`rotate(${-binTiltDeg}, 80, 140)`}>
                <rect x="80" y="84" width="68" height="56" rx="4" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                <line x1="84" y1="98" x2="144" y2="98" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="84" y1="112" x2="144" y2="112" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="84" y1="126" x2="144" y2="126" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

                {itemsInRobotBin.map((it, idx) => {
                  const slideOut = binTiltDeg > 28 ? (binTiltDeg - 28) * 1.65 : 0;
                  return (
                    <rect key={it.id} x={88 + idx * 19 - slideOut} y={114 - slideOut * 0.35} width="15" height="21" rx="2.5" fill={it.color} stroke="#FFF" strokeWidth="1.2" />
                  );
                })}

                <line x1="80" y1="84" x2={80 - Math.sin((binTiltDeg - 1.1 * Math.PI) / 180) * 52} y2={84 + Math.cos((binTiltDeg - 1.1 * Math.PI) / 180) * 52} stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="77" y="80" width="74" height="6" rx="2" fill="#334155" />
                <text x="114" y="95" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">10 L BIN ({binPercent}%)</text>
              </g>

              <rect x="155" y="96" width="6" height="46" fill="#0F172A" />
              <rect x="146" y="84" width="24" height="14" rx="3.5" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="163" cy="91" r="3" fill="#38BDF8" />

              {/* FIX: Vision Detection Ray now perfectly tracks the height of the item on the floor */}
              {activePickItem && pickProgress < 0.25 && (
                <polygon
                  points={`166,91 246,${itemSideY - 6} 272,${itemSideY - 6}`}
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                />
              )}

              <rect x="74" y="140" width="154" height="46" rx="8" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
              <line x1="125" y1="154" x2="133" y2="171" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="137" y1="154" x2="145" y2="171" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="149" y1="154" x2="157" y2="171" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />

              {activePickItem && itemState !== 'stowed' && (
                <g transform={`translate(${itemSideX}, ${itemSideY}) rotate(${itemSideRot})`}>
                  <rect x="-9" y="-11" width="18" height="22" rx="3" fill={activePickItem.color} stroke="#FFF" strokeWidth="1.5" />
                  {itemState === 'falling_in_bin' && (
                    <g stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round">
                      <line x1="-5" y1="-15" x2="-5" y2="-24" />
                      <line x1="0" y1="-16" x2="0" y2="-28" />
                      <line x1="5" y1="-15" x2="5" y2="-24" />
                    </g>
                  )}
                </g>
              )}

              <line x1={shoulderX} y1={shoulderY} x2={ik.ex} y2={ik.ey} stroke="#0F172A" strokeWidth="13" strokeLinecap="round" />
              <line x1={shoulderX} y1={shoulderY} x2={ik.ex} y2={ik.ey} stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
              <line x1={ik.ex} y1={ik.ey} x2={ik.wx} y2={ik.wy} stroke="#0F172A" strokeWidth="11" strokeLinecap="round" />
              <line x1={ik.ex} y1={ik.ey} x2={ik.wx} y2={ik.wy} stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />

              <g transform={`translate(${ik.wx}, ${ik.wy}) rotate(${gripperAngleDeg - 90})`}>
                <rect x="-12" y="0" width="24" height="6" rx="2" fill="#1E293B" stroke="#FBBF24" strokeWidth="1.2" />
                <path d={`M ${-jawSpread} 6 L ${-jawSpread} 20 L ${-jawSpread + 3} 23`} stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d={`M ${jawSpread} 6 L ${jawSpread} 20 L ${jawSpread - 3} 23`} stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>

              <circle cx={shoulderX} cy={shoulderY} r="9" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
              <circle cx={ik.ex} cy={ik.ey} r="7.5" fill="#1E293B" stroke="#FBBF24" strokeWidth="2.5" />
              <circle cx={ik.wx} cy={ik.wy} r="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />

              {[106, 196].map((wheelX) => (
                <g key={wheelX} transform={`translate(${wheelX}, 188) rotate(${wheelRotDeg})`}>
                  <circle cx="0" cy="0" r="21" fill="#0F172A" stroke="#334155" strokeWidth="3.5" />
                  {[0, 60, 120].map((ang) => (
                    <line key={ang} x1={-16 * Math.cos((ang * Math.PI) / 180)} y1={-16 * Math.sin((ang * Math.PI) / 180)} x2={16 * Math.cos((ang * Math.PI) / 180)} y2={16 * Math.sin((ang * Math.PI) / 180)} stroke="#475569" strokeWidth="2.5" />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#F59E0B" />
                  <circle cx="0" cy="0" r="3" fill="#0F172A" />
                </g>
              ))}
            </g>
          </svg>

          <div className="grid grid-cols-5 gap-1.5 border-t border-white/10 pt-3 text-center text-[10px]">
            {[
              { id: '1. Find', active: Boolean(approachingItem) || (activePickItem && pickProgress < 0.25) },
              { id: '2. Pick & Bin', active: Boolean(activePickItem) },
              { id: '3. Avoid Obs', active: (time >= 1.0 && time < 4.5) || (time >= 7.5 && time < 11.0) },
              { id: '4. Empty Bin', active: binTiltDeg > 2 },
              { id: '5. Park Clear', active: time >= 32.5 },
            ].map((rule, i) => (
              <div key={i} className={`rounded-md py-1 px-1 font-bold transition ${rule.active ? 'bg-amber-400 text-[#001A23]' : 'bg-white/5 text-gray-400'}`}>
                {rule.id}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#001A23] px-6 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-xs text-gray-400">
            {time.toFixed(1)}s / {TOTAL_DURATION}s
          </span>
          <input
            type="range"
            min={0}
            max={TOTAL_DURATION}
            step={0.05}
            value={time}
            onChange={(e) => {
              setIsPlaying(false);
              setTime(parseFloat(e.target.value));
            }}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-400"
          />
          <div className="hidden gap-2 text-[11px] sm:flex">
            {[
              { label: 'Pick #1', t: 4.5 },
              { label: 'Avoid Moving Obs', t: 8.2 },
              { label: 'Ramp Climb', t: 15.2 },
              { label: 'Raised Pick #3', t: 17.5 },
              { label: 'Empty 10L Bin', t: 24.2 },
              { label: 'Final Park', t: 32.6 },
            ].map((bookmark) => (
              <button
                key={bookmark.label}
                onClick={() => setTime(bookmark.t)}
                className="rounded bg-white/10 px-2.5 py-1 font-semibold text-gray-300 transition hover:bg-amber-400 hover:text-[#001A23]"
              >
                {bookmark.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}