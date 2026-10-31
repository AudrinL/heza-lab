/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'school';

export type Subject = 'physics' | 'chemistry' | 'biology';

export type Difficulty = 'foundational' | 'intermediate' | 'advanced';

export type ScreenRoute = 
  | 'landing' 
  | 'student' 
  | 'lab' 
  | 'experiments' 
  | 'teacher' 
  | 'school' 
  | 'immersive' 
  | 'offline';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Experiment {
  id: string;
  title: string;
  subject: Subject;
  gradeLevel: string; // e.g., "Senior 4 (S4)", "Senior 5 (S5)", "Senior 3 (S3)"
  difficulty: Difficulty;
  estimatedMinutes: number;
  curriculumRef: string; // Rwanda REB Curriculum code
  summary: string;
  learningObjectives: string[];
  equipmentList: string[];
  instructions: string[];
  questions: QuizQuestion[];
  xpReward: number;
  featured?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  gradeLevel: string;
  school: string;
  streakDays: number;
  totalXp: number;
  completedExperimentIds: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  subject: Subject | 'general';
  unlockedAt?: string;
  icon: string;
}

export interface Assignment {
  id: string;
  title: string;
  classroomId: string;
  experimentId: string;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  instructions: string;
  assignedCount: number;
  completedCount: number;
}

export interface StudentProgressRecord {
  id: string;
  studentId: string;
  studentName: string;
  experimentId: string;
  experimentTitle: string;
  subject: Subject;
  completedAt: string;
  score: number;
  observations: string;
  teacherFeedback?: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject: Subject;
  studentCount: number;
  averageScore: number;
  completionRate: number;
}

export interface VRDevice {
  id: string;
  name: string;
  type: 'Meta Quest 2' | 'Pico Neo 3' | 'Google Cardboard / Mobile AR' | 'Computer Workstation';
  serial: string;
  batteryPct: number;
  status: 'available' | 'in-use' | 'charging' | 'maintenance';
  room: string;
  assignedStudent?: string;
}

export interface OfflinePackage {
  id: string;
  title: string;
  subject: Subject;
  sizeMb: number;
  isDownloaded: boolean;
  experimentsCount: number;
  lastUpdated: string;
}
