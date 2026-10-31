/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, Difficulty, Experiment } from '../../types';
import {
  Search,
  Filter,
  Clock,
  BookOpen,
  ArrowRight,
  Atom,
  FlaskConical,
  Dna,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const ExperimentLibrary: React.FC = () => {
  const { experiments, startExperiment, studentProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filtered experiments
  const filtered = experiments.filter(exp => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.curriculumRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || exp.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || exp.difficulty === selectedDifficulty;
    const matchesLevel =
      selectedLevel === 'all' ||
      (selectedLevel === 'lower' && exp.gradeLevel.includes('S3')) ||
      (selectedLevel === 'upper' && (exp.gradeLevel.includes('S4') || exp.gradeLevel.includes('S5')));

    return matchesSearch && matchesSubject && matchesDifficulty && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
          Curriculum Experiment Catalog
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Science Laboratory Experiment Library
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Search and launch Rwanda Basic Education Board (REB) aligned virtual practical investigations across secondary school Physics, Chemistry, and Biology.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiments, equations, or curriculum units (e.g. Ohm, Titration, Projectile)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="w-full md:w-48 py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Secondary Levels</option>
            <option value="lower">Lower Secondary (Senior 1-3)</option>
            <option value="upper">Upper Secondary (Senior 4-6)</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
            className="w-full md:w-44 py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Difficulties</option>
            <option value="foundational">Foundational</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-2">Subject:</span>
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'physics', label: 'Physics' },
            { id: 'chemistry', label: 'Chemistry' },
            { id: 'biology', label: 'Biology' }
          ].map(subj => {
            const active = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id as Subject | 'all')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {subj.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(exp => {
          const isCompleted = studentProfile.completedExperimentIds.includes(exp.id);

          return (
            <div
              key={exp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="space-y-4">
                {/* Top Metadata Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    {exp.subject === 'physics' && <Atom className="w-3.5 h-3.5 text-teal-600" />}
                    {exp.subject === 'chemistry' && <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />}
                    {exp.subject === 'biology' && <Dna className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="capitalize font-semibold">{exp.subject}</span>
                    <span>·</span>
                    <span>{exp.gradeLevel}</span>
                  </div>

                  <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">
                    +{exp.xpReward} XP
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {exp.summary}
                  </p>
                </div>

                {/* Curriculum Ref */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Curriculum Code:</span>
                  <span className="font-mono">{exp.curriculumRef}</span>
                </div>
              </div>

              {/* Action Strip */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{exp.estimatedMinutes} mins</span>
                </div>

                <button
                  onClick={() => startExperiment(exp.id)}
                  className="px-4 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>{isCompleted ? 'Replay Lab' : 'Launch Experiment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
