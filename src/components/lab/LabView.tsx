/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Subject, Experiment } from '../../types';
import { OhmsLawSim } from '../experiments/physics/OhmsLawSim';
import { ProjectileMotionSim } from '../experiments/physics/ProjectileMotionSim';
import { TitrationSim } from '../experiments/chemistry/TitrationSim';
import { ReactionsSim } from '../experiments/chemistry/ReactionsSim';
import { MicroscopeSim } from '../experiments/biology/MicroscopeSim';
import { PlantCell3D } from '../experiments/biology/PlantCell3D';
import {
  Atom,
  FlaskConical,
  Dna,
  CheckCircle2,
  BookOpen,
  Wrench,
  FileText,
  Play,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

type LabTab = 'experiment' | 'objectives' | 'equipment' | 'instructions' | 'observations' | 'quiz' | 'results';

export const LabView: React.FC = () => {
  const {
    selectedSubject,
    setSelectedSubject,
    selectedExperimentId,
    setSelectedExperimentId,
    experiments,
    completeExperiment,
    studentProfile,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<LabTab>('experiment');
  const [observationNotes, setObservationNotes] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Active experiment
  const currentExp = experiments.find(e => e.id === selectedExperimentId) || experiments[0];

  // Subject experiments list
  const subjectExperiments = experiments.filter(e => e.subject === selectedSubject);

  // Sync selected subject if experiment changes
  useEffect(() => {
    if (currentExp && currentExp.subject !== selectedSubject) {
      setSelectedSubject(currentExp.subject);
    }
  }, [currentExp, selectedSubject, setSelectedSubject]);

  // Load saved observation if student already completed
  useEffect(() => {
    setObservationNotes('');
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setActiveTab('experiment');
  }, [selectedExperimentId]);

  const handleSelectSubject = (subj: Subject) => {
    setSelectedSubject(subj);
    const firstInSubj = experiments.find(e => e.subject === subj);
    if (firstInSubj) {
      setSelectedExperimentId(firstInSubj.id);
    }
  };

  const handleSelectExperiment = (expId: string) => {
    setSelectedExperimentId(expId);
  };

  const handleAnswerSelect = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!currentExp.questions || currentExp.questions.length === 0) return;

    let correctCount = 0;
    currentExp.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / currentExp.questions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);
    setActiveTab('results');

    // Fire Confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Award XP and complete
    completeExperiment(
      currentExp.id,
      scorePct,
      observationNotes || 'Standard procedural observations recorded during experiment session.',
      currentExp.xpReward
    );
  };

  // Render specific experiment simulation component
  const renderExperimentSimulator = () => {
    switch (currentExp.id) {
      case 'physics-ohms-law':
        return <OhmsLawSim />;
      case 'physics-projectile':
        return <ProjectileMotionSim />;
      case 'chemistry-titration':
        return <TitrationSim />;
      case 'chemistry-reactions':
        return <ReactionsSim />;
      case 'biology-microscope':
        return <MicroscopeSim />;
      case 'biology-plant-cell':
        return <PlantCell3D />;
      default:
        return (
          <div className="p-12 text-center bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
            <FlaskConical className="w-12 h-12 text-teal-400 mx-auto" />
            <h3 className="text-lg font-bold">Interactive Module Launching</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              This advanced simulation pack is queued for local download. Select one of the primary 6 core laboratories to conduct your practical study.
            </p>
          </div>
        );
    }
  };

  const isCompleted = studentProfile.completedExperimentIds.includes(currentExp.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 transition-colors">
      {/* Subject Lab Rooms Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Rwanda Competence-Based Science Curriculum</span>
                <span>·</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">{currentExp.curriculumRef}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {currentExp.title}
              </h1>
            </div>

            {/* Subject Laboratory Hall Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleSelectSubject('physics')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedSubject === 'physics'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Atom className="w-4 h-4" />
                <span>Physics Lab</span>
              </button>
              <button
                onClick={() => handleSelectSubject('chemistry')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedSubject === 'chemistry'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>Chemistry Lab</span>
              </button>
              <button
                onClick={() => handleSelectSubject('biology')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedSubject === 'biology'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Dna className="w-4 h-4" />
                <span>Biology Lab</span>
              </button>
            </div>
          </div>

          {/* Experiment Selection Carousel within Subject */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 mr-1">
              Select Investigation:
            </span>
            {subjectExperiments.map(exp => {
              const active = exp.id === selectedExperimentId;
              const done = studentProfile.completedExperimentIds.includes(exp.id);
              return (
                <button
                  key={exp.id}
                  onClick={() => handleSelectExperiment(exp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 border ${
                    active
                      ? 'bg-slate-900 dark:bg-teal-600 text-white border-transparent shadow-sm'
                      : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{exp.title}</span>
                  <span className="text-[10px] opacity-70">({exp.gradeLevel})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Laboratory Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Pedagogical 8-Stage Workflow Bar */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('experiment')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'experiment'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('objectives')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'objectives'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Objectives</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'equipment'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Scientific Apparatus</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'instructions'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Step-by-Step Guidance</span>
          </button>

          <button
            onClick={() => setActiveTab('observations')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'observations'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Observation Log</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'quiz'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practical Assessment</span>
            {isCompleted && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
          </button>

          {quizSubmitted && (
            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'results'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Results & XP</span>
            </button>
          )}
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'experiment' && (
          <div className="space-y-4">
            {renderExperimentSimulator()}

            {/* Quick Next Step Action Banner */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Ready to verify your scientific discoveries? Record your notes or take the practical assessment.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('observations')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                >
                  Log Observations
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Start Practical Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'objectives' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum Learning Objectives</h2>
              <p className="mt-1 text-xs text-slate-500">
                Aligned with Rwanda Basic Education Board (REB) Secondary Science standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentExp.learningObjectives.map((obj, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveTab('equipment')}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-500 flex items-center gap-1.5"
              >
                <span>Review Equipment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Required Scientific Apparatus</h2>
              <p className="mt-1 text-xs text-slate-500">
                Virtual apparatus simulated with zero material cost and zero chemical hazard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentExp.equipmentList.map((eq, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200"
                >
                  <Wrench className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium">{eq}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setActiveTab('objectives')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900"
              >
                Back to Objectives
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-500 flex items-center gap-1.5"
              >
                <span>Read Step Instructions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Laboratory Procedure Steps</h2>
              <p className="mt-1 text-xs text-slate-500">
                Follow these scientific instructions carefully to complete the investigation.
              </p>
            </div>

            <div className="space-y-3">
              {currentExp.instructions.map((step, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200"
                >
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="leading-relaxed">{step}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setActiveTab('equipment')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Back to Apparatus
              </button>
              <button
                onClick={() => setActiveTab('experiment')}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-500 flex items-center gap-1.5"
              >
                <span>Launch Practical Simulation</span>
                <Play className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'observations' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Scientific Observation Log</h2>
              <p className="mt-1 text-xs text-slate-500">
                Record your qualitative findings, calculated values, and conclusions. Your science teacher will review this notebook.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Experimental Observations & Notes:
              </label>
              <textarea
                value={observationNotes}
                onChange={e => setObservationNotes(e.target.value)}
                placeholder="Example: The potential difference was varied from 4V to 24V. Current responded in exact linear proportion confirming Ohm's Law. Resistor temperature dissipation was simulated with zero drift..."
                rows={6}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('experiment')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Back to Simulator
              </button>
              <button
                onClick={() => {
                  showToast('Observation notes saved locally', 'success');
                  setActiveTab('quiz');
                }}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-500 flex items-center gap-1.5"
              >
                <span>Save Notes & Proceed to Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Practical Assessment Quiz</h2>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Reward: +{currentExp.xpReward} XP
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Answer each question to verify your conceptual comprehension of {currentExp.title}.
              </p>
            </div>

            <div className="space-y-6">
              {currentExp.questions.map((q, qIndex) => {
                const userChoice = selectedAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    <div className="space-y-2 pt-1 pl-7">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = userChoice === optIndex;
                        const isCorrect = q.correctIndex === optIndex;
                        let optionStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750';

                        if (isSelected) {
                          optionStyle = 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold';
                        }
                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            onClick={() => handleAnswerSelect(q.id, optIndex)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 text-xs text-teal-900 dark:text-teal-200">
                        <strong className="block font-semibold mb-0.5">Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('experiment')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Back to Simulator
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={
                  quizSubmitted ||
                  Object.keys(selectedAnswers).length < currentExp.questions.length
                }
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Practical Mastery Certified!</h2>
              <p className="text-xs text-slate-500">
                You have successfully completed {currentExp.title} and submitted your lab record.
              </p>
            </div>

            {/* Score & XP badge */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-500">Quiz Score</div>
                <div className="mt-1 text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">{quizScore}%</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="text-xs text-slate-500">XP Awarded</div>
                <div className="mt-1 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">+{currentExp.xpReward} XP</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('experiment')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
              >
                Replay Simulation
              </button>
              <button
                onClick={() => {
                  const currentIndex = subjectExperiments.findIndex(e => e.id === selectedExperimentId);
                  const nextExp = subjectExperiments[currentIndex + 1] || subjectExperiments[0];
                  handleSelectExperiment(nextExp.id);
                }}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Next Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
