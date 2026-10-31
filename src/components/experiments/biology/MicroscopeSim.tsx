/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, Focus, ZoomIn, Sun, Info, RotateCcw } from 'lucide-react';

type SpecimenId = 'onion' | 'cheek' | 'elodea';

interface SpecimenData {
  id: SpecimenId;
  name: string;
  type: 'Plant Cell' | 'Animal Cell';
  stain: string;
  description: string;
  organelles: {
    name: string;
    description: string;
    cx: number;
    cy: number;
    r: number;
  }[];
}

const SPECIMENS: Record<SpecimenId, SpecimenData> = {
  onion: {
    id: 'onion',
    name: 'Allium Cepa (Onion Epidermal Peel)',
    type: 'Plant Cell',
    stain: 'Dilute Iodine / Lugol Solution (Amber stain)',
    description: 'Monolayer of rectangular plant cells exhibiting prominent cellulose cell walls, peripheral cytoplasm, large central vacuole, and distinct stained nuclei.',
    organelles: [
      { name: 'Cellulose Cell Wall', description: 'Rigid outer layer providing structural support and preventing cell lysis.', cx: 180, cy: 120, r: 24 },
      { name: 'Cell Nucleus', description: 'Dark spherical organelle housing genomic DNA and controlling cellular transcription.', cx: 240, cy: 140, r: 18 },
      { name: 'Large Central Vacuole', description: 'Fluid-filled compartment maintaining hydrostatic turgor pressure.', cx: 160, cy: 155, r: 22 },
      { name: 'Cytoplasmic Layer', description: 'Viscous intracellular cytosol containing metabolic enzymes.', cx: 210, cy: 165, r: 16 }
    ]
  },
  cheek: {
    id: 'cheek',
    name: 'Human Squamous Epithelial Cheek Cells',
    type: 'Animal Cell',
    stain: 'Methylene Blue (Basic nuclear dye)',
    description: 'Irregular, flat polygonal animal cells without cell walls. Granular cytoplasm with a prominently stained central diploid nucleus.',
    organelles: [
      { name: 'Plasma Membrane', description: 'Flexible phospholipid bilayer regulating molecular transport in and out of the cell.', cx: 190, cy: 130, r: 25 },
      { name: 'Central Diploid Nucleus', description: 'Deep blue stained organelle containing human 46-chromosome genome.', cx: 205, cy: 150, r: 16 },
      { name: 'Granular Cytoplasm', description: 'Gel-like matrix containing mitochondria, ribosomes, and cytoskeleton fibers.', cx: 165, cy: 145, r: 20 }
    ]
  },
  elodea: {
    id: 'elodea',
    name: 'Elodea Aquatic Leaf (Living Cellular Mount)',
    type: 'Plant Cell',
    stain: 'Unstained (Natural chlorophyll autofluorescence/pigment)',
    description: 'Living aquatic plant cells with dense clusters of green chloroplasts actively circulating via cytoplasmic streaming (cyclosis).',
    organelles: [
      { name: 'Chloroplasts', description: 'Biconvex green plastids containing chlorophyll for light-harvesting photosynthesis.', cx: 175, cy: 135, r: 16 },
      { name: 'Cell Wall Matrix', description: 'Intercellular pectin and cellulose framework bounding neighboring leaf cells.', cx: 220, cy: 110, r: 20 },
      { name: 'Cyclosis Pathway', description: 'Active rotational cytoplasmic current propelled by actin-myosin motor proteins.', cx: 230, cy: 160, r: 18 }
    ]
  }
};

