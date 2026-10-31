/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlaskConical, MapPin, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRoute, setRole } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                <FlaskConical className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                HezaLab <span className="text-teal-400">Africa</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Democratizing practical science and technology education for African secondary schools through browser-based 3D simulations, Virtual Reality, and offline-first digital laboratories.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" /> Kigali, Rwanda
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-400" /> Pan-African STEM Initiative
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> REB CBC Aligned
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Virtual Laboratories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setRoute('lab')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Physics: Ohm's Law & Circuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('lab')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Physics: Projectile Motion
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('lab')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Chemistry: Acid-Base Titration
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('lab')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Chemistry: Chemical Reactions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('lab')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Biology: Virtual Microscope
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('lab')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Biology: 3D Plant Cell Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Stakeholder Perspectives */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Explore Perspectives
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setRole('student')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Student Experience & Gamification
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRole('teacher')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Teacher Classroom Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRole('school')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  School Administration & VR Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('immersive')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  WebXR & AR Specimen Preview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('offline')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Offline-First Architecture
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Curriculum Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 HezaLab Africa. Built for equitable STEM practical learning across Rwanda and Sub-Saharan Africa.
          </div>
          <div>
            Rwanda Basic Education Board (REB) Competence-Based Curriculum aligned.
          </div>
        </div>
      </div>
    </footer>
  );
};
