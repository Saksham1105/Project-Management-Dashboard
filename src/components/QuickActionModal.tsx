import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, Heart } from 'lucide-react';
import { ProjectOSData, Project, Task, DailyLog, ProjectCategory, ProjectStatus, PriorityLevel, TaskStatus } from '../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'task' | 'project' | 'log';
  data: ProjectOSData;
  onSaveProject: (project: Project) => void;
  onSaveTask: (projectId: string, task: Task) => void;
  onSaveLog: (log: DailyLog) => void;
}

export default function QuickActionModal({ 
  isOpen, 
  onClose, 
  actionType, 
  data, 
  onSaveProject, 
  onSaveTask, 
  onSaveLog 
}: QuickActionModalProps) {
  
  // Project Form State
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectCategory>('AI/ML');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('Idea');
  const [projPriority, setProjPriority] = useState<PriorityLevel>('Medium');
  const [projStart, setProjStart] = useState('');
  const [projDeadline, setProjDeadline] = useState('');
  const [projTagsStr, setProjTagsStr] = useState('');
  const [projMilestones, setProjMilestones] = useState<string[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Task Form State
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('Todo');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('Medium');

  // Daily Log State
  const [logDate, setLogDate] = useState('');
  const [logCompleted, setLogCompleted] = useState('');
  const [logChallenges, setLogChallenges] = useState('');
  const [logWins, setLogWins] = useState('');
  const [logLessons, setLogLessons] = useState('');
  const [logRating, setLogRating] = useState(4);

  useEffect(() => {
    if (isOpen) {
      // Initialize dates & fallbacks
      const today = new Date().toISOString().split('T')[0];
      setProjStart(today);
      setProjDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      setTaskDue(today);
      if (data.projects.length > 0) {
        setSelectedProjectId(data.projects[0].id);
      } else {
        setSelectedProjectId('');
      }

      setLogDate(today);
    }
  }, [isOpen, data.projects]);

  const handleAddMilestone = () => {
    if (newMilestoneText.trim()) {
      setProjMilestones([...projMilestones, newMilestoneText.trim()]);
      setNewMilestoneText('');
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setProjMilestones(projMilestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (actionType === 'project') {
      if (!projName.trim()) return;
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: projName.trim(),
        description: projDesc.trim(),
        category: projCategory,
        status: projStatus,
        priority: projPriority,
        progress: 0,
        startDate: projStart,
        deadline: projDeadline,
        tags: projTagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0),
        milestones: projMilestones.map((name, i) => ({
          id: `ms-${Date.now()}-${i}`,
          name,
          completed: false
        })),
        tasks: []
      };
      
      // Calculate start progress if default Completed is selected
      if (projStatus === 'Completed') {
        newProj.milestones.forEach(m => m.completed = true);
        newProj.progress = 100;
      }
      
      onSaveProject(newProj);
      
      // Reset State
      setProjName('');
      setProjDesc('');
      setProjTagsStr('');
      setProjMilestones([]);

    } else if (actionType === 'task') {
      if (!taskTitle.trim() || !selectedProjectId) return;
      const newTask: Task = {
        id: `task-${Date.now()}`,
        projectId: selectedProjectId,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        dueDate: taskDue,
        status: taskStatus,
        priority: taskPriority
      };
      onSaveTask(selectedProjectId, newTask);
      
      // Reset State
      setTaskTitle('');
      setTaskDesc('');

    } else if (actionType === 'log') {
      if (!logCompleted.trim()) return;
      
      const formattedDate = new Date(logDate + 'T00:00:00');
      const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      const readableDate = formattedDate.toLocaleDateString('en-US', dateOptions);

      const newLog: DailyLog = {
        id: logDate,
        completed: logCompleted.trim(),
        challenges: logChallenges.trim(),
        wins: logWins.trim(),
        lessons: logLessons.trim(),
        rating: logRating,
        dateString: readableDate
      };
      onSaveLog(newLog);

      // Reset State
      setLogCompleted('');
      setLogChallenges('');
      setLogWins('');
      setLogLessons('');
      setLogRating(4);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="quick-action-modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] border border-[#1e293b]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 sticky top-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-indigo-500/25 text-indigo-300 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Create
            </span>
            <h2 className="text-sm font-display font-semibold text-white">
              {actionType === 'project' && 'Deploy New Workspace Project'}
              {actionType === 'task' && 'Allocate Dynamic Task'}
              {actionType === 'log' && 'Write Daily Productivity Log'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {/* ================= PROJECT FORM ================= */}
          {actionType === 'project' && (
            <>
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SignSense Multi-Agent"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the workspace goal and target output..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Category</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value as ProjectCategory)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="AI/ML">AI/ML</option>
                    <option value="Web Development">Web Development</option>
                    <option value="University">University</option>
                    <option value="Business">Business</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Status</label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value as ProjectStatus)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Planning">Planning</option>
                    <option value="Building">Building</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Priority</label>
                  <select
                    value={projPriority}
                    onChange={(e) => setProjPriority(e.target.value as PriorityLevel)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={projStart}
                    onChange={(e) => setProjStart(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={projDeadline}
                    onChange={(e) => setProjDeadline(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, LLM, WebAssembly"
                  value={projTagsStr}
                  onChange={(e) => setProjTagsStr(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Milestones dynamic creation */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Milestone System Roadmap</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add milestone objective..."
                    value={newMilestoneText}
                    onChange={(e) => setNewMilestoneText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMilestone();
                      }
                    }}
                    className="flex-grow text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddMilestone}
                    className="px-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl border border-slate-700 hover:text-white transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {projMilestones.length > 0 && (
                  <div className="mt-2.5 max-h-36 overflow-y-auto border border-slate-800/80 rounded-xl bg-slate-950/60 p-2 space-y-1.5">
                    {projMilestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-900/60 border border-slate-800/40 rounded-lg">
                        <span className="truncate text-gray-300 font-mono text-[11px]">{idx + 1}. {milestone}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMilestone(idx)}
                          className="text-gray-500 hover:text-rose-400 p-0.5 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= TASK FORM ================= */}
          {actionType === 'task' && (
            <>
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Workspace Target Project *</label>
                {data.projects.length === 0 ? (
                  <p className="text-rose-400 text-xs">No project workspaces exist. Please create a project workspace first!</p>
                ) : (
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    {data.projects.map(proj => (
                      <option key={proj.id} value={proj.id}>{proj.name} ({proj.category})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optimize matrix multiplication functions"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Description details</label>
                <textarea
                  rows={2}
                  placeholder="Identify what needs to be solved..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Status Column</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Priority Level</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= DAILY LOG FORM ================= */}
          {actionType === 'log' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Today's Focus Rating ({logRating}/5)</label>
                  <div className="flex items-center space-x-1.5 h-9">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setLogRating(num)}
                        className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                          num <= logRating 
                            ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white border border-indigo-400/20' 
                            : 'bg-slate-950 text-gray-500 border border-slate-800 hover:text-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">What was completed today? *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="List tasks finished or modules shipped..."
                  value={logCompleted}
                  onChange={(e) => setLogCompleted(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Challenges faced</label>
                <textarea
                  rows={2}
                  placeholder="Any performance traps or blocked tickets?"
                  value={logChallenges}
                  onChange={(e) => setLogChallenges(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Major Wins</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 15 T/s inference rate!"
                    value={logWins}
                    onChange={(e) => setLogWins(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Lessons Learned</label>
                  <textarea
                    rows={2}
                    placeholder="Any architecture insights derived?"
                    value={logLessons}
                    onChange={(e) => setLogLessons(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Action Controls */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3.5 sticky bottom-0 bg-[#0c1220] py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-xl text-xs transition border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionType === 'task' && data.projects.length === 0}
              className={`
                px-5 py-2 rounded-xl text-xs font-semibold text-white transition shadow-lg
                ${actionType === 'task' && data.projects.length === 0
                  ? 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-600 hover:opacity-90 active:scale-95 border border-indigo-400/20'
                }
              `}
            >
              Ship Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
