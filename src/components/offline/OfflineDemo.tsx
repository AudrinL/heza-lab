/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wifi,
  WifiOff,
  Download,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Cloud,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export const OfflineDemo: React.FC = () => {
  const {
    offlinePackages,
    togglePackageDownload,
    isOfflineSimulated,
    setIsOfflineSimulated,
    offlineSyncQueue,
    syncOfflineData,
    setRoute
  } = useApp();

  const totalStorageMb = offlinePackages
    .filter(p => p.isDownloaded)
    .reduce((acc, p) => acc + p.sizeMb, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
          Resilient Rural EdTech Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Offline-First Learning & Edge Synchronization
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Designed specifically for African schools with intermittent rural electricity or low-bandwidth internet connectivity. Pre-cache complete 3D laboratory modules and conduct experiments offline.
        </p>
      </div>

      {/* Network Connectivity Simulator Toggle Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isOfflineSimulated
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
          }`}>
            {isOfflineSimulated ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isOfflineSimulated ? 'Offline Simulation: ACTIVE' : 'Connected to Cloud Network'}
              </h2>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                isOfflineSimulated
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {isOfflineSimulated ? 'Disconnected' : 'Online'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Toggle offline mode to verify that cached 3D laboratories and quizzes continue running smoothly without external network requests.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm ${
            isOfflineSimulated
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
        >
          {isOfflineSimulated ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{isOfflineSimulated ? 'Restore Cloud Connection' : 'Simulate Offline Mode'}</span>
        </button>
      </div>

      {/* 2-Column Grid: Packages and Sync Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Downloadable Module Packs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Local Simulation Module Packs
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-installed on school lab tablets or cached in browser IndexedDB
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500">
                {totalStorageMb.toFixed(1)} MB Cached
              </div>
            </div>

            <div className="space-y-3">
              {offlinePackages.map(pkg => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{pkg.title}</span>
                      {pkg.isDownloaded && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                          Downloaded
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {pkg.sizeMb} MB · {pkg.experimentsCount} Experiments · Updated {pkg.lastUpdated}
                    </div>
                  </div>

                  <button
                    onClick={() => togglePackageDownload(pkg.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                      pkg.isDownloaded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    {pkg.isDownloaded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Cached</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Cloud Sync Queue */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Cloud Sync Queue
              </h3>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                {offlineSyncQueue.length} Pending
              </span>
            </div>

            <p className="text-xs text-slate-500">
              When students complete experiments while offline, records are stored safely in local storage and queued to sync once internet is re-established.
            </p>

            {offlineSyncQueue.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <div>All local progress is fully synchronized with the cloud school database.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {offlineSyncQueue.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.experimentTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Score: {item.score}% · {item.completedAt}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                      Waiting for sync
                    </span>
                  </div>
                ))}

                <button
                  onClick={syncOfflineData}
                  disabled={isOfflineSimulated}
                  className="w-full mt-3 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Queued Data to Cloud Database</span>
                </button>
                {isOfflineSimulated && (
                  <div className="text-[10px] text-center text-amber-600">
                    Reconnect connection first to upload queued results.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
