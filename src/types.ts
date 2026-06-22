export type ProjectCategory = 'AI/ML' | 'Web Development' | 'University' | 'Business' | 'Content Creation' | 'Personal';
export type ProjectStatus = 'Idea' | 'Planning' | 'Building' | 'Testing' | 'Completed' | 'On Hold';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type GoalCategory = 'Academic' | 'Career' | 'Personal';
export type LearningCategory = 'Python' | 'Machine Learning' | 'Deep Learning' | 'DSA' | 'React' | 'Next.js' | 'AI Engineering';
export type RevenueStatus = 'Lead' | 'Proposal Sent' | 'Negotiating' | 'Paid' | 'Completed';

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: PriorityLevel;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: PriorityLevel;
  progress: number; // 0 to 100, auto-calculated from milestones or tasks if milestones exist
  startDate: string;
  deadline: string;
  tags: string[];
  milestones: Milestone[];
  tasks: Task[];
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  notes?: string;
}

export interface LearningSkill {
  id: string;
  category: LearningCategory;
  progress: number; // 0 to 100
  hoursStudied: number;
  notes: string;
  resources: string[];
}

export interface RevenueRecord {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: RevenueStatus;
  date: string;
}

export interface DailyLog {
  id: string; // usually YYYY-MM-DD
  completed: string;
  challenges: string;
  wins: string;
  lessons: string;
  rating: number; // 1-5 scale
  dateString: string; // readable e.g., "June 20, 2026"
}

export interface WeeklyReview {
  id: string; // e.g. "2026-W25"
  weekLabel: string; // e.g. "Week 25 (Jun 15 - Jun 21)"
  completedThisWeek: string;
  blockedTasks: string;
  biggestWins: string;
  mistakesMade: string;
  focusNextWeek: string;
  dateCreated: string;
}

export interface ProjectOSData {
  projects: Project[];
  goals: Goal[];
  skills: LearningSkill[];
  revenue: RevenueRecord[];
  dailyLogs: DailyLog[];
  weeklyReviews: WeeklyReview[];
  settings: {
    userName: string;
    avatarUrl: string;
    role: string;
    theme: 'dark' | 'light';
    notificationsEnabled: boolean;
    mainFocusProjectId: string;
    todayFocusTaskId1: string;
    todayFocusTaskId2: string;
    todayFocusTaskId3: string;
    todayLearningGoal: string;
  };
}
