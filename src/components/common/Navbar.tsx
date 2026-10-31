/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, ScreenRoute } from '../../types';
import {
  FlaskConical,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  Users,
  Building2,
  WifiOff
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    route,
    setRoute,
    theme,
    toggleTheme,
    isOfflineSimulated,
    offlineSyncQueue
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks: { label: string; route: ScreenRoute }[] = [
    { label: 'Overview', route: 'landing' },
    { label: 'Virtual Lab', route: 'lab' },
    { label: 'Experiments', route: 'experiments' },
    { label: 'VR & AR', route: 'immersive' },
    { label: 'Offline Ready', route: 'offline' }
  ];

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setRoute('landing')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-teal-700 dark:from-teal-600 dark:to-cyan-400 flex items-center justify-center text-white shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              HezaLab <span className="text-teal-600 dark:text-teal-400">Africa</span>
            </span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map(link => {
              const isActive = route === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => setRoute(link.route)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action & role switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Offline indicator if simulated */}
            {isOfflineSimulated && (
              <button
                onClick={() => setRoute('offline')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                title="Offline Simulation Active"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Mode ({offlineSyncQueue.length} queued)</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                aria-expanded={roleDropdownOpen}
              >
                {role === 'student' && <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                {role === 'teacher' && <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                {role === 'school' && <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                <span className="capitalize">{role} View</span>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Switch Perspective
                  </div>
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors ${
                      role === 'student' ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/20' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-medium">Student Dashboard</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Keza Amina (S4 PCB)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('teacher')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors ${
                      role === 'teacher' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-950/20' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-medium">Teacher Dashboard</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Mugisha Jean-Paul</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('school')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors ${
                      role === 'school' ? 'text-amber-600 dark:text-amber-400 font-semibold bg-amber-50/50 dark:bg-amber-950/20' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-medium">School Administrator</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Lycée de Kigali Admin</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle color theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setRoute('lab')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-teal-600 rounded-lg hover:bg-slate-800 dark:hover:bg-teal-500 transition-colors whitespace-nowrap shadow-sm"
            >
              Enter Virtual Lab
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <button
                key={link.route}
                onClick={() => {
                  setRoute(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  route === link.route
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setRoute('lab');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-teal-600 rounded-lg shadow-sm"
            >
              Enter Virtual Lab
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
