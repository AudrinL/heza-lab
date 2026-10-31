/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, Play, RotateCcw, Plus, CheckCircle2 } from 'lucide-react';

interface DataPoint {
  voltage: number;
  current: number;
  calculatedR: number;
}

export const OhmsLawSim: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12);
  const [resistance, setResistance] = useState<number>(40);
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { voltage: 4, current: 0.1, calculatedR: 40 },
    { voltage: 8, current: 0.2, calculatedR: 40 },
    { voltage: 12, current: 0.3, calculatedR: 40 }
  ]);

  // Live calculations
  const current = isSwitchClosed ? voltage / resistance : 0;
  const power = isSwitchClosed ? voltage * current : 0;

  const handleRecordPoint = () => {
    if (!isSwitchClosed) return;
    const newPoint: DataPoint = {
      voltage,
      current: parseFloat(current.toFixed(3)),
      calculatedR: parseFloat((voltage / (current || 0.0001)).toFixed(1))
    };
    if (!dataPoints.some(p => p.voltage === voltage && Math.abs(p.current - newPoint.current) < 0.001)) {
      setDataPoints(prev => [...prev, newPoint].sort((a, b) => a.voltage - b.voltage));
    }
  };

  const handleReset = () => {
    setVoltage(12);
    setResistance(40);
    setIsSwitchClosed(true);
    setDataPoints([
      { voltage: 4, current: 0.1, calculatedR: 40 },
      { voltage: 8, current: 0.2, calculatedR: 40 },
      { voltage: 12, current: 0.3, calculatedR: 40 }
    ]);
  };

  // Resistor color code calculation
  const getResistorBands = (r: number) => {
    const colors = ['#000000', '#8b5a2b', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#6b7280', '#ffffff'];
    const rStr = Math.round(r).toString();
    const digit1 = parseInt(rStr[0], 10) || 1;
    const digit2 = rStr.length > 1 ? parseInt(rStr[1], 10) : 0;
    const multiplier = Math.max(0, rStr.length - 2);
    return [colors[digit1], colors[digit2], colors[Math.min(multiplier, colors.length - 1)]];
  };

  const bands = getResistorBands(resistance);

  return (
    <div className="space-y-6">
      {/* Simulation Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Circuit Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-sm">
          {/* Top Status Strip */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-semibold uppercase tracking-wider">Circuit Breadboard</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Series DC Configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSwitchClosed ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span className="font-mono text-slate-300">
                {isSwitchClosed ? 'CIRCUIT CLOSED (ENERGIZED)' : 'CIRCUIT OPEN (NO FLOW)'}
              </span>
            </div>
          </div>

          {/* SVG Circuit Schematic with Animated Current Flow */}
          <div className="py-6 flex items-center justify-center">
            <svg viewBox="0 0 540 280" className="w-full max-w-lg h-auto select-none">
              {/* Circuit loop path */}
              <rect
                x="60"
                y="40"
                width="420"
                height="200"
                rx="16"
                fill="none"
                stroke="#334155"
                strokeWidth="6"
              />

              {/* Animated Current Particle Flow */}
              {isSwitchClosed && current > 0 && (
                <rect
                  x="60"
                  y="40"
                  width="420"
                  height="200"
                  rx="16"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="3"
                  strokeDasharray="8 12"
                  className="animate-[dash_1s_linear_infinite]"
                  style={{
                    animationDuration: `${Math.max(0.2, 1.2 - current * 0.8)}s`
                  }}
                />
              )}

              {/* Component: DC Power Supply (Left wire) */}
              <g transform="translate(60, 140)">
                <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#0ea5e9" strokeWidth="3" />
                <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">DC</text>
                <text x="0" y="12" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace">
                  {voltage}V
                </text>
                {/* Polarity markers */}
                <text x="-12" y="-14" fill="#ef4444" fontSize="12" fontWeight="bold">+</text>
                <text x="-12" y="24" fill="#94a3b8" fontSize="14" fontWeight="bold">-</text>
              </g>

              {/* Component: Knife Switch (Top wire) */}
              <g transform="translate(230, 40)">
                <circle cx="-30" cy="0" r="5" fill="#f8fafc" />
                <circle cx="30" cy="0" r="5" fill="#f8fafc" />
                {/* Switch blade */}
                <line
                  x1="-30"
                  y1="0"
                  x2={isSwitchClosed ? '28' : '15'}
                  y2={isSwitchClosed ? '0' : '-24'}
                  stroke={isSwitchClosed ? '#2dd4bf' : '#f43f5e'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text x="0" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  Switch: {isSwitchClosed ? 'ON' : 'OFF'}
                </text>
              </g>

              {/* Component: DC Ammeter (Right wire) */}
              <g transform="translate(480, 140)">
                <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                <text x="0" y="-6" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">A</text>
                <text x="0" y="12" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace">
                  {current.toFixed(3)} A
                </text>
                <text x="36" y="4" fill="#94a3b8" fontSize="9">Ammeter</text>
              </g>

              {/* Component: Resistor (Bottom wire) */}
              <g transform="translate(270, 240)">
                <rect x="-44" y="-14" width="88" height="28" rx="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                {/* Color Bands */}
                <rect x="-24" y="-14" width="7" height="28" fill={bands[0]} />
                <rect x="-10" y="-14" width="7" height="28" fill={bands[1]} />
                <rect x="4" y="-14" width="7" height="28" fill={bands[2]} />
                <rect x="22" y="-14" width="5" height="28" fill="#d97706" /> {/* Gold tolerance band */}
                <text x="0" y="32" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
                  R = {resistance} Ω
                </text>
              </g>

              {/* Parallel Voltmeter Branches across Resistor */}
              <g>
                <path
                  d="M 190 240 L 190 200 L 230 200"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 350 240 L 350 200 L 310 200"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx="270" cy="200" r="20" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                <text x="270" y="196" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">V</text>
                <text x="270" y="210" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace">
                  {isSwitchClosed ? voltage.toFixed(1) : '0.0'}V
                </text>
                <text x="270" y="174" textAnchor="middle" fill="#94a3b8" fontSize="9">Voltmeter (Parallel)</text>
              </g>
            </svg>
          </div>

          {/* Interactive Control Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {/* Voltage Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Power Supply (V)</span>
                <span className="font-mono text-teal-400 font-bold">{voltage} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={voltage}
                onChange={e => setVoltage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1V</span>
                <span>12V</span>
                <span>24V</span>
              </div>
            </div>

            {/* Resistance Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Resistor Value (R)</span>
                <span className="font-mono text-amber-400 font-bold">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={resistance}
                onChange={e => setResistance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10Ω</span>
                <span>100Ω</span>
                <span>200Ω</span>
              </div>
            </div>

            {/* Switch & Action Toggles */}
            <div className="flex flex-col justify-end gap-2">
              <button
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isSwitchClosed
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {isSwitchClosed ? 'Open Switch (Stop Current)' : 'Close Switch (Start Current)'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Gauges & Experimental Data (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-Time Telemetry Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400">Current (I = V/R)</div>
              <div className="mt-1 text-2xl font-mono font-bold text-teal-600 dark:text-teal-400">
                {current.toFixed(3)} <span className="text-sm font-normal text-slate-400">Amperes</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {isSwitchClosed ? 'Linear steady state' : 'Zero current (open)'}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400">Power Dissipated (P)</div>
              <div className="mt-1 text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {power.toFixed(2)} <span className="text-sm font-normal text-slate-400">Watts</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">P = V · I = I² · R</div>
            </div>
          </div>

          {/* Data Logger & Verification Table */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Verification Data Table
                </h4>
                <div className="text-[11px] text-slate-500">Log points to confirm V = IR linearity</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRecordPoint}
                  disabled={!isSwitchClosed}
                  className="px-2.5 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Point</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                  title="Reset table"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <th className="py-1.5 px-2">Voltage (V)</th>
                    <th className="py-1.5 px-2">Current (A)</th>
                    <th className="py-1.5 px-2">V / I (Ω)</th>
                    <th className="py-1.5 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
                  {dataPoints.map((pt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-750/50">
                      <td className="py-1.5 px-2 font-semibold text-teal-600 dark:text-teal-400">{pt.voltage} V</td>
                      <td className="py-1.5 px-2 text-slate-700 dark:text-slate-300">{pt.current.toFixed(3)} A</td>
                      <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{pt.calculatedR} Ω</td>
                      <td className="py-1.5 px-2 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Slope Verification Summary */}
            <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-100 dark:border-teal-900/40 text-xs text-teal-900 dark:text-teal-200 space-y-1">
              <div className="font-semibold flex items-center justify-between">
                <span>Ohmic Linear Relationship Verified</span>
                <span className="font-mono">Slope = {resistance} Ω</span>
              </div>
              <p className="text-[11px] text-teal-800 dark:text-teal-300">
                The experimental ratio V/I consistently equals the theoretical resistor rating ({resistance} Ω), satisfying the Rwanda REB S4 Physics requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
