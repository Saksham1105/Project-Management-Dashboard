import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  ChevronRight, 
  Calendar, 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  SlidersHorizontal,
  ChevronRightSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Project, Milestone, Task, ProjectCategory, ProjectStatus, PriorityLevel, TaskStatus } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onSaveProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (projectId: string, task: Task) => void;
}

export default function ProjectsView({ 
  projects, 
  onSaveProject, 
  onUpdateProject, 
  onDeleteProject, 
  onAddTask 
}: ProjectsViewProps) {
  
  // Search & Filtering States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Selected Project for details drawer / workroom
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id || null);
  const [workroomTab, setWorkroomTab] = useState<'tasks' | 'milestones' | 'config'>('tasks');

  // Modal / Quick edit states
  const [isEditingProjDetails, setIsEditingProjDetails] = useState(false);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityLevel>('Medium');
  const [newTaskDue, setNewTaskDue] = useState(new Date().toISOString().split('T')[0]);

  // Selected Project object
  const activeProj = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Filter projects list for visual grid
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeProj) return;
    const updatedMilestones = activeProj.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    // Progress is direct % of completed milestones
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : activeProj.progress;

    const updatedProj: Project = {
      ...activeProj,
      milestones: updatedMilestones,
      progress
    };
    onUpdateProject(updatedProj);
  };

  // Add new milestone inline
  const handleAddMilestoneInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProj || !newMilestoneInput.trim()) return;

    const newMilestone: Milestone = {
      id: `ms-${Date.now()}`,
      name: newMilestoneInput.trim(),
      completed: false
    };

    const updatedMilestones = [...activeProj.milestones, newMilestone];
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    const updatedProj: Project = {
      ...activeProj,
      milestones: updatedMilestones,
      progress
    };
    onUpdateProject(updatedProj);
    setNewMilestoneInput('');
  };

  const handleRemoveMilestoneInline = (milestoneId: string) => {
    if (!activeProj) return;
    const updatedMilestones = activeProj.milestones.filter(m => m.id !== milestoneId);
    
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : 0;

    const updatedProj: Project = {
      ...activeProj,
      milestones: updatedMilestones,
      progress
    };
    onUpdateProject(updatedProj);
  };

  // Add task inside active workspace
  const handleAddTaskInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProj || !newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId: activeProj.id,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      dueDate: newTaskDue,
      status: 'Todo',
      priority: newTaskPriority
    };

    onAddTask(activeProj.id, newTask);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('Medium');
  };

  // Task Status updates (KanBan Boards Drop control / Button override)
  const handleMoveTaskStatus = (taskId: string, targetStatus: TaskStatus) => {
    if (!activeProj) return;
    const updatedTasks = activeProj.tasks.map(t => 
      t.id === taskId ? { ...t, status: targetStatus } : t
    );
    const updatedProj: Project = {
      ...activeProj,
      tasks: updatedTasks
    };
    onUpdateProject(updatedProj);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!activeProj) return;
    const updatedTasks = activeProj.tasks.filter(t => t.id !== taskId);
    const updatedProj: Project = {
      ...activeProj,
      tasks: updatedTasks
    };
    onUpdateProject(updatedProj);
  };

  // HTML5 Drag & Drop features
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCol: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      handleMoveTaskStatus(taskId, targetCol);
    }
  };

  // Update Project Info
  const handleSaveProjectDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProj) return;
    onUpdateProject(activeProj);
    setIsEditingProjDetails(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">Project Hub</h2>
          <p className="text-xs text-gray-400">Assemble code bases, allocate sprints, and track milestones of active startups.</p>
        </div>

        {/* Filters Panel Row */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 min-w-[200px] flex items-center space-x-2 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter workspace by keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-gray-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 shrink-0 md:w-[420px]">
            {/* Category Dropdown */}
            <div className="space-y-0.5">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-[11px] px-2.5 py-2 bg-[#121212] border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-indigo-500 font-medium transition"
              >
                <option value="All">All Categories</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Web Development">Web Development</option>
                <option value="University">University</option>
                <option value="Business">Business</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-0.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-[11px] px-2.5 py-2 bg-[#121212] border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-indigo-500 font-medium transition"
              >
                <option value="All">All Statuses</option>
                <option value="Idea">Idea</option>
                <option value="Planning">Planning</option>
                <option value="Building">Building</option>
                <option value="Testing">Testing</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Priority Selection */}
            <div className="space-y-0.5">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full text-[11px] px-2.5 py-2 bg-[#121212] border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-indigo-500 font-medium transition"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Column workspace Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: FILTERED WEB PROJECTS LIST - 5 columns */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">{filteredProjects.length} matching setups</span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
              <p className="text-gray-500 text-xs">No project workspaces match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const isActive = activeProj?.id === project.id;
                const completedMilestones = project.milestones.filter(m => m.completed).length;
                const totalMilestones = project.milestones.length;

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      setActiveProjectId(project.id);
                      setWorkroomTab('tasks');
                    }}
                    className={`
                      p-4 rounded-xl text-left border cursor-pointer transition relative overflow-hidden group
                      ${isActive 
                        ? 'bg-white/10 border-indigo-500 shadow-lg' 
                        : 'bg-white/5 border-white/[0.08] hover:bg-white/10 hover:border-white/20'}
                    `}
                  >
                    {/* Category Label */}
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-slate-800/80 text-gray-300 font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className={`
                        text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase
                        ${project.priority === 'Critical' ? 'bg-rose-500/15 text-rose-400' : ''}
                        ${project.priority === 'High' ? 'bg-orange-500/15 text-orange-400' : ''}
                        ${project.priority === 'Medium' ? 'bg-indigo-500/15 text-indigo-400' : ''}
                        ${project.priority === 'Low' ? 'bg-slate-500/15 text-gray-400' : ''}
                      `}>
                        {project.priority}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <h3 className="text-xs font-display font-semibold text-white tracking-wide">{project.name}</h3>
                      <ChevronRight className={`h-4.5 w-4.5 text-gray-500 transition-transform ${isActive ? 'translate-x-1 text-indigo-400' : ''}`} />
                    </div>

                    {/* Description excerpt */}
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Progress details */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                        <span>Status: {project.status}</span>
                        <span>Progress: {project.progress}%</span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer indicators */}
                    <div className="mt-3.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[9px] font-mono text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {project.deadline}
                      </span>
                      <span>
                        Milestones: {completedMilestones}/{totalMilestones}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DIRECT ACTIVE WORKSPACE ROOM DETAILED PANELS - 7 columns */}
        <div className="lg:col-span-7">
          {activeProj ? (
            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden space-y-5">
              
              {/* Internal header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {activeProj.category}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-gray-400 font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {activeProj.status}
                    </span>
                  </div>
                  <h1 className="text-sm font-display font-bold text-white mt-2 flex items-center gap-2">
                    {activeProj.name} Workspace
                  </h1>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-sm">{activeProj.description}</p>
                </div>

                {/* Tab switch */}
                <div className="flex bg-[#121212] border border-white/10 p-1.5 rounded-xl self-start">
                  <button
                    onClick={() => setWorkroomTab('tasks')}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition ${workroomTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setWorkroomTab('milestones')}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition ${workroomTab === 'milestones' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Milestones ({activeProj.milestones.length})
                  </button>
                  <button
                    onClick={() => setWorkroomTab('config')}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition ${workroomTab === 'config' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Config
                  </button>
                </div>
              </div>

              {/* ===================== TASKS PANEL (KANBAN BOARD) ===================== */}
              {workroomTab === 'tasks' && (
                <div className="space-y-4">
                  {/* Quick ADD Task mini-form */}
                  <form onSubmit={handleAddTaskInline} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">Add Task to Backlog</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Task objective..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="flex-grow text-xs px-2.5 py-1.5 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      />
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as PriorityLevel)}
                        className="text-[10px] bg-[#121212] border border-white/10 text-gray-300 px-2 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                      <button 
                        type="submit" 
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  {/* KANBAN COLS WRAPPER (4 Columns Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                    
                    {(['Todo', 'In Progress', 'Review', 'Done'] as TaskStatus[]).map((col) => {
                      const colTasks = activeProj.tasks.filter(t => t.status === col);
                      return (
                        <div 
                          key={col}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, col)}
                          className="bg-white/[0.02] p-2.5 border border-white/5 rounded-xl min-h-[300px] flex flex-col space-y-2 relative"
                        >
                          <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5 px-0.5">
                            <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase tracking-wide">
                              {col}
                            </span>
                            <span className="text-[9px] font-mono text-gray-500 bg-slate-900 px-1.5 py-0.5 rounded">
                              {colTasks.length}
                            </span>
                          </div>

                          <div className="flex-grow overflow-y-auto space-y-2 max-h-[350px] scrollbar-thin">
                            {colTasks.map((task) => (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg hover:border-slate-700 active:scale-95 cursor-grab transition space-y-2 relative group"
                              >
                                <p className="text-[11px] font-medium text-white leading-tight break-words">{task.title}</p>
                                
                                <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 pt-1 border-t border-slate-800/40">
                                  <span>{task.priority}</span>
                                  
                                  {/* Delete inline button */}
                                  <button 
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-0.5 hover:text-rose-400 text-gray-600 transition"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </button>
                                </div>

                                {/* Quick inline transfer buttons for tablet or no-mouse users */}
                                <div className="hidden group-hover:flex items-center justify-end space-x-1 pt-1 border-t border-slate-800/40">
                                  {col !== 'Todo' && (
                                    <button 
                                      onClick={() => {
                                        const steps: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];
                                        const prev = steps[steps.indexOf(col) - 1];
                                        handleMoveTaskStatus(task.id, prev);
                                      }}
                                      className="p-1 hover:text-indigo-400 text-gray-600 transition"
                                      title="Move Left"
                                    >
                                      <ArrowLeft className="h-2 w-2" />
                                    </button>
                                  )}
                                  {col !== 'Done' && (
                                    <button 
                                      onClick={() => {
                                        const steps: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];
                                        const next = steps[steps.indexOf(col) + 1];
                                        handleMoveTaskStatus(task.id, next);
                                      }}
                                      className="p-1 hover:text-indigo-400 text-gray-600 transition"
                                      title="Move Right"
                                    >
                                      <ArrowRight className="h-2 w-2" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })}

                  </div>
                </div>
              )}

              {/* ===================== MILESTONES SYSTEM ROADMAP ===================== */}
              {workroomTab === 'milestones' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">Milestones Roadmap Completion</span>
                    <span className="text-xs font-mono text-indigo-400 font-bold">{activeProj.progress}% Completed</span>
                  </div>

                  {/* Add Milestone inline */}
                  <form onSubmit={handleAddMilestoneInline} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Specify dynamic milestone goal..."
                      value={newMilestoneInput}
                      onChange={(e) => setNewMilestoneInput(e.target.value)}
                      className="flex-grow text-xs px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button 
                      type="submit" 
                      className="px-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl border border-slate-700 hover:text-white transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>

                  {/* Milestones list checkboxes */}
                  {activeProj.milestones.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl">
                      <p className="text-gray-500 text-xs text-mono">No milestone objectives currently mapped to this structure.</p>
                    </div>
                  ) : (
                    <div className="border border-slate-800/80 rounded-xl bg-slate-950/45 p-3.5 space-y-2.5">
                      {activeProj.milestones.map((milestone) => (
                        <div 
                          key={milestone.id}
                          className="flex items-center justify-between text-xs py-2 px-3 bg-slate-900/40 border border-slate-850 rounded-lg hover:border-slate-800 transition"
                        >
                          <div className="flex items-center space-x-3 pr-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={milestone.completed}
                              onChange={() => handleToggleMilestone(milestone.id)}
                              className="h-4.5 w-4.5 bg-slate-950 border border-slate-800 rounded checked:bg-indigo-600 focus:ring-offset-0 focus:ring-0 cursor-pointer text-indigo-600 shrink-0"
                            />
                            <span className={`truncate font-mono text-[11px] font-medium leading-none ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                              {milestone.name}
                            </span>
                          </div>

                          <button 
                            type="button" 
                            onClick={() => handleRemoveMilestoneInline(milestone.id)}
                            className="text-gray-600 hover:text-rose-400 p-0.5 transition shrink-0"
                          >
                            <Trash2 className="h-3. w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===================== CONFIG DETAILS AND ACTIONS ===================== */}
              {workroomTab === 'config' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-4">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">Configure Project Parameters</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Project Name</label>
                        <input
                          type="text"
                          value={activeProj.name}
                          onChange={(e) => onUpdateProject({ ...activeProj, name: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Project Category</label>
                        <select
                          value={activeProj.category}
                          onChange={(e) => onUpdateProject({ ...activeProj, category: e.target.value as ProjectCategory })}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                        >
                          <option value="AI/ML">AI/ML</option>
                          <option value="Web Development">Web Development</option>
                          <option value="University">University</option>
                          <option value="Business">Business</option>
                          <option value="Content Creation">Content Creation</option>
                          <option value="Personal">Personal</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Priority</label>
                        <select
                          value={activeProj.priority}
                          onChange={(e) => onUpdateProject({ ...activeProj, priority: e.target.value as PriorityLevel })}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Status</label>
                        <select
                          value={activeProj.status}
                          onChange={(e) => onUpdateProject({ ...activeProj, status: e.target.value as ProjectStatus })}
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
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

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Tags (Comma separated list)</label>
                      <input
                        type="text"
                        value={activeProj.tags.join(', ')}
                        onChange={(e) => {
                          const updatedTags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                          onUpdateProject({ ...activeProj, tags: updatedTags });
                        }}
                        className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-mono">DANGEROUS AREA: DEPLOYMENT SHUTDOWN</span>
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Shutdown and purge all records of ${activeProj.name}?`)) {
                            onDeleteProject(activeProj.id);
                          }
                        }}
                        className="px-4 py-1.5 bg-rose-950/40 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/25 text-xs rounded-xl transition font-semibold flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Close Workspace
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
              <p className="text-gray-500 text-sm">Please select a workspace card to access its details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
