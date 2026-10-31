/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Play, Pause, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TitrationPoint {
  volAdded: number;
  pH: number;
}

export const TitrationSim: React.FC = () => {
  const [volAdded, setVolAdded] = useState<number>(0); // mL of 0.1M NaOH added
  const [flowRate, setFlowRate] = useState<'off' | 'drip' | 'stream'>('off');
  const [history, setHistory] = useState<TitrationPoint[]>([{ volAdded: 0, pH: 1.0 }]);

  const timerRef = useRef<number | null>(null);

  // Chemistry stoichiometry constants:
  // 25.0 mL of 0.100 M HCl = 0.00250 moles H+
  // 0.100 M NaOH
  // Equivalence volume V_eq = 25.0 mL
  const calculatePH = (vAdded: number): number => {
    const vAcidL = 0.025; // 25 mL
    const mAcid = 0.1;
    const vBaseL = vAdded / 1000;
    const mBase = 0.1;

    const molesAcid = vAcidL * mAcid;
    const molesBase = vBaseL * mBase;
    const totalVolL = vAcidL + vBaseL;

    if (Math.abs(vAdded - 25.0) < 0.02) {
      return 7.0; // Equivalence point for strong acid + strong base
    } else if (vAdded < 25.0) {
      // Acidic excess
      const excessMolesH = molesAcid - molesBase;
      const concH = excessMolesH / totalVolL;
      return Math.max(1.0, Math.min(6.9, -Math.log10(concH)));
    } else {
      // Basic excess
      const excessMolesOH = molesBase - molesAcid;
      const concOH = excessMolesOH / totalVolL;
      const pOH = -Math.log10(concOH);
      return Math.min(13.0, Math.max(7.1, 14.0 - pOH));
    }
  };

  const currentPH = calculatePH(volAdded);

  // Fluid color based on phenolphthalein indicator
  // Colorless at pH < 8.2, faint pink at pH 8.2 - 8.6, deep fuchsia above 9.0
  const getIndicatorColor = (ph: number) => {
    if (ph < 8.2) {
      return 'rgba(240, 249, 255, 0.45)'; // transparent/crystal clear aqueous
    } else if (ph < 8.8) {
      // Perfect stoichiometric endpoint!
      return 'rgba(244, 114, 182, 0.45)'; // delicate pale pink
    } else {
      // Over-titrated
      return 'rgba(219, 39, 119, 0.85)'; // deep vibrant magenta
    }
  };

  // Timer loop for flow
  useEffect(() => {
    if (flowRate === 'off') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = flowRate === 'drip' ? 200 : 60;
    const increment = flowRate === 'drip' ? 0.1 : 0.4;

    timerRef.current = window.setInterval(() => {
      setVolAdded(prev => {
        if (prev >= 35) {
          setFlowRate('off');
          return 35;
        }
        const nextVal = parseFloat((prev + increment).toFixed(2));
        const ph = calculatePH(nextVal);
        setHistory(h => {
          if (h.length === 0 || nextVal - h[h.length - 1].volAdded >= 0.5 || Math.abs(nextVal - 25.0) <= 0.2) {
            return [...h, { volAdded: nextVal, pH: ph }];
          }
          return h;
        });
        return nextVal;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [flowRate]);

  const handleSingleDrop = () => {
    if (volAdded >= 35) return;
    const nextVal = parseFloat((volAdded + 0.1).toFixed(2));
    setVolAdded(nextVal);
    const ph = calculatePH(nextVal);
    setHistory(prev => [...prev, { volAdded: nextVal, pH: ph }]);
  };

  const handleReset = () => {
    setFlowRate('off');
    setVolAdded(0);
    setHistory([{ volAdded: 0, pH: 1.0 }]);
  };

  // State evaluation
  const isAtEquivalence = volAdded >= 24.8 && volAdded <= 25.2;
  const isOverTitrated = volAdded > 25.4;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Burette & Erlenmeyer Flask Stage (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 flex flex-col justify-between relative shadow-sm">
          {/* Top telemetry bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-semibold uppercase tracking-wider">
                Volumetric Glassware Station
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">0.100 M NaOH Titrant</span>
            </div>
            <div className="font-mono">
              Burette Dispensed: <strong className="text-teal-400">{volAdded.toFixed(1)} mL</strong> / 50.0 mL
            </div>
          </div>

          {/* SVG Apparatus Graphic */}
          <div className="py-4 flex items-center justify-center">
            <svg viewBox="0 0 520 320" className="w-full max-w-md h-auto select-none">
              {/* Lab Stand & Clamps */}
              <rect x="120" y="295" width="280" height="15" rx="3" fill="#334155" />
              <rect x="160" y="20" width="8" height="280" fill="#475569" />
              <rect x="160" y="90" width="80" height="8" fill="#475569" />
              <rect x="235" y="85" width="12" height="18" rx="2" fill="#64748b" />
              <rect x="160" y="210" width="80" height="8" fill="#475569" />
              <rect x="235" y="205" width="12" height="18" rx="2" fill="#64748b" />

              {/* Glass Burette Column */}
              <g transform="translate(240, 30)">
                {/* Outer Glass Tube */}
                <rect x="-8" y="0" width="16" height="200" rx="3" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" strokeWidth="1.5" />
                
                {/* Remaining NaOH Liquid in Burette */}
                {(() => {
                  const liquidHeight = Math.max(0, 190 - (volAdded / 50) * 180);
                  return (
                    <rect
                      x="-7"
                      y={200 - liquidHeight}
                      width="14"
                      height={liquidHeight}
                      fill="rgba(56, 189, 248, 0.4)"
                    />
                  );
                })()}

                {/* Graduations */}
                {[0, 10, 20, 30, 40, 50].map(mark => (
                  <g key={mark} transform={`translate(0, ${(mark / 50) * 180 + 10})`}>
                    <line x1="-8" y1="0" x2="-2" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="-12" y="3" textAnchor="end" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                      {mark}
                    </text>
                  </g>
                ))}

                {/* Stopcock valve */}
                <circle cx="0" cy="205" r="7" fill={flowRate !== 'off' ? '#2dd4bf' : '#cbd5e1'} />
                <line
                  x1={flowRate !== 'off' ? '0' : '-8'}
                  y1={flowRate !== 'off' ? '-8' : '0'}
                  x2={flowRate !== 'off' ? '0' : '8'}
                  y2={flowRate !== 'off' ? '8' : '0'}
                  stroke="#0f172a"
                  strokeWidth="3"
                />

                {/* Burette Jet Tip */}
                <polygon points="-3,212 3,212 1,225 -1,225" fill="#94a3b8" />

                {/* Flowing Droplet stream */}
                {flowRate !== 'off' && (
                  <g transform="translate(0, 230)">
                    <circle cx="0" cy="8" r="2.5" fill="#38bdf8" className="animate-bounce" />
                    <circle cx="0" cy="20" r="2.5" fill="#38bdf8" className="animate-bounce" />
                  </g>
                )}
              </g>

              {/* Conical Erlenmeyer Flask */}
              <g transform="translate(240, 255)">
                {/* Flask Body */}
                <path
                  d="M -12 -20 L -12 -5 L -45 40 Q -45 46 -38 46 L 38 46 Q 45 46 45 40 L 12 -5 L 12 -20 Z"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                {/* Liquid Level inside Flask (25 mL initial + volAdded) */}
                <path
                  d="M -38 44 Q -43 44 -43 38 L -30 20 L 30 20 L 43 38 Q 43 44 38 44 Z"
                  fill={getIndicatorColor(currentPH)}
                  className="transition-colors duration-300"
                />
                {/* Swirl ripple indicator */}
                {flowRate !== 'off' && (
                  <ellipse cx="0" cy="24" rx="14" ry="3" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
                )}
                {/* Label */}
                <text x="0" y="36" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  25 mL HCl + Phenolphthalein
                </text>
              </g>

              {/* Digital pH Meter Probe placed into flask */}
              <g transform="translate(262, 230)">
                <rect x="0" y="-35" width="4" height="60" fill="#38bdf8" />
                <rect x="-10" y="-55" width="24" height="20" rx="3" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
                <text x="2" y="-42" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                  pH {currentPH.toFixed(2)}
                </text>
              </g>
            </svg>
          </div>

          {/* Controls Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleSingleDrop}
              disabled={volAdded >= 35}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>+0.1 mL Drop</span>
            </button>

            <button
              onClick={() => setFlowRate(flowRate === 'drip' ? 'off' : 'drip')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                flowRate === 'drip'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {flowRate === 'drip' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Slow Drip</span>
            </button>

            <button
              onClick={() => setFlowRate(flowRate === 'stream' ? 'off' : 'stream')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                flowRate === 'stream'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {flowRate === 'stream' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Stream</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Burette</span>
            </button>
          </div>
        </div>

        {/* Real-time pH & Titration Curve Graph (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* pH Indicator Status Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Solution pH Status</div>
              <div className="mt-1 text-2xl font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentPH.toFixed(2)}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded font-sans uppercase font-semibold" style={{
                  backgroundColor: currentPH < 7 ? '#fef2f2' : currentPH === 7 ? '#ecfdf5' : '#fdf2f8',
                  color: currentPH < 7 ? '#dc2626' : currentPH === 7 ? '#059669' : '#db2777'
                }}>
                  {currentPH < 7 ? 'Acidic' : currentPH === 7 ? 'Neutral' : 'Alkaline'}
                </span>
              </div>
            </div>

            {/* Indicator Color Swatch */}
            <div className="text-right">
              <div className="text-[11px] text-slate-500">Phenolphthalein</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full border border-slate-300 shadow-inner"
                  style={{ backgroundColor: getIndicatorColor(currentPH) }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {currentPH < 8.2 ? 'Colorless' : currentPH < 8.8 ? 'Pale Pink' : 'Vibrant Pink'}
                </span>
              </div>
            </div>
          </div>

          {/* SVG Titration Curve Plot */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Titration Curve (pH vs NaOH Volume)
                </h4>
                <div className="text-[11px] text-slate-500">Equivalence occurs at exactly 25.0 mL</div>
              </div>
            </div>

            <div className="py-2 flex items-center justify-center">
              <svg viewBox="0 0 340 180" className="w-full h-auto select-none bg-slate-50 dark:bg-slate-900/60 rounded-lg p-2 border border-slate-200 dark:border-slate-700/60 font-mono">
                {/* Axes */}
                <line x1="35" y1="150" x2="320" y2="150" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="35" y1="20" x2="35" y2="150" stroke="#94a3b8" strokeWidth="1.5" />

                {/* pH Labels on Y Axis */}
                {[0, 7, 14].map(p => (
                  <g key={p} transform={`translate(35, ${150 - (p / 14) * 125})`}>
                    <line x1="-3" y1="0" x2="0" y2="0" stroke="#94a3b8" />
                    <text x="-6" y="3" textAnchor="end" fill="#64748b" fontSize="8">
                      {p}
                    </text>
                  </g>
                ))}

                {/* Volume Labels on X Axis */}
                {[0, 10, 20, 25, 30].map(v => (
                  <g key={v} transform={`translate(${35 + (v / 35) * 270}, 150)`}>
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#94a3b8" />
                    <text x="0" y="12" textAnchor="middle" fill="#64748b" fontSize="8">
                      {v}
                    </text>
                  </g>
                ))}

                {/* Equivalence Guideline */}
                <line
                  x1={35 + (25 / 35) * 270}
                  y1="20"
                  x2={35 + (25 / 35) * 270}
                  y2="150"
                  stroke="#f43f5e"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Plotted History Curve */}
                {(() => {
                  if (history.length < 2) return null;
                  const pathD = history.reduce((acc, pt, i) => {
                    const sx = 35 + (pt.volAdded / 35) * 270;
                    const sy = 150 - (pt.pH / 14) * 125;
                    return i === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
                  }, '');
                  return <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" />;
                })()}

                {/* Current Point Dot */}
                <circle
                  cx={35 + (volAdded / 35) * 270}
                  cy={150 - (currentPH / 14) * 125}
                  r="4"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Assessment Feedback Banner */}
            {isAtEquivalence && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Stoichiometric Endpoint Reached!</strong>
                  25.0 mL of NaOH precisely neutralizes 25.0 mL of 0.10M HCl. Molarity of acid verified: 0.10 M.
                </div>
              </div>
            )}

            {isOverTitrated && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Over-Titrated Warning</strong>
                  Excess NaOH has elevated pH above 10. The indicator turned dark fuchsia. In practical exams, reset and slow down near 24.5 mL.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
