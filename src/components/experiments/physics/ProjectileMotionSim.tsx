/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Crosshair, Layers } from 'lucide-react';

interface TrajectoryPoint {
  x: number;
  y: number;
}

interface StoredTrajectory {
  angle: number;
  velocity: number;
  gravity: number;
  range: number;
  maxHeight: number;
  flightTime: number;
  color: string;
  points: TrajectoryPoint[];
}

export const ProjectileMotionSim: React.FC = () => {
  const [angle, setAngle] = useState<number>(45);
  const [velocity, setVelocity] = useState<number>(25);
  const [gravity, setGravity] = useState<number>(9.8);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [comparisonRuns, setComparisonRuns] = useState<StoredTrajectory[]>([]);

  const animationRef = useRef<number | null>(null);

  // Physics calculations (Level ground: y0 = 0)
  const rad = (angle * Math.PI) / 180;
  const flightTime = (2 * velocity * Math.sin(rad)) / gravity;
  const maxHeight = Math.pow(velocity * Math.sin(rad), 2) / (2 * gravity);
  const range = (Math.pow(velocity, 2) * Math.sin(2 * rad)) / gravity;

  // Generate mathematical curve points
  const generateTrajectoryPoints = (
    ang: number,
    vel: number,
    g: number,
    tFlight: number
  ): TrajectoryPoint[] => {
    const r = (ang * Math.PI) / 180;
    const steps = 60;
    const pts: TrajectoryPoint[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tFlight;
      const x = vel * Math.cos(r) * t;
      const y = vel * Math.sin(r) * t - 0.5 * g * Math.pow(t, 2);
      pts.push({ x, y: Math.max(0, y) });
    }
    return pts;
  };

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setCurrentProgress(0);

    const startTime = performance.now();
    const duration = Math.min(2500, Math.max(1200, flightTime * 600));

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      setCurrentProgress(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsLaunching(false);
        // Add to comparison runs
        const points = generateTrajectoryPoints(angle, velocity, gravity, flightTime);
        const colors = ['#0d9488', '#f59e0b', '#3b82f6', '#ec4899'];
        const color = colors[comparisonRuns.length % colors.length];

        setComparisonRuns(prev => [
          ...prev.slice(-3),
          {
            angle,
            velocity,
            gravity,
            range: parseFloat(range.toFixed(1)),
            maxHeight: parseFloat(maxHeight.toFixed(1)),
            flightTime: parseFloat(flightTime.toFixed(2)),
            color,
            points
          }
        ]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const clearComparisons = () => {
    setComparisonRuns([]);
    setCurrentProgress(1);
  };

  // Trajectory scaling parameters for SVG canvas
  // Max expected range is ~120m, max height is ~60m
  const scaleX = 4.2; // pixels per meter
  const scaleY = 3.6; // pixels per meter
  const originX = 50;
  const originY = 250;

  // Active flight position
  const activeT = currentProgress * flightTime;
  const currentX = velocity * Math.cos(rad) * activeT;
  const currentY = Math.max(0, velocity * Math.sin(rad) * activeT - 0.5 * gravity * Math.pow(activeT, 2));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trajectory Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-semibold uppercase tracking-wider">
                Kinematics Ballistic Field
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">g = {gravity} m/s²</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">
                Launch Angle: <strong className="text-teal-400">{angle}°</strong>
              </span>
            </div>
          </div>

          {/* SVG Trajectory Stage */}
          <div className="py-4 flex items-center justify-center">
            <svg viewBox="0 0 580 290" className="w-full max-w-xl h-auto select-none">
              {/* Background Grid Lines */}
              <defs>
                <pattern id="grid" width="42" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 42 0 L 0 0 0 36" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="50" y="20" width="500" height="230" fill="url(#grid)" />

              {/* Ground Plane */}
              <line x1="40" y1={originY} x2="560" y2={originY} stroke="#475569" strokeWidth="3" />

              {/* Distance markings on ground */}
              {[20, 40, 60, 80, 100, 120].map(dist => (
                <g key={dist} transform={`translate(${originX + dist * scaleX}, ${originY})`}>
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="2" />
                  <text x="0" y="18" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                    {dist}m
                  </text>
                </g>
              ))}

              {/* Cannon / Launcher base */}
              <g transform={`translate(${originX}, ${originY})`}>
                <circle cx="0" cy="0" r="14" fill="#334155" stroke="#64748b" strokeWidth="2" />
                {/* Barrel rotated by launch angle */}
                <line
                  x1="0"
                  y1="0"
                  x2={32 * Math.cos(rad)}
                  y2={-32 * Math.sin(rad)}
                  stroke="#2dd4bf"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </g>

              {/* Stored Comparison Trajectory Arcs */}
              {comparisonRuns.map((run, idx) => {
                const pathD = run.points.reduce((acc, pt, i) => {
                  const sx = originX + pt.x * scaleX;
                  const sy = originY - pt.y * scaleY;
                  return i === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
                }, '');

                return (
                  <path
                    key={idx}
                    d={pathD}
                    fill="none"
                    stroke={run.color}
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    opacity={0.7}
                  />
                );
              })}

              {/* Active Trajectory Preview Curve */}
              {(() => {
                const livePoints = generateTrajectoryPoints(angle, velocity, gravity, flightTime);
                const pathD = livePoints.reduce((acc, pt, i) => {
                  const sx = originX + pt.x * scaleX;
                  const sy = originY - pt.y * scaleY;
                  return i === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
                }, '');
                return (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    opacity={0.9}
                  />
                );
              })()}

              {/* Animated Projectile Ball */}
              {isLaunching && (
                <g transform={`translate(${originX + currentX * scaleX}, ${originY - currentY * scaleY})`}>
                  <circle cx="0" cy="0" r="7" fill="#facc15" stroke="#f59e0b" strokeWidth="2" />
                  {/* Subtle particle glow */}
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#facc15" strokeWidth="1" opacity={0.4} />
                </g>
              )}

              {/* Apex Marker */}
              <g transform={`translate(${originX + (range / 2) * scaleX}, ${originY - maxHeight * scaleY})`}>
                <circle cx="0" cy="0" r="4" fill="#f43f5e" />
                <line x1="0" y1="0" x2="0" y2="15" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                <text x="8" y="-4" fill="#f43f5e" fontSize="9" fontFamily="monospace">
                  Apex: {maxHeight.toFixed(1)}m
                </text>
              </g>

              {/* Landing Bullseye Marker */}
              <g transform={`translate(${originX + range * scaleX}, ${originY})`}>
                <circle cx="0" cy="0" r="5" fill="#2dd4bf" />
                <text x="0" y="-10" textAnchor="middle" fill="#2dd4bf" fontSize="10" fontWeight="bold">
                  Target: {range.toFixed(1)}m
                </text>
              </g>
            </svg>
          </div>

          {/* Controls Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            {/* Angle Dial */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Angle (θ)</span>
                <span className="font-mono text-teal-400 font-bold">{angle}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                step="1"
                value={angle}
                disabled={isLaunching}
                onChange={e => setAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15°</span>
                <span>45°</span>
                <span>75°</span>
              </div>
            </div>

            {/* Velocity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Muzzle Speed</span>
                <span className="font-mono text-amber-400 font-bold">{velocity} m/s</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={velocity}
                disabled={isLaunching}
                onChange={e => setVelocity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 m/s</span>
                <span>25 m/s</span>
                <span>45 m/s</span>
              </div>
            </div>

            {/* Planetary Gravity */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Gravity Field</label>
              <select
                value={gravity}
                disabled={isLaunching}
                onChange={e => setGravity(Number(e.target.value))}
                className="w-full py-1.5 px-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono"
              >
                <option value={9.8}>Earth (9.80 m/s²)</option>
                <option value={1.62}>Moon (1.62 m/s²)</option>
                <option value={3.71}>Mars (3.71 m/s²)</option>
              </select>
            </div>

            {/* Launch Button */}
            <div className="flex items-end">
              <button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLaunching ? 'In Flight...' : 'Fire Projectile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Kinematics Metrics & Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Kinematics Gauges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Horizontal Range</div>
              <div className="mt-1 text-xl font-mono font-bold text-teal-600 dark:text-teal-400">
                {range.toFixed(1)} <span className="text-xs font-normal text-slate-400">m</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">R = v₀² sin(2θ)/g</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Max Apex Height</div>
              <div className="mt-1 text-xl font-mono font-bold text-rose-600 dark:text-rose-400">
                {maxHeight.toFixed(1)} <span className="text-xs font-normal text-slate-400">m</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">H = (v₀ sinθ)²/2g</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Flight Time</div>
              <div className="mt-1 text-xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {flightTime.toFixed(2)} <span className="text-xs font-normal text-slate-400">s</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">T = 2v₀ sinθ/g</div>
            </div>
          </div>

          {/* Trajectory Angle Comparison Deck */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Angle Comparison Runs
                </h4>
                <div className="text-[11px] text-slate-500">Compare 30°, 45°, and 60° trajectories</div>
              </div>
              {comparisonRuns.length > 0 && (
                <button
                  onClick={clearComparisons}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear past runs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {comparisonRuns.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs text-slate-400">
                Click &ldquo;Fire Projectile&rdquo; to log your first flight path onto the comparison radar.
              </div>
            ) : (
              <div className="space-y-2">
                {comparisonRuns.map((r, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-750 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {r.angle}° @ {r.velocity} m/s
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <span>R: <strong className="text-slate-700 dark:text-slate-200">{r.range}m</strong></span>
                      <span>H: <strong className="text-slate-700 dark:text-slate-200">{r.maxHeight}m</strong></span>
                      <span>T: <strong className="text-slate-700 dark:text-slate-200">{r.flightTime}s</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Scientific Finding Note */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Rwanda Curriculum Finding:</span> Notice that complementary launch angles (e.g., 30° and 60°) achieve identical horizontal landing range ({range.toFixed(1)}m), but 60° yields higher vertical apex and longer flight duration. 45° maximizes horizontal range on level terrain.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