export const MicroscopeSim: React.FC = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimenId>('onion');
  const [magnification, setMagnification] = useState<number>(100); // 40, 100, 400, 1000
  const [coarseFocus, setCoarseFocus] = useState<number>(48); // ideal is ~50
  const [fineFocus, setFineFocus] = useState<number>(50); // ideal is 50
  const [stageX, setStageX] = useState<number>(0);
  const [stageY, setStageY] = useState<number>(0);
  const [illumination, setIllumination] = useState<number>(85);
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);

  const specimen = SPECIMENS[selectedSpecimen];

  // Calculate focal blur
  // Perfect sharpness when coarseFocus == 50 and fineFocus == 50
  const focusError = Math.abs(coarseFocus - 50) * 1.5 + Math.abs(fineFocus - 50) * 0.4;
  const blurPixels = Math.max(0, (focusError / 100) * 8);
  const isCrisp = blurPixels < 1.0;

  const handleResetFocus = () => {
    setCoarseFocus(50);
    setFineFocus(50);
    setStageX(0);
    setStageY(0);
    setIllumination(85);
  };

  return (
    <div className="space-y-6">
      {/* Specimen Slide Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {(Object.keys(SPECIMENS) as SpecimenId[]).map(id => {
          const s = SPECIMENS[id];
          const active = selectedSpecimen === id;
          return (
            <button
              key={id}
              onClick={() => {
                setSelectedSpecimen(id);
                setSelectedOrganelle(null);
              }}
              className={`flex-1 min-w-[210px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${
                active
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{s.name.split('(')[0]}</span>
              <span className="text-[10px] text-slate-400 font-normal">({s.type})</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Microscope Eyepiece Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 flex flex-col items-center justify-between shadow-sm relative overflow-hidden">
          {/* Eyepiece Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-semibold uppercase tracking-wider">
                Microscopic Field of View
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{magnification}x Total Mag</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className={isCrisp ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {isCrisp ? 'IN SHARP OPTICAL FOCUS' : 'OUT OF FOCUS (ADJUST DIAL)'}
              </span>
            </div>
          </div>

          {/* Eyepiece Circular Reticle View */}
          <div className="py-4 relative flex items-center justify-center">
            {/* Circular Eyepiece Housing */}
            <div
              className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${illumination / 100})`,
                filter: `brightness(${illumination}%)`
              }}
            >
              {/* Biological Tissue Specimen Layer with SVG */}
              <div
                className="w-full h-full relative transition-all duration-150"
                style={{
                  filter: `blur(${blurPixels.toFixed(1)}px)`,
                  transform: `translate(${stageX}px, ${stageY}px) scale(${magnification / 100})`
                }}
              >
                <svg viewBox="0 0 380 320" className="w-full h-full select-none">
                  {selectedSpecimen === 'onion' && (
                    <g>
                      {/* Onion cells grid */}
                      {[0, 1, 2].map(row =>
                        [0, 1, 2].map(col => {
                          const ox = 40 + col * 120;
                          const oy = 30 + row * 90;
                          return (
                            <g key={`${row}-${col}`}>
                              {/* Brick-like plant cell wall */}
                              <rect
                                x={ox}
                                y={oy}
                                width="115"
                                height="85"
                                rx="4"
                                fill="#fef3c7"
                                stroke="#b45309"
                                strokeWidth="3"
                                opacity={0.7}
                              />
                              {/* Cytoplasm lining */}
                              <rect
                                x={ox + 6}
                                y={oy + 6}
                                width="103"
                                height="73"
                                rx="3"
                                fill="#fde68a"
                                opacity={0.3}
                              />
                              {/* Nucleus */}
                              <circle
                                cx={ox + 75}
                                cy={oy + 45}
                                r="10"
                                fill="#92400e"
                                stroke="#78350f"
                                strokeWidth="1.5"
                                opacity={0.85}
                              />
                              {/* Nucleolus */}
                              <circle cx={ox + 77} cy={oy + 43} r="3" fill="#451a03" />
                            </g>
                          );
                        })
                      )}
                    </g>
                  )}

                  {selectedSpecimen === 'cheek' && (
                    <g>
                      {/* Irregular animal squamous cells */}
                      {[
                        { cx: 130, cy: 110, r: 48, rot: 15 },
                        { cx: 240, cy: 160, r: 54, rot: -20 },
                        { cx: 150, cy: 220, r: 46, rot: 40 }
                      ].map((c, i) => (
                        <g key={i} transform={`translate(${c.cx}, ${c.cy}) rotate(${c.rot})`}>
                          {/* Irregular membrane */}
                          <path
                            d="M -40 -20 Q -20 -45 20 -40 Q 50 -20 45 20 Q 30 50 -20 45 Q -50 30 -40 -20 Z"
                            fill="#dbeafe"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            opacity={0.8}
                          />
                          {/* Granular Cytoplasm dots */}
                          <circle cx="-12" cy="14" r="2" fill="#60a5fa" opacity={0.5} />
                          <circle cx="18" cy="-10" r="1.5" fill="#60a5fa" opacity={0.5} />
                          <circle cx="10" cy="18" r="2" fill="#60a5fa" opacity={0.5} />
                          {/* Stained Nucleus */}
                          <ellipse cx="0" cy="0" rx="10" ry="8" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1.5" />
                        </g>
                      ))}
                    </g>
                  )}

                  {selectedSpecimen === 'elodea' && (
                    <g>
                      {/* Elodea leaf cell */}
                      <rect x="70" y="40" width="240" height="150" rx="6" fill="#f0fdf4" stroke="#15803d" strokeWidth="3" />
                      {/* Central vacuole space */}
                      <rect x="90" y="60" width="200" height="110" rx="4" fill="#dcfce7" opacity={0.5} />

                      {/* Numerous oval Chloroplasts circulating */}
                      {[
                        { x: 95, y: 55 }, { x: 125, y: 52 }, { x: 165, y: 54 }, { x: 205, y: 52 }, { x: 245, y: 55 }, { x: 280, y: 65 },
                        { x: 285, y: 100 }, { x: 285, y: 140 }, { x: 260, y: 175 }, { x: 215, y: 178 }, { x: 170, y: 176 }, { x: 125, y: 178 },
                        { x: 90, y: 165 }, { x: 88, y: 120 }, { x: 88, y: 80 }
                      ].map((cp, idx) => (
                        <ellipse
                          key={idx}
                          cx={cp.x}
                          cy={cp.y}
                          rx="9"
                          ry="6"
                          fill="#16a34a"
                          stroke="#14532d"
                          strokeWidth="1"
                          transform={`rotate(${idx * 24}, ${cp.x}, ${cp.y})`}
                        />
                      ))}

                      {/* Streaming direction arrow */}
                      <path d="M 120 70 L 250 70" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
                    </g>
                  )}

                  {/* Interactive Organelle Target Hotspots */}
                  {specimen.organelles.map((org, idx) => (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => setSelectedOrganelle(org.name)}
                    >
                      <circle
                        cx={org.cx}
                        cy={org.cy}
                        r={org.r}
                        fill="transparent"
                        stroke={selectedOrganelle === org.name ? '#0d9488' : 'rgba(255,255,255,0.4)'}
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Eyepiece Crosshair Reticle */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full relative">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-900/30" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-900/30" />
                  {/* Circular scale ring */}
                  <div className="absolute inset-8 rounded-full border border-slate-900/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Turret Nosepiece Magnification Selector */}
          <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">Objective Lens:</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {[
                { mag: 40, label: '4x (Scan)' },
                { mag: 100, label: '10x (Low)' },
                { mag: 400, label: '40x (High)' },
                { mag: 1000, label: '100x (Oil)' }
              ].map(opt => (
                <button
                  key={opt.mag}
                  onClick={() => setMagnification(opt.mag)}
                  className={`py-1 px-2.5 rounded-md text-xs font-mono font-medium transition-colors ${
                    magnification === opt.mag
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optical Alignment Knobs & Organelle Exploration (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Microscope Optical Controls Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Microscope Adjustment Knobs
              </h4>
              <button
                onClick={handleResetFocus}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Reset focal knobs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Coarse Focus Knob */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Focus className="w-3.5 h-3.5 text-teal-600" /> Coarse Focus Knob
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{coarseFocus}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={coarseFocus}
                onChange={e => setCoarseFocus(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-teal-600"
              />
            </div>

            {/* Fine Focus Knob */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Focus className="w-3.5 h-3.5 text-teal-600" /> Fine Focus Knob
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{fineFocus}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fineFocus}
                onChange={e => setFineFocus(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-teal-600"
              />
            </div>

            {/* Substage Illuminator */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Iris Condenser Lamp
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{illumination}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={illumination}
                onChange={e => setIllumination(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-amber-500"
              />
            </div>

            {/* Mechanical Stage X/Y Translation */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Stage X-Axis</label>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={stageX}
                  onChange={e => setStageX(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-slate-600"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Stage Y-Axis</label>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={stageY}
                  onChange={e => setStageY(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Organelle Callout & Identification Panel */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Identified Cellular Components
            </h4>
            <div className="text-[11px] text-slate-500">
              Click any cellular structure to inspect its biological function:
            </div>

            <div className="space-y-2">
              {specimen.organelles.map((org, i) => {
                const isSelected = selectedOrganelle === org.name;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedOrganelle(isSelected ? null : org.name)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200'
                        : 'border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{org.name}</span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                        {isSelected ? 'Active Focus' : 'Inspect'}
                      </span>
                    </div>
                    {isSelected && (
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {org.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
