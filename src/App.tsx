import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Terminal, 
  Search, 
  Sparkles, 
  FolderGit, 
  ListTodo, 
  BookOpen, 
  X,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data types & Storage
import { ProjectOSData, Project, Task, Goal, LearningSkill, RevenueRecord, DailyLog, WeeklyReview } from './types';
import { 
  loadData, 
  saveData,
  addProject, 
  updateProject, 
  deleteProject, 
  addTask, 
  updateTask,
  deleteTask,
  saveGoal, 
  deleteGoal, 
  saveSkill, 
  saveRevenueRecord, 
  deleteRevenueRecord, 
  saveDailyLog, 
  saveWeeklyReview, 
  deleteWeeklyReview, 
  saveSettings, 
  importAllData, 
  resetAllData 
} from './storage';

// Components
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import QuickActionModal from './components/QuickActionModal';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import GoalsView from './components/GoalsView';
import LearningView from './components/LearningView';
import RevenueView from './components/RevenueView';
import DailyLogView from './components/DailyLogView';
import WeeklyReviewView from './components/WeeklyReviewView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Global State Engine loaded from localStorage
  const [data, setData] = useState<ProjectOSData | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Command palette & floating actions state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'task' | 'project' | 'log'>('task');
  const [isFloatingActionsOpen, setIsFloatingActionsOpen] = useState(false);

  // Load database on initial mount
  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
  }, []);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    return () => window.removeEventListener('keydown', handleGlobalShortcut);
  }, []);

  if (!data) {
    // Elegant loading splash
    return (
      <div className="h-screen w-screen bg-[#030303] flex flex-col items-center justify-center font-display text-white">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl animate-spin mb-4" style={{ animationDuration: '3s' }}>
          <Terminal className="h-6 w-6 text-indigo-400" />
        </div>
        <p className="text-sm font-semibold tracking-wide uppercase font-mono text-gray-400">ProjectOS Booting Workspace...</p>
      </div>
    );
  }

  // Trigger sound alerts if settings allow
  const playAlertSound = () => {
    if (data.settings.notificationsEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // high clean pitch
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        console.warn('Audio feedback failed or was blocked by gesture rules');
      }
    }
  };

  // State mutators mapped to storage APIs with alert sound feedback
  const handleSaveProject = (project: Project) => {
    const updated = addProject(data, project);
    setData(updated);
    playAlertSound();
  };

  const handleUpdateProject = (project: Project) => {
    const updated = updateProject(data, project);
    setData(updated);
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = deleteProject(data, projectId);
    setData(updated);
  };

  const handleAddTask = (projectId: string, task: Task) => {
    const updated = addTask(data, projectId, task);
    setData(updated);
    playAlertSound();
  };

  // Dedicated task toggler that handles today focus checking
  const handleCompleteTask = (projectId: string, taskId: string, completed: boolean) => {
    const targetProj = data.projects.find(p => p.id === projectId);
    if (!targetProj) return;

    const targetTask = targetProj.tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const updatedTask: Task = {
      ...targetTask,
      status: completed ? 'Done' : 'In Progress'
    };

    const updated = updateTask(data, projectId, updatedTask);
    setData(updated);
    if (completed) playAlertSound();
  };

  const handleSaveGoal = (goal: Goal) => {
    const updated = saveGoal(data, goal);
    setData(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = deleteGoal(data, goalId);
    setData(updated);
  };

  const handleSaveSkill = (skill: LearningSkill) => {
    const updated = saveSkill(data, skill);
    setData(updated);
  };

  const handleSaveRevenueRecord = (record: RevenueRecord) => {
    const updated = saveRevenueRecord(data, record);
    setData(updated);
  };

  const handleDeleteRevenueRecord = (recordId: string) => {
    const updated = deleteRevenueRecord(data, recordId);
    setData(updated);
  };

  const handleSaveDailyLog = (log: DailyLog) => {
    const updated = saveDailyLog(data, log);
    setData(updated);
    playAlertSound();
  };

  const handleSaveWeeklyReview = (review: WeeklyReview) => {
    const updated = saveWeeklyReview(data, review);
    setData(updated);
    playAlertSound();
  };

  const handleDeleteWeeklyReview = (reviewId: string) => {
    const updated = deleteWeeklyReview(data, reviewId);
    setData(updated);
  };

  const handleUpdateSettings = (settings: ProjectOSData['settings']) => {
    const updated = saveSettings(data, settings);
    setData(updated);
  };

  const handleUpdateFocusSetting = (updates: Partial<ProjectOSData['settings']>) => {
    const updatedSettings = {
      ...data.settings,
      ...updates
    };
    const updated = saveSettings(data, updatedSettings);
    setData(updated);
  };

  const handleImportData = (rawJson: string) => {
    const imported = importAllData(rawJson);
    setData(imported);
  };

  const handleResetData = () => {
    const reset = resetAllData();
    setData(reset);
  };

  const triggerQuickAction = (type: 'task' | 'project' | 'log') => {
    setQuickActionType(type);
    setIsQuickActionOpen(true);
    setIsFloatingActionsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#030303] font-sans antialiased text-gray-200 select-none flex flex-col md:flex-row relative">
      
      {/* Decorative background ambient glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#4f46e5]/5 rounded-full blur-[150px] pointer-events-none ambient-glow-circle" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8b5cf6]/5 rounded-full blur-[150px] pointer-events-none ambient-glow-circle" />

      {/* Main Sidebar Navigation Column */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        data={data}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Contents Window */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8 pt-6 pb-20 md:pb-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {currentTab === 'dashboard' && (
              <DashboardView 
                data={data} 
                onUpdateFocusSetting={handleUpdateFocusSetting}
                onCompleteTask={handleCompleteTask}
                onNavigateToTab={setCurrentTab}
              />
            )}

            {currentTab === 'projects' && (
              <ProjectsView 
                projects={data.projects}
                onSaveProject={handleSaveProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onAddTask={handleAddTask}
              />
            )}

            {currentTab === 'goals' && (
              <GoalsView 
                goals={data.goals}
                onSaveGoal={handleSaveGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            )}

            {currentTab === 'learning' && (
              <LearningView 
                skills={data.skills}
                onSaveSkill={handleSaveSkill}
              />
            )}

            {currentTab === 'revenue' && (
              <RevenueView 
                revenue={data.revenue}
                onSaveRevenueRecord={handleSaveRevenueRecord}
                onDeleteRevenueRecord={handleDeleteRevenueRecord}
              />
            )}

            {currentTab === 'daily-log' && (
              <DailyLogView 
                logs={data.dailyLogs}
                onSaveLog={handleSaveDailyLog}
              />
            )}

            {currentTab === 'weekly' && (
              <WeeklyReviewView 
                reviews={data.weeklyReviews}
                onSaveReview={handleSaveWeeklyReview}
                onDeleteReview={handleDeleteWeeklyReview}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView data={data} />
            )}

            {currentTab === 'settings' && (
              <SettingsView 
                data={data}
                onUpdateSettings={handleUpdateSettings}
                onImportData={handleImportData}
                onResetData={handleResetData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOATING ACTION PILL BUTTON (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2.5">
        
        {/* Floating expansions drawer */}
        <AnimatePresence>
          {isFloatingActionsOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: 'spring', damping: 20 }}
              className="p-2.5 bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col space-y-1.5 backdrop-blur-xl shrink-0"
            >
              <button 
                onClick={() => triggerQuickAction('task')}
                className="flex items-center space-x-2.5 px-3 py-1.5 hover:bg-slate-900 rounded-xl text-xs font-mono font-bold text-gray-300 hover:text-white transition"
              >
                <ListTodo className="h-4 w-4 text-indigo-400" />
                <span>Allocate Task</span>
              </button>

              <button 
                onClick={() => triggerQuickAction('project')}
                className="flex items-center space-x-2.5 px-3 py-1.5 hover:bg-slate-900 rounded-xl text-xs font-mono font-bold text-gray-300 hover:text-white transition"
              >
                <FolderGit className="h-4 w-4 text-emerald-400" />
                <span>Deploy Workspace</span>
              </button>

              <button 
                onClick={() => triggerQuickAction('log')}
                className="flex items-center space-x-2.5 px-3 py-1.5 hover:bg-slate-900 rounded-xl text-xs font-mono font-bold text-gray-300 hover:text-white transition"
              >
                <BookOpen className="h-4 w-4 text-orange-400" />
                <span>Write Chronicle</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Plus Button */}
        <button
          onClick={() => setIsFloatingActionsOpen(!isFloatingActionsOpen)}
          className={`
            p-3.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-650/15 border border-indigo-400/25 transition-transform duration-200 active:scale-95
            ${isFloatingActionsOpen ? 'rotate-45 bg-rose-600/90 hover:bg-rose-500 border-rose-400/20 shadow-none' : ''}
          `}
          title="Create Record (FAB)"
        >
          {isFloatingActionsOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {/* Global Command list backings */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentTab}
        onQuickAction={triggerQuickAction}
      />

      {/* Comprehensive Quick Action Modal Drawer */}
      <QuickActionModal 
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        actionType={quickActionType}
        data={data}
        onSaveProject={handleSaveProject}
        onSaveTask={handleAddTask}
        onSaveLog={handleSaveDailyLog}
      />

    </div>
  );
}
