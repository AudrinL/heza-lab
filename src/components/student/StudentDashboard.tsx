/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Award,
  Zap,
  FlaskConical,
  Dna,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Atom,
  Play
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    studentProfile,
    experiments,
    assignments,
    startExperiment,
    setRoute,
    setSelectedSubject
  } = useApp();

  // Progress metrics
  const totalAvailable = experiments.length;
  const completedCount = studentProfile.completedExperimentIds.length;
  const progressPct = Math.round((completedCount / totalAvailable) * 100);

  // Subject breakdown
  const physTotal = experiments.filter(e => e.subject === 'physics').length;
  const physDone = experiments.filter(e => e.subject === 'physics' && studentProfile.completedExperimentIds.includes(e.id)).length;

  const chemTotal = experiments.filter(e => e.subject === 'chemistry').length;
  const chemDone = experiments.filter(e => e.subject === 'chemistry' && studentProfile.completedExperimentIds.includes(e.id)).length;

  const bioTotal = experiments.filter(e => e.subject === 'biology').length;
  const bioDone = experiments.filter(e => e.subject === 'biology' && studentProfile.completedExperimentIds.includes(e.id)).length;

  // Active teacher assignments
  const activeAssignments = assignments.filter(a => a.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile & Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-teal-400 tracking-wide uppercase">
              Student Science Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Muraho, {studentProfile.name}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {studentProfile.gradeLevel} · {studentProfile.school}
            </p>
          </div>

          {/* Prominent Action to Enter Lab */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setRoute('lab')}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-teal-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Virtual Laboratory</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">{studentProfile.streakDays} Days</div>
              <div className="text-[11px] text-slate-400">Learning Streak</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">{studentProfile.totalXp} XP</div>
              <div className="text-[11px] text-slate-400">Experience Points</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">
                {completedCount}/{totalAvailable}
              </div>
              <div className="text-[11px] text-slate-400">Labs Completed ({progressPct}%)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">
                {studentProfile.achievements.length} Badges
              </div>
              <div className="text-[11px] text-slate-400">Skill Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Assigned Experiments & Subject Mastery */}
        <div className="lg:col-span-8 space-y-8">
          {/* Teacher Assignments Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Assigned by Science Teachers
                </h2>
                <p className="text-xs text-slate-500">
                  Required laboratory practicals for your Senior 4 class curriculum.
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                {activeAssignments.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {activeAssignments.map(asg => {
                const targetExp = experiments.find(e => e.id === asg.experimentId);
                const isDone = studentProfile.completedExperimentIds.includes(asg.experimentId);

                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {asg.title}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{asg.instructions}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> Due {asg.dueDate}
                        </span>
                        <span>·</span>
                        <span>{targetExp?.gradeLevel}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => startExperiment(asg.experimentId)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors shrink-0 ${
                        isDone
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                      }`}
                    >
                      <span>{isDone ? 'Review Practical' : 'Start Experiment'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Curriculum Mastery by Subject
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Physics */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Atom className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Physics</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {physDone}/{physTotal} Labs
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(physDone / physTotal) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    setSelectedSubject('physics');
                    setRoute('lab');
                  }}
                  className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Launch Physics Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Chemistry */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Chemistry</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {chemDone}/{chemTotal} Labs
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(chemDone / chemTotal) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    setSelectedSubject('chemistry');
                    setRoute('lab');
                  }}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Launch Chemistry Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Biology */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Biology</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {bioDone}/{bioTotal} Labs
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(bioDone / bioTotal) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    setSelectedSubject('biology');
                    setRoute('lab');
                  }}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Launch Biology Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Achievements & Recommended Labs */}
        <div className="lg:col-span-4 space-y-8">
          {/* Earned Badges & Gamification */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Earned Badges
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {studentProfile.achievements.length} unlocked
              </span>
            </div>

            <div className="space-y-3">
              {studentProfile.achievements.map(ach => (
                <div
                  key={ach.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {ach.title}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      {ach.description}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Unlocked {ach.unlockedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Investigation */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-2xl p-6 text-white border border-teal-800/50 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 block">
              Curriculum Recommendation
            </span>
            <h3 className="text-lg font-bold">Kinematics & Projectile Motion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore 2D trajectory flight arcs and verify why 45° maximizes horizontal range on level ground.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-teal-300">+160 XP</span>
              <button
                onClick={() => startExperiment('physics-projectile')}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Launch Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
