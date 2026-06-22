import React, { useState } from 'react';
import { Target, Trophy, Award, Sparkles, Plus, Trash2, Edit3, Calendar, Flame, CheckCircle } from 'lucide-react';
import { Goal, GoalCategory } from '../types';

interface GoalsViewProps {
  goals: Goal[];
  onSaveGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function GoalsView({ goals, onSaveGoal, onDeleteGoal }: GoalsViewProps) {
  
  // New Goal Form State
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('Career');
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalCurrent, setGoalCurrent] = useState(0);
  const [goalUnit, setGoalUnit] = useState('Completed');
  const [goalDeadline, setGoalDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [goalNotes, setGoalNotes] = useState('');

  // Filtering category selection
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<'All' | GoalCategory>('All');

  // Submit Goal
  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalTitle.trim(),
      category: goalCategory,
      targetValue: Number(goalTarget),
      currentValue: Number(goalCurrent),
      unit: goalUnit.trim() || 'Completed',
      deadline: goalDeadline,
      notes: goalNotes.trim()
    };

    onSaveGoal(newGoal);
    setGoalTitle('');
    setGoalNotes('');
    setGoalCurrent(0);
    setGoalTarget(10);
    setIsAddingGoal(false);
  };

  const handleUpdateCurrentValue = (goal: Goal, incremental: number) => {
    const newVal = Math.max(0, goal.currentValue + incremental);
    const updated = {
      ...goal,
      currentValue: Number(newVal.toFixed(2)) // avoid floating point issues
    };
    onSaveGoal(updated);
  };

  const handleSetCurrentValue = (goal: Goal, rawValue: string) => {
    const val = parseFloat(rawValue);
    if (!isNaN(val)) {
      onSaveGoal({
        ...goal,
        currentValue: val
      });
    }
  };

  // Group goals by category
  const categories: GoalCategory[] = ['Academic', 'Career', 'Personal'];
  
  const filteredGoals = goals.filter(g => activeSegmentFilter === 'All' || g.category === activeSegmentFilter);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            Target Milestones matrix <Target className="h-5.5 w-5.5 text-indigo-400" />
          </h2>
          <p className="text-xs text-gray-400">Establish quantifiable, long-term indicators scaling career, university, and fitness tracks.</p>
        </div>

        <button
          onClick={() => setIsAddingGoal(!isAddingGoal)}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <Plus className="h-4.5 w-4.5" /> Initialize Target
        </button>
      </div>

      {/* Initialize Goal Panel Overlay */}
      {isAddingGoal && (
        <form onSubmit={handleSubmitGoal} className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-805">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Deploy Objective Metric</span>
            <button 
              type="button" 
              onClick={() => setIsAddingGoal(false)}
              className="text-[10px] text-gray-400 hover:text-white underline font-mono"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Goal Objective *</label>
              <input
                type="text"
                required
                placeholder="e.g. Build 10 high-conversion corporate landing pages"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Category</label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value as GoalCategory)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Academic">Academic</option>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Deadline</label>
              <input
                type="date"
                required
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Starting Position</label>
              <input
                type="number"
                step="any"
                value={goalCurrent}
                onChange={(e) => setGoalCurrent(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Target Value *</label>
              <input
                type="number"
                required
                step="any"
                value={goalTarget}
                onChange={(e) => setGoalTarget(parseFloat(e.target.value) || 1)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Core Unit</label>
              <input
                type="text"
                placeholder="e.g. Sites, Books, GPA, USD"
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Ship Target Metric
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Notes & Reminders</label>
            <input
              type="text"
              placeholder="e.g. Keep doing two modules daily before breakfast."
              value={goalNotes}
              onChange={(e) => setGoalNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none"
            />
          </div>
        </form>
      )}

      {/* Category Selection Filter tabs */}
      <div className="flex border-b border-white/5 pb-1 gap-1">
        {(['All', 'Academic', 'Career', 'Personal'] as const).map((filter) => {
          const isActive = activeSegmentFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveSegmentFilter(filter)}
              className={`
                px-4 py-1.5 text-xs font-medium font-mono rounded-t-xl transition
                ${isActive 
                  ? 'bg-white/5 border-t border-x border-white/10 text-indigo-400 font-semibold' 
                  : 'text-gray-400 hover:text-white'}
              `}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {filteredGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) || 0;
          const isFinished = goal.currentValue >= goal.targetValue;

          return (
            <div 
              key={goal.id}
              className={`
                p-5 bg-white/5 border rounded-2xl relative overflow-hidden flex flex-col justify-between h-56 transition-all duration-200 hover:bg-white/10
                ${isFinished ? 'border-emerald-500/15' : 'border-white/10'}
              `}
            >
              <div className="space-y-2.5">
                
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <span className={`
                    text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                    ${goal.category === 'Academic' ? 'bg-blue-500/15 text-blue-400' : ''}
                    ${goal.category === 'Career' ? 'bg-indigo-500/15 text-indigo-400' : ''}
                    ${goal.category === 'Personal' ? 'bg-orange-500/15 text-orange-450' : ''}
                  `}>
                    {goal.category}
                  </span>

                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 text-gray-600 hover:text-rose-400 transition"
                    title="Purge objective"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-xs font-display font-semibold text-white tracking-wide truncate pr-2" title={goal.title}>
                  {goal.title}
                </h3>

                {/* Notes */}
                {goal.notes && (
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                    {goal.notes}
                  </p>
                )}
              </div>

              {/* Progress and controls */}
              <div className="pt-3 border-t border-slate-800/50 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    Due {goal.deadline}
                  </span>
                  <span className="font-bold text-white">
                    {goal.currentValue} / {goal.targetValue} <span className="text-[10px] text-gray-450 font-normal">{goal.unit}</span>
                  </span>
                </div>

                {/* Meter bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isFinished ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-gray-500">
                    <span>Performance index</span>
                    <span>{pct}% met</span>
                  </div>
                </div>

                {/* Dynamic Inline increment tool handles */}
                <div className="flex items-center space-x-1 justify-between bg-slate-950/40 p-1 rounded-xl border border-slate-850">
                  <span className="text-[9px] font-mono text-gray-500 pl-1.5">Adjustment</span>
                  
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      step="any"
                      placeholder="set"
                      value={goal.currentValue}
                      onChange={(e) => handleSetCurrentValue(goal, e.target.value)}
                      className="w-14 text-center bg-slate-900 text-[10px] font-bold text-indigo-400 border border-slate-800 shrink-0 font-mono py-0.5 rounded focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdateCurrentValue(goal, -1)}
                      className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-gray-400 hover:text-white rounded text-[10px] font-mono hover:scale-105 active:scale-95 transition"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleUpdateCurrentValue(goal, 1)}
                      className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[#38bdf8] hover:text-white rounded text-[10px] font-mono hover:scale-105 active:scale-95 transition"
                    >
                      +1
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
