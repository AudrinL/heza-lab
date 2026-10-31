/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, RefreshCw, Thermometer, Info } from 'lucide-react';

type ReactionKey = 'displacement' | 'acid_metal' | 'precipitation';

interface ReactionConfig {
  key: ReactionKey;
  name: string;
  category: string;
  equation: string;
  netIonic: string;
  reactants: string[];
  products: string[];
  initialTemp: number;
  finalTemp: number;
  observableChanges: string[];
  safetyNotes: string;
  gasTest?: string;
}

const REACTIONS: Record<ReactionKey, ReactionConfig> = {
  displacement: {
    key: 'displacement',
    name: 'Single Displacement: Iron & Copper Sulfate',
    category: 'Redox / Single Replacement',
    equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)',
    netIonic: 'Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s)',
    reactants: ['Iron (Fe) Nail', '0.5 M Copper(II) Sulfate (CuSO₄, Blue)'],
    products: ['Iron(II) Sulfate (FeSO₄, Pale Green)', 'Solid Copper (Cu, Reddish-brown)'],
    initialTemp: 22,
    finalTemp: 26,
    observableChanges: [
      'Vibrant blue solution gradually turns light pale green as Fe²⁺ ions form',
      'The shiny grey iron nail becomes coated with a granular reddish-brown layer of elemental copper',
      'Mild exothermic temperature rise (+4°C)'
    ],
    safetyNotes: 'Copper sulfate is harmful if swallowed and causes skin irritation. Wear nitrile gloves.'
  },
  acid_metal: {
    key: 'acid_metal',
    name: 'Gas Evolution: Zinc & Hydrochloric Acid',
    category: 'Acid-Metal Effervescence',
    equation: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑',
    netIonic: 'Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g)↑',
    reactants: ['Zinc (Zn) Granules', '1.0 M Hydrochloric Acid (HCl, Clear)'],
    products: ['Aqueous Zinc Chloride (ZnCl₂)', 'Hydrogen Gas (H₂ bubbles)'],
    initialTemp: 21,
    finalTemp: 44,
    observableChanges: [
      'Rapid, vigorous effervescence of odorless, colorless gas bubbles',
      'Zinc metal slowly dissolves over time',
      'Exothermic thermal reaction: solution temperature climbs significantly (+23°C)'
    ],
    safetyNotes: 'Concentrated acid is corrosive. Hydrogen gas is flammable; avoid open flames near the reaction vessel.',
    gasTest: 'Squeaky Pop Test: A lit wooden splint introduced to the test tube mouth burns with a distinctive high-pitched squeak, confirming pure H₂.'
  },
  precipitation: {
    key: 'precipitation',
    name: 'Double Displacement: Silver Nitrate & Sodium Chloride',
    category: 'Precipitation Reaction',
    equation: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)',
    netIonic: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)↓',
    reactants: ['0.1 M Silver Nitrate (AgNO₃, Clear)', '0.1 M Sodium Chloride (NaCl, Clear)'],
    products: ['Silver Chloride (AgCl, Insoluble white precipitate)', 'Aqueous Sodium Nitrate (NaNO₃)'],
    initialTemp: 22,
    finalTemp: 22,
    observableChanges: [
      'Two completely clear, transparent solutions mix to instantly produce an opaque, milky-white curd precipitate',
      'Suspended AgCl particles aggregate and gradually settle at the base of the tube',
      'Zero noticeable enthalpy change (athermal precipitation)'
    ],
    safetyNotes: 'Silver nitrate stains skin and clothing dark grey/black upon photo-reduction. Rinse spills immediately.'
  }
};

