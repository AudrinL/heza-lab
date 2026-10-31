/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Atom,
  Dna,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  Building2,
  Sparkles,
  Zap,
  Globe,
  RotateCcw
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setRoute, setRole, setSelectedSubject, startExperiment } = useApp();

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pan-African EdTech · REB Curriculum Aligned</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                Every Student Deserves a <span className="text-teal-600 dark:text-teal-400">Laboratory.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Bringing immersive, practical science education to every African classroom through virtual reality, augmented reality, and browser-based 3D simulations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setRoute('lab')}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-teal-500/25"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Explore Virtual Lab</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('the-problem');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
                >
                  Discover HezaLab
                </button>
              </div>

              {/* Role Explorer Quick Switcher */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-medium">Explore live platform as:</div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setRole('student')}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-100 transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student View</span>
                  </button>
                  <button
                    onClick={() => setRole('teacher')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Teacher View</span>
                  </button>
                  <button
                    onClick={() => setRole('school')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>School Admin</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                <img
                  src="/src/assets/images/hero_lab_simulation_1793452400723.jpg"
                  alt="Students in Kigali conducting virtual reality science experiment with HezaLab Africa"
                  referrerPolicy="no-referrer"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
                      Rwanda Pilot Initiative
                    </span>
                    <h3 className="text-base font-bold">
                      Digital Transformation of Secondary STEM
                    </h3>
                    <p className="text-xs text-slate-300">
                      Physics, chemistry, and biology practical investigations rendered with zero consumable cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem Section */}
      <section id="the-problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            The Educational Infrastructure Crisis
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
            Practical Science Education Is Out of Reach for Millions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Science is fundamentally an experimental discipline. Yet the vast majority of secondary schools across Africa lack the physical infrastructure to conduct hands-on laboratory practicals.
          </p>
        </div>

        {/* Evidence Figures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Stat 1: Rwanda Context */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              ~70%
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Secondary Schools in Rwanda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Lack fully equipped and functional wet science laboratories with running water, gas burners, and ongoing chemical reagents.
            </p>
            <div className="pt-2 text-[10px] text-slate-400 font-mono">
              Source: Rwanda Ministry of Education & REB Infrastructure Audits
            </div>
          </div>

          {/* Stat 2: Sub-Saharan Africa Context */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              &gt;82%
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sub-Saharan African Classrooms
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Operate without access to basic science equipment, forcing teachers to teach physics and chemistry purely as abstract rote memorization on blackboards.
            </p>
            <div className="pt-2 text-[10px] text-slate-400 font-mono">
              Source: UNESCO Global STEM Education Reports
            </div>
          </div>

          {/* Stat 3: Annual Consumable Costs */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-teal-400">
              $20k+ / yr
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Physical Lab Maintenance Costs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The continuous cost of replacement glassware, hazardous chemical disposal, and specialized sensors makes physical wet labs financially unsustainable for community schools.
            </p>
            <div className="pt-2 text-[10px] text-slate-400 font-mono">
              Source: African Development Bank (AfDB) Education Financing Studies
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Solution & How It Works */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              The HezaLab Africa Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Transforming Any Device into a World-Class Science Laboratory
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              No specialized VR hardware strictly required. Students can explore interactive 3D simulations directly in standard web browsers on low-cost school laptops, tablets, or mobile phones.
            </p>
          </div>

          {/* 3 Stages Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 relative">
              <span className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold flex items-center justify-center text-sm">
                01
              </span>
              <h3 className="text-lg font-bold text-white">Choose a Science Investigation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse our curriculum-aligned catalog across Physics, Chemistry, and Biology mapped to the secondary school syllabus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 relative">
              <span className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold flex items-center justify-center text-sm">
                02
              </span>
              <h3 className="text-lg font-bold text-white">Explore & Perform Interactively</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect circuit components, adjust voltage, control titration burette valves, observe chemical reactions, and focus virtual microscopes in real time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 relative">
              <span className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </span>
              <h3 className="text-lg font-bold text-white">Learn, Measure & Evaluate Results</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Record findings in student observation logs, take practical assessment quizzes, and receive instant scientific feedback with XP rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Explore the Laboratories Previews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            Virtual Laboratory Wings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
            Immersive 3D Environments for Every Subject
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Dedicated laboratory benches equipped with realistic scientific apparatus and interactive simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Physics Lab Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/src/assets/images/lab_physics_workspace_1793452401236.jpg"
                  alt="Physics laboratory with multimeters and circuits"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-teal-400 text-xs font-semibold flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5" />
                  <span>Physics Wing</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Circuit Dynamics & Mechanics
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Interactive Ohm&apos;s Law electrical circuits, resistor color codes, and projectile kinematics simulations under Earth, Moon, and Mars gravity.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setSelectedSubject('physics');
                  setRoute('lab');
                }}
                className="w-full py-2.5 px-4 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Enter Physics Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chemistry Lab Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/src/assets/images/lab_chemistry_workspace_1793452402157.jpg"
                  alt="Chemistry laboratory titration setup"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-indigo-400 text-xs font-semibold flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Chemistry Wing</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Volumetric Titration & Reactions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Precision burette stopcock control, dynamic pH titration curves with phenolphthalein color transition, and displacement precipitation tests.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setSelectedSubject('chemistry');
                  setRoute('lab');
                }}
                className="w-full py-2.5 px-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Enter Chemistry Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Biology Lab Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/src/assets/images/lab_biology_microscope_1793452401973.jpg"
                  alt="Biology laboratory microscope"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5" />
                  <span>Biology Wing</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  3D Cytology & Virtual Microscopy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  High-magnification compound optical microscope with focal blur, and interactive 3D WebGL plant cell organelle dissection.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setSelectedSubject('biology');
                  setRoute('lab');
                }}
                className="w-full py-2.5 px-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Enter Biology Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Projected Impact & Institutional Targets */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Educational Impact Targets
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">
              Sustainable Scalability for African Schools
            </h2>
            <p className="text-xs text-slate-500">
              Projected outcomes and operational efficiencies for participating institutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="text-3xl font-bold font-mono text-teal-600 dark:text-teal-400">85%</div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Infrastructure Cost Reduction Target</h4>
              <p className="text-[11px] text-slate-500">Compared to building and supplying dedicated physical wet laboratories.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">100%</div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Safety & Zero Chemical Hazards</h4>
              <p className="text-[11px] text-slate-500">Zero acid splashes, toxic gas fumes, or broken glassware injuries.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400">3x</div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Experiment Frequency</h4>
              <p className="text-[11px] text-slate-500">Students can repeat trials freely without consumable reorder limitations.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
              <div className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">100%</div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Offline Readiness</h4>
              <p className="text-[11px] text-slate-500">Fully cached simulation engines designed for low-connectivity environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white text-center border border-teal-800/40 shadow-xl space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Join the Future of African STEM Education
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Experience the platform right now from any perspective, or connect with our education deployment team in Kigali.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setRoute('lab')}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Virtual Lab Now</span>
            </button>
            <button
              onClick={() => setRole('teacher')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Explore Teacher Tools
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
