import React, { useRef, useState } from 'react';
import { Settings, Save, Download, Upload, RotateCcw, User, BellRing, Sparkles } from 'lucide-react';
import { ProjectOSData } from '../types';

interface SettingsViewProps {
  data: ProjectOSData;
  onUpdateSettings: (settings: ProjectOSData['settings']) => void;
  onImportData: (rawJson: string) => void;
  onResetData: () => void;
}

export default function SettingsView({ data, onUpdateSettings, onImportData, onResetData }: SettingsViewProps) {
  
  const settings = data.settings;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [userName, setUserName] = useState(settings.userName);
  const [userRole, setUserRole] = useState(settings.role);
  const [theme, setTheme] = useState<'dark' | 'light'>(settings.theme);
  const [notifications, setNotifications] = useState(settings.notificationsEnabled);

  const [importStatus, setImportStatus] = useState<{ type: 'ok' | 'error', text: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      userName: userName.trim(),
      role: userRole.trim(),
      theme,
      notificationsEnabled: notifications
    });
    alert('User parameters saved successfully!');
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `projectos_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      console.error(e);
      alert('Failed to compile data backings.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportData(text);
        setImportStatus({ type: 'ok', text: 'Data database imported successfully. Refreshing...' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setImportStatus({ type: 'error', text: 'Format corrupt or incompatible files uploaded.' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetWorkspace = () => {
    if (confirm('Clear ALL custom inputs and reset workspace parameters back to default samples? This is final.')) {
      onResetData();
      alert('Workspace reset successful. Reloading...');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          Control Center & Profile <Settings className="h-5.5 w-5.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
        </h2>
        <p className="text-xs text-gray-400">Configure global profile descriptors, make JSON backups, import configurations, or factory reset database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: PROFILE DATA FORM - 7 Columns */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSaveProfile} className="p-5 md:p-6 bg-slate-900/35 border border-slate-800/80 rounded-2xl relative overflow-hidden space-y-4">
            
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-850">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Founder Profile parameters
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Local scope only</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">User Descriptor Name *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-505"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1.5">Role / Startup Title *</label>
                <input
                  type="text"
                  required
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-550"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Visual Theme Presets (Locked)</label>
                <select
                  value={theme}
                  disabled
                  onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-gray-400 cursor-not-allowed"
                >
                  <option value="dark">Vercel Dark Cyberpunk (Default)</option>
                  <option value="light">Warm Editorial (Locked)</option>
                </select>
                <span className="text-[9px] text-gray-600 font-mono mt-1 block">ProjectOS has calibrated dark presets configured.</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider mb-1">Sound Notifications</label>
                <div className="flex items-center space-x-2 h-9">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-4.5 w-4.5 bg-slate-950 border border-slate-805 rounded text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-300 font-medium">Toggle notification pings on card shippings</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-semibold shadow-lg hover:opacity-90 active:scale-95 transition"
            >
              Commit profile changes
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: DATA STORAGE BACKUPS - 5 Columns */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Backup Database Board */}
          <div className="p-5 bg-slate-900/35 border border-slate-800/80 rounded-2xl relative overflow-hidden space-y-3.5">
            <span className="block text-xs font-display font-bold text-white uppercase tracking-wide">
              Persistent Backup Controls
            </span>
            <p className="text-[11px] text-gray-450 leading-relaxed font-sans mt-1">
              Your data is fully sandboxed in local storage files inside this browser cache. Make backups to prevent data decay.
            </p>

            <div className="space-y-2 pt-1 flex flex-col">
              {/* Export Button */}
              <button
                onClick={handleExportData}
                type="button"
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-indigo-400 hover:text-white rounded-xl font-mono font-medium transition flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Export DB Backings (.JSON)
              </button>

              {/* Import Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-gray-300 hover:text-white rounded-xl font-mono font-medium transition flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" /> Ingest JSON backup file
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />

              {importStatus && (
                <div className={`p-2.5 rounded-lg text-[10px] font-mono ${importStatus.type === 'ok' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'}`}>
                  {importStatus.text}
                </div>
              )}
            </div>
          </div>

          {/* Reset Workspace System */}
          <div className="p-5 bg-slate-900/35 border border-slate-800/80 rounded-2xl relative overflow-hidden space-y-3.5">
            <span className="block text-xs font-display font-bold text-rose-400 uppercase tracking-wide">
              Emergency purging area
            </span>
            <p className="text-[11px] text-gray-450 leading-relaxed">
              Purges all personal configurations, milestone updates, invoice ledgers and diary files, restoring the database back to early setup samples.
            </p>

            <button
              onClick={handleResetWorkspace}
              type="button"
              className="w-full py-2 bg-rose-950/30 hover:bg-rose-600 text-rose-450 hover:text-white border border-rose-500/20 text-xs rounded-xl font-mono font-bold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Purge & Standard Reset
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
