/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { LabView } from './components/lab/LabView';
import { ExperimentLibrary } from './components/library/ExperimentLibrary';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { SchoolDashboard } from './components/school/SchoolDashboard';
import { ImmersiveDemo } from './components/immersive/ImmersiveDemo';
import { OfflineDemo } from './components/offline/OfflineDemo';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { route, toasts } = useApp();

  const renderCurrentRoute = () => {
    switch (route) {
      case 'landing':
        return <LandingPage />;
      case 'student':
        return <StudentDashboard />;
      case 'lab':
        return <LabView />;
      case 'experiments':
        return <ExperimentLibrary />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'school':
        return <SchoolDashboard />;
      case 'immersive':
        return <ImmersiveDemo />;
      case 'offline':
        return <OfflineDemo />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>

      <Footer />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => {
          let icon = <CheckCircle2 className="w-4 h-4 text-teal-500" />;
          if (toast.type === 'warning') icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
          if (toast.type === 'info') icon = <Info className="w-4 h-4 text-sky-500" />;

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              {icon}
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
