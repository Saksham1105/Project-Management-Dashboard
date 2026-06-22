import React, { useState } from 'react';
import { BookOpen, Calendar, HelpCircle, Trophy, BookOpenCheck, ChevronRight, Save, Trash2, Zap, AlertCircle } from 'lucide-react';
import { DailyLog } from '../types';

interface DailyLogViewProps {
  logs: DailyLog[];
  onSaveLog: (log: DailyLog) => void;
}

export default function DailyLogView({ logs, onSaveLog }: DailyLogViewProps) {
  
  // Form State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logCompleted, setLogCompleted] = useState('');
  const [logChallenges, setLogChallenges] = useState('');
  const [logWins, setLogWins] = useState('');
  const [logLessons, setLogLessons] = useState('');
  const [logRating, setLogRating] = useState<number>(4);

  // Active review modal or panel
  const [selectedLogId, setSelectedLogId] = useState<string | null>(logs[0]?.id || null);

  const selectedLog = logs.find(l => l.id === selectedLogId) || logs[0] || null;

  // Submit Journal Entry
  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
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
    setSelectedLogId(newLog.id);
    
    // Clear
    setLogCompleted('');
    setLogChallenges('');
    setLogWins('');
    setLogLessons('');
    setLogRating(4);
  };

  // Generate date grid for GitHub Contribution Heatmap
  // Let's generate the last 140 days (20 weeks, Sunday to Saturday) ending today (June 19, 2026 based on metadata)
  const generateHeatmapGrid = () => {
    const today = new Date('2026-06-19T12:00:00');
    const grid: { dateStr: string; log: DailyLog | undefined }[] = [];
    
    // Find how many days to go back to aligning with standard 20 weeks starting on Sunday
    const daysToGenerate = 140; // 20 weeks
    const startDate = new Date(today.getTime() - (daysToGenerate - 1) * 24 * 60 * 60 * 1000);

    for (let i = 0; i < daysToGenerate; i++) {
      const current = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const str = current.toISOString().split('T')[0];
      const match = logs.find(l => l.id === str);
      grid.push({
        dateStr: str,
        log: match
      });
    }
    return grid;
  };

  const heatmapGrid = generateHeatmapGrid();

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          Daily Founder Chronicle <BookOpen className="h-5.5 w-5.5 text-indigo-400" />
        </h2>
        <p className="text-xs text-gray-400">Chronicle operational accomplishments, lessons learned, and barriers overcome on a daily scale.</p>
      </div>

      {/* GitHub Style Heatmap panel */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-orange-505 animate-pulse" /> Daily Shipment Frequency
          </span>
          <div className="flex items-center space-x-1.5 text-[9px] font-mono text-gray-550">
            <span>Less</span>
            <div className="h-2.5 w-2.5 bg-[#0f172a] rounded-sm border border-white/5" />
            <div className="h-2.5 w-2.5 bg-indigo-950/45 rounded-sm border border-white/5" />
            <div className="h-2.5 w-2.5 bg-emerald-950/60 rounded-sm border border-white/5" />
            <div className="h-2.5 w-2.5 bg-emerald-800/80 rounded-sm border border-white/5" />
            <div className="h-2.5 w-2.5 bg-emerald-550 rounded-sm border border-white/5" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid itself */}
        <div className="overflow-x-auto pb-1">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[720px] max-w-full mx-auto justify-start">
            {heatmapGrid.map((item, index) => {
              const hasLog = !!item.log;
              const rating = item.log?.rating || 0;
              
              // Define heat map color levels
              let color = 'bg-[#0f172a] border-slate-900/70'; // default empty
              if (hasLog) {
                if (rating <= 2) color = 'bg-emerald-950/70 border-emerald-900/40';
                else if (rating === 3) color = 'bg-emerald-800/60 border-emerald-700/50';
                else if (rating === 4) color = 'bg-emerald-600 border-emerald-500/30';
                else color = 'bg-emerald-400 border-indigo-400/40 shadow-inner ring-1 ring-emerald-300/35';
              }

              const isSelected = selectedLogId === item.dateStr;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (hasLog) {
                      setSelectedLogId(item.dateStr);
                    }
                  }}
                  className={`
                    h-2.5 w-2.5 rounded-sm border cursor-pointer hover:scale-125 transition duration-150 relative group
                    ${color}
                    ${isSelected ? 'scale-125 ring-2 ring-indigo-500 border-indigo-400' : ''}
                  `}
                  title={`${item.dateStr}: ${hasLog ? 'Logged (Rating ' + rating + ')' : 'No entries logged'}`}
                >
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#121212] border border-white/10 text-white text-[9px] font-mono p-1 rounded whitespace-nowrap z-50 shadow-xl pointer-events-none">
                    {item.dateStr} {hasLog ? `• Rating: ${rating}/5` : '• Empty'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main split row: Journal logger Form vs Ledger logs selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
             {/* JOURNAL WRITER - 6 Columns */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmitJournal} className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden space-y-4">
            
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Write Journal Entry</span>
              <span className="text-[10px] text-gray-500 font-mono tracking-wider">Date config</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Date Node</label>
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Daily Focus Rating ({logRating}/5)</label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLogRating(num)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        num <= logRating 
                          ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white border border-indigo-400/20 shadow-md' 
                          : 'bg-[#121212] text-gray-500 border border-white/10 hover:text-white'
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
                placeholder="List completed tickets or codebase shippings..."
                value={logCompleted}
                onChange={(e) => setLogCompleted(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-550 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Challenges faced</label>
              <textarea
                rows={2}
                placeholder="Explain blocks or complex vector calculations debugged..."
                value={logChallenges}
                onChange={(e) => setLogChallenges(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none focus:border-indigo-550 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-455 font-bold tracking-wider mb-1.5">Wins</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 15 T/s inferrate!"
                  value={logWins}
                  onChange={(e) => setLogWins(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-455 font-bold tracking-wider mb-1.5">Lessons Learned</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Garbage collect tensors..."
                  value={logLessons}
                  onChange={(e) => setLogLessons(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white placeholder-gray-650 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition active:scale-95"
            >
              Ship Journal Chronicle
            </button>
          </form>
        </div>

        {/* REVEAL LOG HISTORY - 6 Columns */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header list selection */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col space-y-2.5 max-h-[220px] overflow-y-auto">
            <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">Archive Chronicles</span>
            
            <div className="space-y-1.5">
              {logs.map((item) => {
                const isSelected = selectedLogId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedLogId(item.id)}
                    className={`
                      w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition
                      ${isSelected 
                        ? 'bg-white/10 border-indigo-500 text-white shadow-md' 
                        : 'bg-white/5 border-white/[0.08] text-gray-300 hover:border-white/20 hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold tracking-wide truncate">{item.dateString}</span>
                        <span className="block text-[9px] text-gray-500 truncate mt-0.5">{item.completed}</span>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-mono font-bold bg-[#121212] border border-white/10 px-2 py-0.5 rounded text-indigo-400">
                      R: {item.rating}/5
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Log Visual Cards */}
          {selectedLog ? (
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 relative">
              <div className="flex border-b border-white/5 pb-2 flex-col">
                <span className="text-[10px] font-mono text-indigo-400 uppercase">Chronicle Review</span>
                <h3 className="text-sm font-display font-bold text-white mt-1">
                  Summary for {selectedLog.dateString}
                </h3>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none">Completed Tasks</span>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{selectedLog.completed}</p>
                </div>

                {selectedLog.challenges && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-slate-900/60">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-mono text-pink-400 uppercase tracking-widest leading-none">Challenges Encountered</span>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{selectedLog.challenges}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[9px] font-mono text-emerald-450 uppercase tracking-widest leading-none flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Significant Wins
                      </span>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{selectedLog.wins || 'Smooth delivery loop.'}</p>
                    </div>
                  </div>
                )}

                {selectedLog.lessons && (
                  <div className="pt-2.5 border-t border-slate-900/60 space-y-1">
                    <span className="block text-[9px] font-mono text-orange-400 uppercase tracking-widest">Architectural Insights</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed italic">{selectedLog.lessons}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 text-gray-500 font-mono text-xs">
              No chronicle select logged. Select dates in the graph matrix above.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
