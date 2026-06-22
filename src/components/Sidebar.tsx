import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Target, 
  GraduationCap, 
  DollarSign, 
  BookOpen, 
  CalendarRange, 
  TrendingUp, 
  Settings, 
  Terminal,
  Menu,
  X,
  Search
} from 'lucide-react';
import { ProjectOSData } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  data: ProjectOSData;
  onOpenCommandPalette: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, data, onOpenCommandPalette }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const settings = data.settings;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase, badge: data.projects.filter(p => p.status === 'Building').length || undefined },
    { id: 'goals', label: 'Goals', icon: Target, badge: data.goals.length || undefined },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'daily-log', label: 'Daily Log', icon: BookOpen },
    { id: 'weekly', label: 'Weekly Reviews', icon: CalendarRange },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0f1d] border-b border-gray-800 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-white tracking-tight">ProjectOS</span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenCommandPalette}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 transition"
            title="Search command (Ctrl+K)"
          >
            <Search className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-300 transition"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 md:sticky md:top-0 h-screen w-64 
        flex flex-col border-r border-white/5 bg-[#090909] backdrop-blur-xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header Block */}
        <div className="p-6 flex items-center space-x-3 border-b border-white/5">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-inner select-none flex items-center justify-center">
            <span className="font-bold text-white text-lg leading-none">P</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white leading-tight tracking-tight">ProjectOS</h1>
            <span className="text-[10px] text-indigo-400 font-mono tracking-wider">FOUNDER ED.</span>
          </div>
        </div>

        {/* Command Search Shortcut Button */}
        <div className="px-4 py-3 border-b border-white/5">
          <button 
            onClick={() => {
              onOpenCommandPalette();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-left text-xs text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition duration-150 group"
          >
            <div className="flex items-center space-x-2">
              <Search className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-400 transition" />
              <span>Search commands...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center space-x-0.5 px-1.5 py-0.5 bg-white/10 border border-white/10 text-[10px] rounded text-gray-500 font-mono">
              <span>⌘</span><span>K</span>
            </kbd>
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-white/5 text-white border border-white/10 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`
                    text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md
                    ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/10 text-gray-400'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pro Status Box & User Card */}
        <div className="p-4 space-y-4 border-t border-white/5 bg-[#070707]/60">
          <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Pro Status</p>
            <p className="text-xs font-semibold text-white">Personal Command Deck</p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-display font-medium text-white shadow-md border border-indigo-400/20">
              {settings.userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-bold text-white truncate">{settings.userName}</h2>
              <p className="text-[10px] text-gray-400 truncate tracking-wide">{settings.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
