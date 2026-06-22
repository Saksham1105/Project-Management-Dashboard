import { ProjectOSData, Project, Task, Goal, LearningSkill, RevenueRecord, DailyLog, WeeklyReview } from './types';
import { getInitialData } from './sampleData';

const STORAGE_KEY = 'projectos_command_data';

export const loadData = (): ProjectOSData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Fallback for settings if they became stale
      if (parsed.projects && parsed.settings) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load local storage data:', e);
  }
  const initial = getInitialData();
  saveData(initial);
  return initial;
};

export const saveData = (data: ProjectOSData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to local storage:', e);
  }
};

// Simple helper to calculate a project's progress percentage accurately
export const recalculateProjectProgress = (project: Project): number => {
  if (!project.milestones || project.milestones.length === 0) {
    return project.progress; // fall back to manual progress
  }
  const completed = project.milestones.filter(m => m.completed).length;
  return Math.round((completed / project.milestones.length) * 100);
};

// Project update workflows
export const addProject = (data: ProjectOSData, project: Project): ProjectOSData => {
  const updated = {
    ...data,
    projects: [project, ...data.projects]
  };
  saveData(updated);
  return updated;
};

export const updateProject = (data: ProjectOSData, updatedProject: Project): ProjectOSData => {
  const updated = {
    ...data,
    projects: data.projects.map(p => {
      if (p.id === updatedProject.id) {
        const withProgress = {
          ...updatedProject,
          progress: recalculateProjectProgress(updatedProject)
        };
        return withProgress;
      }
      return p;
    })
  };
  saveData(updated);
  return updated;
};

export const deleteProject = (data: ProjectOSData, projectId: string): ProjectOSData => {
  const updated = {
    ...data,
    projects: data.projects.filter(p => p.id !== projectId),
    settings: {
      ...data.settings,
      mainFocusProjectId: data.settings.mainFocusProjectId === projectId ? '' : data.settings.mainFocusProjectId
    }
  };
  saveData(updated);
  return updated;
};

// Task update workflows
export const addTask = (data: ProjectOSData, projectId: string, task: Task): ProjectOSData => {
  const updated = {
    ...data,
    projects: data.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: [...p.tasks, task]
        };
      }
      return p;
    })
  };
  saveData(updated);
  return updated;
};

export const updateTask = (data: ProjectOSData, projectId: string, updatedTask: Task): ProjectOSData => {
  const updated = {
    ...data,
    projects: data.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        };
      }
      return p;
    })
  };
  saveData(updated);
  return updated;
};

export const deleteTask = (data: ProjectOSData, projectId: string, taskId: string): ProjectOSData => {
  const updated = {
    ...data,
    projects: data.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.filter(t => t.id !== taskId)
        };
      }
      return p;
    })
  };
  saveData(updated);
  return updated;
};

// Goals update workflows
export const saveGoal = (data: ProjectOSData, goal: Goal): ProjectOSData => {
  const exists = data.goals.some(g => g.id === goal.id);
  const updatedGoals = exists
    ? data.goals.map(g => g.id === goal.id ? goal : g)
    : [...data.goals, goal];
  
  const updated = {
    ...data,
    goals: updatedGoals
  };
  saveData(updated);
  return updated;
};

export const deleteGoal = (data: ProjectOSData, goalId: string): ProjectOSData => {
  const updated = {
    ...data,
    goals: data.goals.filter(g => g.id !== goalId)
  };
  saveData(updated);
  return updated;
};

// Skills update workflows
export const saveSkill = (data: ProjectOSData, skill: LearningSkill): ProjectOSData => {
  const updated = {
    ...data,
    skills: data.skills.map(s => s.id === skill.id ? skill : s)
  };
  saveData(updated);
  return updated;
};

// Revenue update workflows
export const saveRevenueRecord = (data: ProjectOSData, record: RevenueRecord): ProjectOSData => {
  const exists = data.revenue.some(r => r.id === record.id);
  const updatedRevenue = exists
    ? data.revenue.map(r => r.id === record.id ? record : r)
    : [record, ...data.revenue];

  const updated = {
    ...data,
    revenue: updatedRevenue
  };
  saveData(updated);
  return updated;
};

export const deleteRevenueRecord = (data: ProjectOSData, recordId: string): ProjectOSData => {
  const updated = {
    ...data,
    revenue: data.revenue.filter(r => r.id !== recordId)
  };
  saveData(updated);
  return updated;
};

// Daily Logs
export const saveDailyLog = (data: ProjectOSData, log: DailyLog): ProjectOSData => {
  const exists = data.dailyLogs.some(l => l.id === log.id);
  const updatedLogs = exists
    ? data.dailyLogs.map(l => l.id === log.id ? log : l)
    : [log, ...data.dailyLogs];

  const updated = {
    ...data,
    dailyLogs: updatedLogs
  };
  saveData(updated);
  return updated;
};

// Weekly Reviews
export const saveWeeklyReview = (data: ProjectOSData, review: WeeklyReview): ProjectOSData => {
  const exists = data.weeklyReviews.some(r => r.id === review.id);
  const updatedReviews = exists
    ? data.weeklyReviews.map(r => r.id === review.id ? review : r)
    : [review, ...data.weeklyReviews];

  const updated = {
    ...data,
    weeklyReviews: updatedReviews
  };
  saveData(updated);
  return updated;
};

export const deleteWeeklyReview = (data: ProjectOSData, reviewId: string): ProjectOSData => {
  const updated = {
    ...data,
    weeklyReviews: data.weeklyReviews.filter(r => r.id !== reviewId)
  };
  saveData(updated);
  return updated;
};

// Settings
export const saveSettings = (data: ProjectOSData, settings: ProjectOSData['settings']): ProjectOSData => {
  const updated = {
    ...data,
    settings
  };
  saveData(updated);
  return updated;
};

// Full Backup Reset APIs
export const importAllData = (rawJson: string): ProjectOSData => {
  const parsed = JSON.parse(rawJson);
  if (!parsed.projects || !parsed.goals || !parsed.skills || !parsed.settings) {
    throw new Error('Invalid backup file format');
  }
  saveData(parsed);
  return parsed;
};

export const resetAllData = (): ProjectOSData => {
  const initial = getInitialData();
  saveData(initial);
  return initial;
};
