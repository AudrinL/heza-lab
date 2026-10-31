/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  Search,
  X
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    classrooms,
    assignments,
    studentProgress,
    experiments,
    createAssignment,
    showToast
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0].id);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form state for new assignment
  const [assignForm, setAssignForm] = useState({
    title: '',
    classroomId: classrooms[0].id,
    experimentId: experiments[0].id,
    dueDate: '2026-11-10',
    instructions: '',
    assignedCount: 36
  });

  const activeClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0];

  // Aggregated teacher stats
  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentCount, 0);
  const totalCompletedLabs = studentProgress.length * 12; // aggregate student submissions
  const overallAvg = Math.round(
    classrooms.reduce((acc, c) => acc + c.averageScore, 0) / classrooms.length
  );

  const handleOpenAssignModal = () => {
    setAssignForm({
      title: `Lab Assignment: ${experiments[0].title}`,
      classroomId: selectedClassId,
      experimentId: experiments[0].id,
      dueDate: '2026-11-12',
      instructions: 'Complete procedural simulation, log at least 4 observation points, and achieve ≥80% on the assessment.',
      assignedCount: activeClass.studentCount
    });
    setShowAssignModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.title.trim()) return;

    createAssignment({
      title: assignForm.title,
      classroomId: assignForm.classroomId,
      experimentId: assignForm.experimentId,
      dueDate: assignForm.dueDate,
      instructions: assignForm.instructions,
      assignedCount: assignForm.assignedCount
    });

    setShowAssignModal(false);
  };

  // Filtered student progress records
  const filteredRecords = studentProgress.filter(rec =>
    rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.experimentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              Faculty Science Portal · REB Curriculum Manager
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Teacher Dashboard: Mugisha Jean-Paul
            </h1>
            <p className="text-xs text-slate-300">
              Department of Physics & Chemistry · Lycée de Kigali
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAssignModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Lab Practical</span>
            </button>
          </div>
        </div>

        {/* Global Classroom Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-2xl font-bold font-mono text-white">{totalStudents}</div>
            <div className="text-xs text-slate-400">Total Enrolled Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-indigo-400">{classrooms.length}</div>
            <div className="text-xs text-slate-400">Active Classrooms</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{overallAvg}%</div>
            <div className="text-xs text-slate-400">Class Average Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-teal-400">86.2%</div>
            <div className="text-xs text-slate-400">Assignment Completion</div>
          </div>
        </div>
      </div>

      {/* Classroom Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase mr-2">Select Class:</span>
        {classrooms.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border ${
              selectedClassId === cls.id
                ? 'bg-indigo-600 text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{cls.name}</span>
            <span className="text-[10px] opacity-75 font-mono">({cls.studentCount} students)</span>
          </button>
        ))}
      </div>

      {/* Classroom Details & Active Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Classroom Assignments & Student Submissions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Assignments for this Class */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Class Lab Assignments
                </h2>
                <p className="text-xs text-slate-500">
                  Target deadlines and progress for {activeClass.name}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {assignments
                .filter(a => a.classroomId === selectedClassId || a.classroomId === 'cls-1')
                .map(asg => {
                  const pct = Math.round((asg.completedCount / asg.assignedCount) * 100);
                  return (
                    <div
                      key={asg.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {asg.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{asg.instructions}</p>
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                          Due {asg.dueDate}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-500">
                          <span>Submissions</span>
                          <span>
                            {asg.completedCount}/{asg.assignedCount} students ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Student Observations & Feedback Notebook */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Student Laboratory Observations
                </h2>
                <p className="text-xs text-slate-500">
                  Review student notebook records and provide practical feedback
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or lab..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredRecords.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{rec.studentName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{rec.experimentTitle}</span>
                    </div>
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      Score: {rec.score}%
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                    &ldquo;{rec.observations}&rdquo;
                  </div>

                  {rec.teacherFeedback && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      Teacher Remark: {rec.teacherFeedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Classroom Metrics & Subject Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Class Diagnostic Performance */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Classroom Practical Metrics
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Average Practical Score</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {activeClass.averageScore}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Curriculum Syllabus Coverage</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  Unit 5 of 8 (62%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Zero Consumable Waste</span>
                <span className="text-sm font-bold font-mono text-teal-600 dark:text-teal-400">
                  100% Digital Safety
                </span>
              </div>
            </div>
          </div>

          {/* Quick Curriculum Alignment Info */}
          <div className="p-5 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 space-y-2">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              REB CBC Competence Standards
            </span>
            <p className="text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-300">
              HezaLab Africa maps every virtual lab practical directly to Rwanda Basic Education Board performance indicators. Student scores can be exported directly for term evaluation reports.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Assign New Lab Practical */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Assign Laboratory Practical
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={assignForm.title}
                  onChange={e => setAssignForm({ ...assignForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Classroom
                  </label>
                  <select
                    value={assignForm.classroomId}
                    onChange={e => setAssignForm({ ...assignForm, classroomId: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={assignForm.dueDate}
                    onChange={e => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lab Investigation
                </label>
                <select
                  value={assignForm.experimentId}
                  onChange={e => setAssignForm({ ...assignForm, experimentId: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {experiments.map(exp => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title} ({exp.gradeLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Teacher Instructions & Rubric Focus
                </label>
                <textarea
                  rows={3}
                  value={assignForm.instructions}
                  onChange={e => setAssignForm({ ...assignForm, instructions: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
