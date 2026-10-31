/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ScreenRoute,
  Subject,
  Experiment,
  StudentProfile,
  Classroom,
  Assignment,
  StudentProgressRecord,
  VRDevice,
  OfflinePackage
} from '../types';
import {
  EXPERIMENTS_DATA,
  INITIAL_STUDENT_PROFILE,
  INITIAL_CLASSROOMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_STUDENT_PROGRESS,
  INITIAL_VR_DEVICES,
  INITIAL_OFFLINE_PACKAGES
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  route: ScreenRoute;
  setRoute: (route: ScreenRoute) => void;
  selectedExperimentId: string;
  setSelectedExperimentId: (id: string) => void;
  selectedSubject: Subject;
  setSelectedSubject: (subject: Subject) => void;
  experiments: Experiment[];
  studentProfile: StudentProfile;
  classrooms: Classroom[];
  assignments: Assignment[];
  studentProgress: StudentProgressRecord[];
  vrDevices: VRDevice[];
  offlinePackages: OfflinePackage[];
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (val: boolean) => void;
  offlineSyncQueue: StudentProgressRecord[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  completeExperiment: (experimentId: string, score: number, observations: string, earnedXp: number) => void;
  createAssignment: (newAssignment: Omit<Assignment, 'id' | 'status' | 'completedCount'>) => void;
  toggleDeviceStatus: (deviceId: string) => void;
  togglePackageDownload: (packageId: string) => void;
  syncOfflineData: () => void;
  startExperiment: (experimentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('student');
  const [route, setRouteState] = useState<ScreenRoute>('landing');
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>('physics-ohms-law');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('physics');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('hezalab_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hezalab_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Student Profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hezalab_student_profile');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('hezalab_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  // Assignments & Classrooms
  const [classrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [studentProgress, setStudentProgress] = useState<StudentProgressRecord[]>(INITIAL_STUDENT_PROGRESS);
  const [vrDevices, setVrDevices] = useState<VRDevice[]>(INITIAL_VR_DEVICES);
  const [offlinePackages, setOfflinePackages] = useState<OfflinePackage[]>(INITIAL_OFFLINE_PACKAGES);
  
  // Offline Simulation
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<StudentProgressRecord[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'student') setRouteState('student');
    else if (newRole === 'teacher') setRouteState('teacher');
    else if (newRole === 'school') setRouteState('school');
    showToast(`Switched view to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} Mode`, 'info');
  };

  const setRoute = (newRoute: ScreenRoute) => {
    setRouteState(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startExperiment = (experimentId: string) => {
    const exp = EXPERIMENTS_DATA.find(e => e.id === experimentId);
    if (exp) {
      setSelectedExperimentId(experimentId);
      setSelectedSubject(exp.subject);
      setRoute('lab');
    }
  };

  const completeExperiment = (
    experimentId: string,
    score: number,
    observations: string,
    earnedXp: number
  ) => {
    const exp = EXPERIMENTS_DATA.find(e => e.id === experimentId);
    if (!exp) return;

    const newRecord: StudentProgressRecord = {
      id: `rec-${Date.now()}`,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      experimentId,
      experimentTitle: exp.title,
      subject: exp.subject,
      completedAt: new Date().toISOString().split('T')[0],
      score,
      observations,
      teacherFeedback: score >= 90 ? 'Exceptional precision in scientific procedure.' : 'Good attempt. Review the quiz notes for deeper insights.'
    };

    if (isOfflineSimulated) {
      setOfflineSyncQueue(prev => [...prev, newRecord]);
      showToast(`Saved to Offline Storage! (${offlineSyncQueue.length + 1} queued for cloud sync)`, 'warning');
    } else {
      setStudentProgress(prev => [newRecord, ...prev]);
    }

    setStudentProfile(prev => {
      const alreadyCompleted = prev.completedExperimentIds.includes(experimentId);
      const newCompleted = alreadyCompleted
        ? prev.completedExperimentIds
        : [...prev.completedExperimentIds, experimentId];
      return {
        ...prev,
        totalXp: prev.totalXp + earnedXp,
        completedExperimentIds: newCompleted
      };
    });

    // Update assignment if matching
    setAssignments(prev =>
      prev.map(asg => {
        if (asg.experimentId === experimentId) {
          return {
            ...asg,
            completedCount: Math.min(asg.assignedCount, asg.completedCount + 1),
            status: asg.completedCount + 1 >= asg.assignedCount ? 'completed' : 'active'
          };
        }
        return asg;
      })
    );

    showToast(`Experiment Completed! Earned +${earnedXp} XP`, 'success');
  };

  const createAssignment = (newAssignment: Omit<Assignment, 'id' | 'status' | 'completedCount'>) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: `asg-${Date.now()}`,
      status: 'active',
      completedCount: 0
    };
    setAssignments(prev => [assignment, ...prev]);
    showToast(`New Lab Assignment published for ${newAssignment.classroomId}`, 'success');
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setVrDevices(prev =>
      prev.map(dev => {
        if (dev.id === deviceId) {
          const nextStatus = dev.status === 'available' ? 'in-use' : dev.status === 'in-use' ? 'charging' : 'available';
          return { ...dev, status: nextStatus };
        }
        return dev;
      })
    );
    showToast('Updated equipment status', 'info');
  };

  const togglePackageDownload = (packageId: string) => {
    setOfflinePackages(prev =>
      prev.map(p => {
        if (p.id === packageId) {
          const nextState = !p.isDownloaded;
          showToast(nextState ? `Downloaded ${p.title} for offline use` : `Removed offline cache for ${p.title}`, 'info');
          return { ...p, isDownloaded: nextState };
        }
        return p;
      })
    );
  };

  const syncOfflineData = () => {
    if (offlineSyncQueue.length === 0) {
      showToast('No pending offline records to sync', 'info');
      return;
    }
    setStudentProgress(prev => [...offlineSyncQueue, ...prev]);
    const count = offlineSyncQueue.length;
    setOfflineSyncQueue([]);
    showToast(`Successfully synced ${count} experiments to cloud database!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        route,
        setRoute,
        selectedExperimentId,
        setSelectedExperimentId,
        selectedSubject,
        setSelectedSubject,
        experiments: EXPERIMENTS_DATA,
        studentProfile,
        classrooms,
        assignments,
        studentProgress,
        vrDevices,
        offlinePackages,
        isOfflineSimulated,
        setIsOfflineSimulated,
        offlineSyncQueue,
        theme,
        toggleTheme,
        toasts,
        showToast,
        completeExperiment,
        createAssignment,
        toggleDeviceStatus,
        togglePackageDownload,
        syncOfflineData,
        startExperiment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
