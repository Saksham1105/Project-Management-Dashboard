import React, { useEffect, useState, useRef } from 'react';
import { Search, Terminal, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onQuickAction: (actionType: 'task' | 'project' | 'log') => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate, onQuickAction }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = [
    { id: 'go-dashboard', title: 'Go to Dashboard', type: 'nav', value: 'dashboard', subtitle: 'View main widgets and focus summary' },
    { id: 'go-projects', title: 'Go to Projects', type: 'nav', value: 'projects', subtitle: 'Manage builds, status, backlog & milestones' },
    { id: 'go-goals', title: 'Go to Goals', type: 'nav', value: 'goals', subtitle: 'Track academics, career and personal habits' },
    { id: 'go-learning', title: 'Go to Learning Tracker', type: 'nav', value: 'learning', subtitle: 'Study logs and progress rings' },
    { id: 'go-revenue', title: 'Go to Revenue Tracker', type: 'nav', value: 'revenue', subtitle: 'Monitor client invoices, leads and earnings' },
    { id: 'go-daily-log', title: 'Go to Daily Log', type: 'nav', value: 'daily-log', subtitle: 'Log a journal entry and view github heatmap' },
    { id: 'go-weekly', title: 'Go to Weekly Reviews', type: 'nav', value: 'weekly', subtitle: 'Reflect on wins, blocks and next week goals' },
    { id: 'go-analytics', title: 'Go to Analytics Charts', type: 'nav', value: 'analytics', subtitle: 'Interact with visual reports' },
    { id: 'go-settings', title: 'Go to Settings', type: 'nav', value: 'settings', subtitle: 'Export backup, reset dashboard, custom profile' },
    { id: 'act-task', title: 'Create New Task', type: 'action', value: 'task', subtitle: 'Quick insert task into selected project backlog' },
    { id: 'act-project', title: 'Create New Project', type: 'action', value: 'project', subtitle: 'Deploy virtual workspace for new build idea' },
    { id: 'act-log', title: 'Log Today’s Progress', type: 'action', value: 'log', subtitle: 'Save instant journal logs about todays wins' }
  ];

  // Filtering items
  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Listen for global Ctrl/Cmd + K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (item: typeof items[0]) => {
    if (item.type === 'nav') {
      onNavigate(item.value);
    } else if (item.type === 'action') {
      onQuickAction(item.value as 'task' | 'project' | 'log');
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="command-palette-container" className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ scale: 0.96, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -10, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-xl glass-panel-heavy rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[50vh] border border-[#38bdf8]/20"
          >
            {/* Header Input */}
            <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-slate-800 bg-slate-900/40">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or lookup action..."
                className="w-full bg-transparent border-none text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-0"
              />
              <span className="text-[10px] bg-slate-800 text-gray-400 border border-slate-700 px-1.5 py-0.5 rounded font-mono select-none">ESC</span>
            </div>

            {/* Results */}
            <div className="flex-grow overflow-y-auto p-2 space-y-0.5">
              {filtered.length > 0 ? (
                filtered.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        w-full flex items-center justify-between text-left p-3 rounded-xl transition-all duration-100
                        ${isSelected 
                          ? 'bg-indigo-600/20 border-l-2 border-indigo-400 text-white' 
                          : 'text-gray-300 hover:bg-slate-900/30 hover:text-white border-l-2 border-transparent'}
                      `}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-800/60 text-gray-400'}`}>
                          {item.type === 'nav' ? (
                            <Terminal className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs truncate">{item.title}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-200/75' : 'text-gray-500'}`}>{item.subtitle}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center space-x-1.5 text-indigo-400 font-mono text-[10px]">
                          <span>Execute</span>
                          <CornerDownLeft className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center">
                  <Terminal className="h-8 w-8 text-slate-700 mx-auto mb-2 animate-bounce" />
                  <p className="text-gray-400 font-medium text-xs">No matching commands found</p>
                  <p className="text-gray-600 text-[10px]">Try typing a different keyword</p>
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <div className="flex items-center space-x-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Ctrl + K opens panel</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
