/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Headphones,
  Battery,
  BatteryCharging,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Monitor
} from 'lucide-react';

export const SchoolDashboard: React.FC = () => {
  const { vrDevices, toggleDeviceStatus, classrooms } = useApp();

  const totalDevices = vrDevices.length;
  const availableCount = vrDevices.filter(d => d.status === 'available').length;
  const inUseCount = vrDevices.filter(d => d.status === 'in-use').length;
  const chargingCount = vrDevices.filter(d => d.status === 'charging').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* School Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
              Institutional STEM Infrastructure Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Lycée de Kigali · Science & VR Fleet
            </h1>
            <p className="text-xs text-slate-300">
              Nyarugenge District, Kigali, Rwanda · Ministry of Education (MINEDUC) Pilot Hub
            </p>
          </div>

          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono">
            Active Term: 2026 Term 3
          </div>
        </div>

        {/* Global School KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-2xl font-bold font-mono text-white">640</div>
            <div className="text-xs text-slate-400">Enrolled STEM Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">18</div>
            <div className="text-xs text-slate-400">Active Science Faculty</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-teal-400">1,420 hrs</div>
            <div className="text-xs text-slate-400">Virtual Lab Sessions Logged</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">$18,400</div>
            <div className="text-xs text-slate-400">Estimated Reagents Saved</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): VR Fleet & Device Management */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-500" />
                  <span>VR Headset & Workstation Fleet</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time device allocation, battery status, and room assignment
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{availableCount} Available</span>
                <span>·</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{inUseCount} In-Use</span>
                <span>·</span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold">{chargingCount} Charging</span>
              </div>
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {vrDevices.map(device => {
                let badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
                if (device.status === 'in-use') {
                  badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
                } else if (device.status === 'charging') {
                  badgeColor = 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300';
                }

                return (
                  <div
                    key={device.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {device.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {device.type} · {device.serial}
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${badgeColor}`}>
                        {device.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        {device.status === 'charging' ? (
                          <BatteryCharging className="w-3.5 h-3.5 text-sky-500" />
                        ) : (
                          <Battery className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        <span className="font-mono">{device.batteryPct}%</span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
                        {device.room}
                      </div>

                      <button
                        onClick={() => toggleDeviceStatus(device.id)}
                        className="px-2 py-1 text-[10px] font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 rounded border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                        title="Toggle equipment status"
                      >
                        Change Status
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Consumable Savings & Infrastructure Impact */}
        <div className="lg:col-span-4 space-y-6">
          {/* Consumables Savings Calculator Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Consumable Cost Reductions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Chemical Reagents (Acids/Bases)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-$6,200</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Glassware Replacement (Breakage)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-$4,400</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Hazardous Waste Disposal</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-$3,800</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Specialized Optical Bulbs & Slides</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-$4,000</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="font-bold">Total Annual Budget Reallocated:</div>
              <div className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                $18,400 USD
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                Reinvested into school broadband internet, solar back-up panels, and additional student learning tablets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
