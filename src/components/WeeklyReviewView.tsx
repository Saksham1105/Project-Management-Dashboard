import React, { useState } from 'react';
import { CalendarRange, Plus, HelpCircle, Save, Trash2, Edit, CheckCircle, ShieldAlert, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { WeeklyReview } from '../types';

interface WeeklyReviewViewProps {
  reviews: WeeklyReview[];
  onSaveReview: (review: WeeklyReview) => void;
  onDeleteReview: (reviewId: string) => void;
}

export default function WeeklyReviewView({ reviews, onSaveReview, onDeleteReview }: WeeklyReviewViewProps) {
  
  // Form State
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [weekLabel, setWeekLabel] = useState('');
  const [completed, setCompleted] = useState('');
  const [blocked, setBlocked] = useState('');
  const [wins, setWins] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [focusNext, setFocusNext] = useState('');

  // Selected for review drawer details
  const [activeReviewId, setActiveReviewId] = useState<string | null>(reviews[0]?.id || null);

  const activeReview = reviews.find(r => r.id === activeReviewId) || reviews[0] || null;

  // Initialize defaults on form open
  const handleOpenForm = () => {
    // e.g. current week of June 19, 2026 is Week 25
    setWeekLabel('Week 25 (Jun 15 - Jun 21)');
    setIsAddingReview(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekLabel.trim() || !completed.trim()) return;

    const newId = `review-W${Date.now()}`;
    const newReview: WeeklyReview = {
      id: newId,
      weekLabel: weekLabel.trim(),
      completedThisWeek: completed.trim(),
      blockedTasks: blocked.trim(),
      biggestWins: wins.trim(),
      mistakesMade: mistakes.trim(),
      focusNextWeek: focusNext.trim(),
      dateCreated: new Date().toISOString().split('T')[0]
    };

    onSaveReview(newReview);
    setActiveReviewId(newId);
    
    // Clear
    setWeekLabel('');
    setCompleted('');
    setBlocked('');
    setWins('');
    setMistakes('');
    setFocusNext('');
    setIsAddingReview(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            Weekly Sprites & Retrospectives <CalendarRange className="h-5.5 w-5.5 text-indigo-400" />
          </h2>
          <p className="text-xs text-gray-400">Perform periodic systems reviews to debug startup blocks, errors made, and next sprint priorities.</p>
        </div>

        <button
          onClick={handleOpenForm}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <Plus className="h-4.5 w-4.5" /> Write Reflection Audit
        </button>
      </div>

      {/* Retro Form Panel Overlay */}
      {isAddingReview && (
        <form onSubmit={handleSubmitReview} className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Input Weekly Review Checklist</span>
            <button 
              type="button" 
              onClick={() => setIsAddingReview(false)}
              className="text-[10px] text-gray-400 hover:text-white underline font-mono"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Week Descriptor Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. Week 25 (Jun 15 - Jun 21)"
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex items-end justify-end">
              <span className="text-[10px] text-gray-500 font-mono italic pr-2">Fill in all text blocks below</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Completed This Week *</label>
              <textarea
                required
                rows={3}
                placeholder="List code repositories created, designs completed..."
                value={completed}
                onChange={(e) => setCompleted(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-655 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Blocked Tasks & Key Issues</label>
              <textarea
                rows={3}
                placeholder="Any external developer dependencies, client stalls..."
                value={blocked}
                onChange={(e) => setBlocked(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-655 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5 font-bold">Highest Win achieved</label>
              <textarea
                rows={3}
                placeholder="List major positive financial or system achievements..."
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-655 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5 text-pink-400">Mistakes & Errors Made</label>
              <textarea
                rows={3}
                placeholder="Identify where code performance or study time fell off..."
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-655 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#3afdcf] font-bold tracking-wider mb-1.5">Action Focus Next Week</label>
              <textarea
                rows={3}
                placeholder="Pinpoint critical tasks to absolute-solve next week..."
                value={focusNext}
                onChange={(e) => setFocusNext(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-655 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-semibold shadow transition active:scale-95"
          >
            Register Retrospective logs
          </button>
        </form>
      )}

      {/* Two Columns Grid: Left list, Right detailed display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: HISTORY SELECTION INDEX - 5 Columns */}
        <div className="lg:col-span-4 space-y-3">
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest pl-1 font-bold">Retrospective Archives</span>
          
          {reviews.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-gray-550 font-mono text-[11px]">
              No retrospective reviews logged yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto w-full">
              {reviews.map((item) => {
                const isSelected = activeReviewId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveReviewId(item.id)}
                    className={`
                      w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition
                      ${isSelected 
                        ? 'bg-white/10 border-indigo-500 text-white shadow-md' 
                        : 'bg-white/5 border-white/[0.08] text-gray-300 hover:border-white/20 hover:bg-white/10'}
                    `}
                  >
                    <div className="min-w-0 pr-3">
                      <span className="block text-xs font-semibold leading-none truncate">{item.weekLabel}</span>
                      <span className="block text-[9px] text-gray-500 mt-1 truncate">Created {item.dateCreated}</span>
                    </div>
                    <ChevronRight className="h-4.5 w-4.5 text-gray-550 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REVIEWS CHRONICLES - 8 Columns */}
        <div className="lg:col-span-8">
          {activeReview ? (
            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5 relative">
              <div className="flex border-b border-white/5 pb-3 flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wide">SYSTEMS ANALYSIS RETRO</span>
                  <h3 className="text-sm font-display font-bold text-white mt-0.5">
                    Reflections for {activeReview.weekLabel}
                  </h3>
                </div>
                
                <button
                  onClick={() => {
                    if (confirm(`Purge weekly review record for ${activeReview.weekLabel}?`)) {
                      onDeleteReview(activeReview.id);
                    }
                  }}
                  className="p-1 px-3 bg-rose-950/40 text-rose-450 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 text-[10px] font-mono font-bold transition flex items-center gap-1 shrink-0"
                >
                  <Trash2 className="h-3 w-3" /> Delete Logs
                </button>
              </div>

              {/* Detailed Grid blocks */}
              <div className="space-y-4">
                
                <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-mono text-gray-450 uppercase font-bold tracking-wider leading-none flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Completed Milestones and Shipped Code
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed font-sans">{activeReview.completedThisWeek}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-xl space-y-1.5">
                    <span className="text-[9px] font-mono text-pink-400 uppercase font-bold tracking-wider leading-none flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-pink-400" /> Blocked Tasks and Bottlenecks
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeReview.blockedTasks || 'Zero blocks encountered.'}</p>
                  </div>

                  <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-xl space-y-1.5">
                    <span className="text-[9px] font-mono text-emerald-450 uppercase font-bold tracking-wider leading-none flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Major Strategic Wins
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeReview.biggestWins || 'Milestone achieved.'}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-mono text-pink-450 uppercase font-bold tracking-wider leading-none">Mistakes Made and Process Failures</span>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeReview.mistakesMade || 'Clean week operational flow.'}</p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-[#0c1325] to-white/[0.02] border border-[#3afdcf]/15 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-mono text-[#3afdcf] uppercase font-bold tracking-wider leading-none flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-[#3afdcf]" /> Critical Focus Objectives for Next Week
                  </span>
                  <p className="text-xs text-gray-100 font-sans leading-relaxed">{activeReview.focusNextWeek}</p>
                </div>

              </div>
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-gray-550 font-mono text-xs">
              No retrospective select logged. Select reviews in the indices sidebar list.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
