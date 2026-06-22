import React, { useState } from 'react';
import { 
  FolderGit, 
  CheckCircle, 
  Gauge, 
  ListTodo, 
  Coins, 
  Flame, 
  Bookmark, 
  CornerRightDown, 
  Edit3, 
  Briefcase, 
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProjectOSData, Project, Task } from '../types';

interface DashboardViewProps {
  data: ProjectOSData;
  onUpdateFocusSetting: (updates: Partial<ProjectOSData['settings']>) => void;
  onCompleteTask: (projectId: string, taskId: string, completed: boolean) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({ 
  data, 
  onUpdateFocusSetting, 
  onCompleteTask, 
  onNavigateToTab 
}: DashboardViewProps) {
  
  const [isEditingFocusProject, setIsEditingFocusProject] = useState(false);
  const [isEditingWeeklyGoal, setIsEditingWeeklyGoal] = useState(false);

  const projects = data.projects;
  const settings = data.settings;

  // Derive top numerical aggregates
  const activeProjectsCount = projects.filter(p => ['Planning', 'Building', 'Testing'].includes(p.status)).length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  
  // Total Tasks completed vs total tasks across all systems
  const allTasks = projects.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'Done');
  const totalTasksCount = allTasks.length;
  const taskCompletionRate = totalTasksCount > 0 
    ? Math.round((completedTasks.length / totalTasksCount) * 100) 
    : 0;

  // Revenue sum
  const totalRevenue = data.revenue
    .filter(r => ['Paid', 'Completed'].includes(r.status))
    .reduce((sum, current) => sum + current.amount, 0);

  // Focus Project Lookup
  const focusProject = projects.find(p => p.id === settings.mainFocusProjectId) || projects[0];

  // Lookup the today's focus tasks
  const focusTask1 = allTasks.find(t => t.id === settings.todayFocusTaskId1);
  const focusTask2 = allTasks.find(t => t.id === settings.todayFocusTaskId2);
  const focusTask3 = allTasks.find(t => t.id === settings.todayFocusTaskId3);

  const focusTasksList = [focusTask1, focusTask2, focusTask3].filter((t): t is Task => !!t);
  const doneFocusTasksCount = focusTasksList.filter(t => t.status === 'Done').length;
  const focusProgressPct = focusTasksList.length > 0 
    ? Math.round((doneFocusTasksCount / focusTasksList.length) * 100) 
    : 0;

  // Streak tracker derivation
  const streakCount = data.dailyLogs.length; // Approximate simple count of logged days represent streak

  // Motivational quote select
  const quote = "Run your life like a venture-backed startup. Ships are safe in harbor, but that is not what ships are built for.";