export const ReactionsSim: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<ReactionKey>('displacement');
  const [hasMixed, setHasMixed] = useState<boolean>(false);
  const [testedGas, setTestedGas] = useState<boolean>(false);

  const reaction = REACTIONS[selectedKey];

  const handleMix = () => {
    setHasMixed(true);
    setTestedGas(false);
  };

  const handleReset = () => {
    setHasMixed(false);
    setTestedGas(false);
  };

  const handleSelectReaction = (key: ReactionKey) => {
    setSelectedKey(key);
    setHasMixed(false);
    setTestedGas(false);
  };

  return (
    <div className="space-y-6">
      {/* Reaction Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {(Object.keys(REACTIONS) as ReactionKey[]).map(key => {
          const r = REACTIONS[key];
          const active = selectedKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectReaction(key)}
              className={`flex-1 min-w-[200px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.name.split(':')[0]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test Tube Reaction Chamber (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-semibold uppercase tracking-wider">
                Reaction Test Tube Bench
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{reaction.category}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-amber-400">
              <Thermometer className="w-3.5 h-3.5" />
              <span>{hasMixed ? `${reaction.finalTemp}°C` : `${reaction.initialTemp}°C`}</span>
            </div>
          </div>

          {/* SVG Visual Test Tube Apparatus */}
          <div className="py-6 flex items-center justify-center">
            <svg viewBox="0 0 460 280" className="w-full max-w-sm h-auto select-none">
              {/* Wooden / Acrylic Test Tube Rack */}
              <rect x="80" y="240" width="300" height="20" rx="4" fill="#78350f" />
              <rect x="100" y="80" width="12" height="160" fill="#92400e" />
              <rect x="348" y="80" width="12" height="160" fill="#92400e" />
              <rect x="80" y="110" width="300" height="16" rx="3" fill="#78350f" />

              {/* Borosilicate Test Tube */}
              <g transform="translate(230, 60)">
                {/* Lip */}
                <ellipse cx="0" cy="0" rx="22" ry="6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                {/* Glass walls */}
                <path
                  d="M -22 0 L -22 150 A 22 22 0 0 0 22 150 L 22 0"
                  fill="rgba(255, 255, 255, 0.05)"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />

                {/* Liquid Solution Layer */}
                {(() => {
                  let fillColor = 'rgba(255, 255, 255, 0.2)'; // default clear
                  if (selectedKey === 'displacement') {
                    fillColor = hasMixed ? 'rgba(74, 222, 128, 0.55)' : 'rgba(56, 189, 248, 0.7)'; // blue to pale green
                  } else if (selectedKey === 'acid_metal') {
                    fillColor = 'rgba(240, 249, 255, 0.35)'; // clear aqueous
                  } else if (selectedKey === 'precipitation') {
                    fillColor = hasMixed ? 'rgba(255, 255, 255, 0.95)' : 'rgba(240, 249, 255, 0.25)'; // milky white
                  }

                  return (
                    <path
                      d="M -21 60 L -21 150 A 21 21 0 0 0 21 150 L 21 60 Z"
                      fill={fillColor}
                      className="transition-colors duration-700"
                    />
                  );
                })()}

                {/* Reactant Details inside Tube */}
                {selectedKey === 'displacement' && (
                  /* Iron Nail */
                  <g transform="translate(0, 80)">
                    <rect
                      x="-4"
                      y="0"
                      width="8"
                      height="75"
                      rx="2"
                      fill={hasMixed ? '#9a3412' : '#94a3b8'}
                      stroke={hasMixed ? '#b45309' : '#475569'}
                      strokeWidth="1.5"
                      className="transition-colors duration-700"
                    />
                    <polygon points="-7,0 7,0 0,-10" fill={hasMixed ? '#9a3412' : '#94a3b8'} />
                  </g>
                )}

                {selectedKey === 'acid_metal' && (
                  /* Zinc granules + Effervescent bubbles */
                  <g transform="translate(0, 140)">
                    {/* Metal granules at base */}
                    <circle cx="-10" cy="18" r="4" fill="#cbd5e1" stroke="#64748b" />
                    <circle cx="0" cy="22" r="5" fill="#cbd5e1" stroke="#64748b" />
                    <circle cx="9" cy="19" r="4" fill="#cbd5e1" stroke="#64748b" />

                    {/* Rising Hydrogen Gas Bubbles */}
                    {hasMixed && (
                      <g className="animate-pulse">
                        <circle cx="-6" cy="-10" r="3" fill="#ffffff" opacity={0.7} />
                        <circle cx="4" cy="-30" r="3.5" fill="#ffffff" opacity={0.8} />
                        <circle cx="-8" cy="-55" r="4" fill="#ffffff" opacity={0.7} />
                        <circle cx="6" cy="-75" r="3" fill="#ffffff" opacity={0.9} />
                        <circle cx="0" cy="-95" r="4.5" fill="#ffffff" opacity={0.8} />
                      </g>
                    )}
                  </g>
                )}

                {selectedKey === 'precipitation' && hasMixed && (
                  /* Dense curd precipitate settling */
                  <g transform="translate(0, 150)">
                    <ellipse cx="0" cy="10" rx="18" ry="8" fill="#ffffff" stroke="#cbd5e1" />
                    <circle cx="-8" cy="-15" r="3" fill="#ffffff" />
                    <circle cx="6" cy="-25" r="2.5" fill="#ffffff" />
                    <circle cx="-4" cy="-40" r="3" fill="#ffffff" />
                  </g>
                )}

                {/* Squeaky pop splint test effect */}
                {testedGas && (
                  <g transform="translate(0, -15)">
                    <line x1="-30" y1="-25" x2="0" y2="0" stroke="#f59e0b" strokeWidth="3" />
                    <circle cx="0" cy="0" r="10" fill="#facc15" className="animate-ping" />
                    <text x="25" y="-5" fill="#facc15" fontSize="11" fontWeight="bold">
                      *POP!*
                    </text>
                  </g>
                )}
              </g>
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMix}
                disabled={hasMixed}
                className="py-2 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hasMixed ? 'Reactants Combined' : 'Combine Reactants'}</span>
              </button>

              {reaction.gasTest && hasMixed && (
                <button
                  onClick={() => setTestedGas(true)}
                  className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Test Gas with Lit Splint</span>
                </button>
              )}
            </div>

            <button
              onClick={handleReset}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clean Test Tube</span>
            </button>
          </div>
        </div>

        {/* Reaction Science & Chemical Equations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Chemical Equations Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Balanced Chemical Reaction
            </h4>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-xs text-slate-800 dark:text-teal-300 border border-slate-200 dark:border-slate-700/60 leading-relaxed">
              <div className="text-[10px] text-slate-400 font-sans mb-1">Molecular Equation:</div>
              <div className="font-bold">{reaction.equation}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-2 mb-1">Net Ionic Equation:</div>
              <div className="text-slate-600 dark:text-slate-300">{reaction.netIonic}</div>
            </div>

            {/* Reactants & Products Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Reactants</span>
                <ul className="mt-1 space-y-1 text-slate-700 dark:text-slate-300">
                  {reaction.reactants.map((item, i) => (
                    <li key={i} className="text-[11px]">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Products</span>
                <ul className="mt-1 space-y-1 text-slate-700 dark:text-slate-300">
                  {reaction.products.map((item, i) => (
                    <li key={i} className="text-[11px]">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Observable Changes Panel */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Observable Scientific Changes
              </h4>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                hasMixed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {hasMixed ? 'Reaction Active' : 'Unmixed State'}
              </span>
            </div>

            <div className="space-y-2">
              {reaction.observableChanges.map((change, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs leading-relaxed transition-colors ${
                    hasMixed
                      ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 border border-slate-100 dark:border-slate-700/40'
                  }`}
                >
                  {change}
                </div>
              ))}
            </div>

            {/* Safety & Protocol Banner */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Laboratory Safety Protocol</span>
                {reaction.safetyNotes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