  // Handle task complete toggle
  const handleToggleFocusTask = (task: Task) => {
    const isDone = task.status === 'Done';
    onCompleteTask(task.projectId, task.id, !isDone);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            Workspace Command Deck <Sparkles className="h-5 w-5 text-indigo-400" />
          </h2>
          <p className="text-xs text-gray-400">Welcome back, founder. Trace active systems and daily execution sprint loops.</p>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-2 text-xs font-mono">
            <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
            <span className="text-gray-400">Streak:</span>
            <span className="text-white font-bold">{streakCount} Days</span>
          </div>
          <button 
            onClick={() => onNavigateToTab('daily-log')}
            className="px-4 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-indigo-200 hover:text-white rounded-xl text-xs font-medium transition"
          >
            Log Day
          </button>
        </div>
      </div>

      {/* Visual Aggregates - 6 Bento Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* Active Projects */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all"
        >
          <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/10 rounded-bl-3xl flex items-center justify-center border-l border-b border-white/5">
            <FolderGit className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">ACTIVE PROJS</span>
          <span className="block text-2xl font-display font-bold text-white mt-2">{activeProjectsCount}</span>
          <span className="text-[10px] text-gray-400 mt-1 block">In direct building.</span>
        </motion.div>

        {/* Shipped Projects */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all"
        >
          <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-3xl flex items-center justify-center border-l border-b border-white/5">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">SHIPPED PROJS</span>
          <span className="block text-2xl font-display font-bold text-white mt-2">{completedProjectsCount}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">100% completed</span>
        </motion.div>

        {/* Task completion rate */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all"
        >
          <div className="absolute top-0 right-0 h-10 w-10 bg-purple-500/10 rounded-bl-3xl flex items-center justify-center border-l border-b border-white/5">
            <Gauge className="h-4 w-4 text-purple-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">TASK COMP %</span>
          <span className="block text-2xl font-display font-bold text-white mt-2">{taskCompletionRate}%</span>
          <span className="text-[10px] text-gray-400 mt-1 block font-mono font-medium">F: {completedTasks.length}/{totalTasksCount}</span>
        </motion.div>

        {/* Total Backlog */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all"
        >
          <div className="absolute top-0 right-0 h-10 w-10 bg-yellow-500/10 rounded-bl-3xl flex items-center justify-center border-l border-b border-white/5">
            <ListTodo className="h-4 w-4 text-yellow-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">TOTAL BOARD</span>
          <span className="block text-2xl font-display font-bold text-white mt-2">{totalTasksCount}</span>
          <span className="text-[10px] text-gray-400 mt-1 block">Dynamic tickets.</span>
        </motion.div>

        {/* Direct Focus Project */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden col-span-2 group hover:border-white/20 transition-all"
        >
          <div className="absolute top-0 right-0 h-10 w-10 bg-blue-500/10 rounded-bl-3xl flex items-center justify-center border-l border-b border-white/5">
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">CURRENT DIRECT FOCUS</span>
          <span className="block text-sm font-display font-bold text-indigo-300 mt-2 truncate max-w-[85%]">{focusProject ? focusProject.name : 'Not Designated'}</span>
          <span className="text-[10px] text-gray-400 mt-1.5 block font-mono">P: {focusProject ? focusProject.progress : 0}%</span>
        </motion.div>

        {/* Total Freelance Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-5 bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-white/10 rounded-2xl col-span-2 lg:col-span-6 flex items-center justify-between hover:border-white/20 transition-all font-sans"
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-500/10 border border-white/5 rounded-xl text-emerald-400">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">REVENUE GENERATED</span>
              <span className="block text-xl font-display font-bold text-white mt-1">
                ${totalRevenue.toLocaleString()} <span className="text-xs text-emerald-400 font-mono font-normal">USD</span>
              </span>
            </div>
          </div>
          <button 
            onClick={() => onNavigateToTab('revenue')}
            className="text-[10px] font-mono font-bold px-3 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition"
          >
            Manage Invoices →
          </button>
        </motion.div>
      </div>

      {/* Main Section split: Today's Focus Widget vs Side Motivational logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* TODAY'S FOCUS WIDGET - 8 Columns */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-500/15 text-indigo-400 rounded-lg">
                  <Zap className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-semibold text-white">TODAY'S EXECUTION SPRINT</h3>
                  <p className="text-[10px] text-gray-500">Core parameters the founder must block out distraction to absolute-solve today.</p>
                </div>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono font-semibold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                Sprints
              </span>
            </div>

            {/* Content Form Block */}
            <div className="py-4 space-y-4">
              
              {/* Focus workspace row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-3.5 bg-white/[0.03] border border-white/5 rounded-xl">
                <div>
                  <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none font-medium">CORE WORKSPACE SPRINT</span>
                  {isEditingFocusProject ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <select
                        value={settings.mainFocusProjectId}
                        onChange={(e) => {
                          onUpdateFocusSetting({ mainFocusProjectId: e.target.value });
                          setIsEditingFocusProject(false);
                        }}
                        className="text-xs px-2.5 py-1 bg-[#121212] border border-white/10 text-white rounded focus:outline-none focus:border-indigo-500 transition"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => setIsEditingFocusProject(false)}
                        className="text-[10px] text-gray-400 hover:text-white underline font-mono"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="block text-xs font-display font-semibold text-indigo-300 mt-1 cursor-pointer hover:text-indigo-200 transition" onClick={() => setIsEditingFocusProject(true)}>
                      {focusProject ? focusProject.name : 'Assign Project Workspace'}
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={() => setIsEditingFocusProject(!isEditingFocusProject)}
                  className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-indigo-400 transition"
                  title="Edit focus project"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 leading-none font-medium">TOP 3 DEPLOYMENT OBJECTIVES</span>
                
                {focusTasksList.length === 0 ? (
                  <div className="p-6 bg-[#090909]/60 border border-dashed border-white/10 rounded-xl text-center">
                    <p className="text-gray-500 text-xs">No execution sprint tasks linked for this project today.</p>
                    <button 
                      onClick={() => onNavigateToTab('projects')}
                      className="mt-2 text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Assign Tasks in Backlog Board →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {focusTasksList.map((task) => {
                      const isCompleted = task.status === 'Done';
                      return (
                        <div 
                          key={task.id}
                          className={`
                            flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl transition
                            ${isCompleted ? 'border-white/10 opacity-60 bg-white/[0.01]' : 'hover:border-white/15'}
                          `}
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-3">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleToggleFocusTask(task)}
                              className="h-4 w-4 bg-black border border-white/20 rounded checked:bg-indigo-600 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <p className={`text-xs font-medium truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                {task.title}
                              </p>
                              <span className="text-[9px] font-mono text-gray-500">{task.priority} Priority • Due {task.dueDate}</span>
                            </div>
                          </div>
                          
                          <span className={`
                            text-[8px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase shrink-0
                            ${task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' : ''}
                            ${task.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : ''}
                            ${task.priority === 'Medium' ? 'bg-indigo-500/20 text-indigo-400' : ''}
                            ${task.priority === 'Low' ? 'bg-slate-500/20 text-slate-400' : ''}
                          `}>
                            {task.priority}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Today's Learning Goal */}
              <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
                <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none font-medium">DAILY SKILL / COGNITIVE SHIFT TARGET</span>
                
                {isEditingWeeklyGoal ? (
                  <div className="flex items-center space-x-2 mt-1.5">
                    <input
                      type="text"
                      value={settings.todayLearningGoal}
                      onChange={(e) => onUpdateFocusSetting({ todayLearningGoal: e.target.value })}
                      className="flex-grow text-xs px-2 font-mono bg-[#121212] border border-white/10 rounded py-1 text-white focus:outline-none focus:border-indigo-500 transition"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setIsEditingWeeklyGoal(false);
                      }}
                    />
                    <button 
                      onClick={() => setIsEditingWeeklyGoal(false)}
                      className="text-[10px] bg-white/10 px-2 py-1 hover:bg-white/20 text-indigo-400 rounded transition font-mono"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mt-1">
                    <p 
                      onClick={() => setIsEditingWeeklyGoal(true)}
                      className="text-xs font-mono text-emerald-400 font-semibold truncate max-w-[85%] cursor-pointer hover:text-emerald-300"
                    >
                      {settings.todayLearningGoal || 'Not designated today'}
                    </p>
                    <button 
                      onClick={() => setIsEditingWeeklyGoal(true)}
                      className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-emerald-400 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Sprint Completion Tracker */}
            <div className="pt-4 border-t border-white/5 flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-400">Motivational Sprint Progress</span>
                <span className="font-mono text-indigo-400 font-bold">{focusProgressPct}% completed ({doneFocusTasksCount}/{focusTasksList.length})</span>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${focusProgressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 italic mt-1 font-sans">
                <span>{quote}</span>
              </div>
            </div>

          </div>
        </div>

        {/* MOTIVATIONAL OVERVIEW RANDOMLY SEEDED - 4 Columns */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Metrics */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-400 shrink-0" />
              <h4 className="text-xs font-display font-bold text-white tracking-wide uppercase">Goals Target Matrix</h4>
            </div>

            <div className="space-y-3.5 my-3.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>Semester GPA target</span>
                  <span className="text-emerald-400 font-bold">3.92 / 4.0 GPA</span>
                </div>
                <div className="h-1 w-full bg-black rounded-full">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>Invoices payout target</span>
                  <span className="text-white font-bold">$1,800 / $3,000 USD</span>
                </div>
                <div className="h-1 w-full bg-black rounded-full">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>Books Reading track</span>
                  <span className="text-gray-400 font-bold">11 / 24 items</span>
                </div>
                <div className="h-1 w-full bg-black rounded-full">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigateToTab('goals')}
              className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-center text-gray-300 font-semibold rounded-xl transition"
            >
              Analyze Goal Backlog
            </button>
          </div>

          {/* Quick learning ring preview */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center space-x-2">
              <Bookmark className="h-5 w-5 text-purple-400 shrink-0" />
              <h4 className="text-xs font-display font-bold text-white tracking-wide uppercase">Highest study skills</h4>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 rounded-xl mt-3">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded-full">NEXT.JS</span>
                <p className="text-xs font-semibold text-white mt-1.5 truncate">Modern App Router</p>
                <span className="text-[10px] font-mono text-gray-400 mt-1 block">85 hrs completed study</span>
              </div>
              <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="transparent" />
                  <circle cx="28" cy="28" r="22" stroke="#818cf8" strokeWidth="4" fill="transparent" strokeDasharray={138.2} strokeDashoffset={138.2 - (138.2 * 70) / 100} />
                </svg>
                <div className="absolute text-[10px] font-mono font-bold text-white">70%</div>
              </div>
            </div>

            <button 
              onClick={() => onNavigateToTab('learning')}
              className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-center text-gray-300 font-semibold rounded-xl transition"
            >
              Access Study Tracks
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
