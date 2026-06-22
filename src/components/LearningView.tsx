import React, { useState } from 'react';
import { GraduationCap, Hourglass, BookOpen, ExternalLink, Plus, Save, BookOpenCheck, Sliders } from 'lucide-react';
import { LearningSkill, LearningCategory } from '../types';

interface LearningViewProps {
  skills: LearningSkill[];
  onSaveSkill: (skill: LearningSkill) => void;
}

export default function LearningView({ skills, onSaveSkill }: LearningViewProps) {
  
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(skills[0]?.id || null);
  const [isEditingSkill, setIsEditingSkill] = useState(false);

  // States to override/edit details inside selectedSkill
  const [skillProgress, setSkillProgress] = useState(60);
  const [skillHours, setSkillHours] = useState(10);
  const [skillNotes, setSkillNotes] = useState('');
  const [newResourceText, setNewResourceText] = useState('');
  const [skillResources, setSkillResources] = useState<string[]>([]);

  const activeSkill = skills.find(s => s.id === selectedSkillId) || skills[0] || null;

  const handleSelectSkill = (skill: LearningSkill) => {
    setSelectedSkillId(skill.id);
    setSkillProgress(skill.progress);
    setSkillHours(skill.hoursStudied);
    setSkillNotes(skill.notes);
    setSkillResources(skill.resources);
    setIsEditingSkill(false);
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResourceText.trim()) {
      const updatedres = [...skillResources, newResourceText.trim()];
      setSkillResources(updatedres);
      setNewResourceText('');
    }
  };

  const handleSaveSkillDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSkill) return;

    const updated: LearningSkill = {
      ...activeSkill,
      progress: Number(skillProgress),
      hoursStudied: Number(skillHours),
      notes: skillNotes,
      resources: skillResources
    };

    onSaveSkill(updated);
    setIsEditingSkill(false);
  };

  const handleQuickAddHours = (skill: LearningSkill, incremental: number) => {
    const updated: LearningSkill = {
      ...skill,
      hoursStudied: Math.max(0, skill.hoursStudied + incremental)
    };
    onSaveSkill(updated);
    if (skill.id === selectedSkillId) {
      setSkillHours(updated.hoursStudied);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          Cognitive Skill Matrix <GraduationCap className="h-5.5 w-5.5 text-indigo-400" />
        </h2>
        <p className="text-xs text-gray-400">Track structural reading times, skill certificates, and training hours mapped to computer science.</p>
      </div>

      {/* Grid: Left - Skills Ring Bento Grid, Right - Study Desk Cabinet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: HIGH-POLISHED CIRCLE RINGS GRID - 7 Columns */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const isSelected = activeSkill?.id === skill.id;
            
            // Circular SVG calculations
            const r = 32;
            const strokeWidth = 5;
            const circ = 2 * Math.PI * r;
            const strokeDashoffset = circ - (circ * skill.progress) / 100;

            return (
              <div
                key={skill.id}
                onClick={() => handleSelectSkill(skill)}
                className={`
                  p-4.5 bg-white/5 border rounded-2xl cursor-pointer text-center relative overflow-hidden transition-all duration-200 flex flex-col items-center justify-between h-56
                  ${isSelected 
                    ? 'bg-white/10 border-indigo-500 shadow-lg' 
                    : 'border-white/10 hover:bg-white/10 hover:border-white/20'}
                `}
              >
                {/* Title */}
                <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  {skill.category}
                </span>

                {/* Animated Radial SVG Circle Ring */}
                <div className="relative h-24 w-24 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background */}
                    <circle
                      cx="48"
                      cy="48"
                      r={r}
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    {/* Progress Indicator */}
                    <circle
                      cx="48"
                      cy="48"
                      r={r}
                      stroke={isSelected ? '#818cf8' : '#38bdf8'}
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circ}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  {/* Text Center */}
                  <div className="absolute text-center">
                    <span className="block text-sm font-display font-bold text-white tracking-tight">{skill.progress}%</span>
                    <span className="block text-[9px] text-gray-400 font-mono">Proficient</span>
                  </div>
                </div>

                {/* Hours and Increment panel */}
                <div className="w-full">
                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                    <span>Study Hours:</span>
                    <span className="text-white font-bold">{skill.hoursStudied} Hrs</span>
                  </div>

                  {/* Increment Buttons to play inline */}
                  <div className="flex gap-1.5 mt-2 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAddHours(skill, -1);
                      }}
                      className="px-2 py-0.5 bg-[#121212] border border-white/10 text-gray-450 hover:text-white rounded text-[9px] font-mono transition"
                    >
                      -1H
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAddHours(skill, 5);
                      }}
                      className="px-2 py-0.5 bg-[#121212] border border-white/10 text-indigo-400 hover:text-white rounded text-[9px] font-mono transition"
                    >
                      +5H
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: WORKROOM REVISIONS AND RESOURCES WIDGET - 5 Columns */}
        <div className="lg:col-span-5">
          {activeSkill ? (
            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden space-y-4">
              
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <BookOpenCheck className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-xs font-display font-bold text-white uppercase tracking-wide">
                    {activeSkill.category} Study Log
                  </h3>
                </div>

                <button
                  onClick={() => {
                    if (!isEditingSkill) {
                      setSkillProgress(activeSkill.progress);
                      setSkillHours(activeSkill.hoursStudied);
                      setSkillNotes(activeSkill.notes);
                      setSkillResources(activeSkill.resources);
                    }
                    setIsEditingSkill(!isEditingSkill);
                  }}
                  className="px-3 py-1 bg-[#121212] hover:bg-[#1b1b1b] text-gray-400 hover:text-white rounded-lg border border-white/10 text-[10px] font-mono font-bold transition flex items-center gap-1"
                >
                  <Sliders className="h-3 w-3" /> {isEditingSkill ? 'Cancel' : 'Edit Logs'}
                </button>
              </div>

              {isEditingSkill ? (
                <form onSubmit={handleSaveSkillDetails} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Progress Meter (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skillProgress}
                        onChange={(e) => setSkillProgress(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-1.5 bg-[#121212] border border-white/10 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Hours Invested</label>
                      <input
                        type="number"
                        min="0"
                        value={skillHours}
                        onChange={(e) => setSkillHours(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-1.5 bg-[#121212] border border-white/10 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-1">Concept Synopsis & Notes</label>
                    <textarea
                      rows={3}
                      value={skillNotes}
                      onChange={(e) => setSkillNotes(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-[#121212] border border-white/10 rounded-xl text-white resize-none"
                    />
                  </div>

                  {/* Inline resources compiler */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 tracking-wider mb-1">Append Recommended Resource</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Stanford CS231n syllabus..."
                        value={newResourceText}
                        onChange={(e) => setNewResourceText(e.target.value)}
                        className="flex-grow text-[11px] px-2.5 py-1 bg-[#121212] border border-white/10 rounded-lg text-white"
                      />
                      <button 
                        type="button" 
                        onClick={handleCreateResource}
                        className="px-2.5 bg-white/10 hover:bg-white/20 text-indigo-400 hover:text-white rounded-lg text-xs"
                      >
                        Append
                      </button>
                    </div>

                    <div className="mt-2 text-[10px] font-mono max-h-24 overflow-y-auto space-y-1 bg-white/[0.03] p-2 border border-white/10 rounded-lg">
                      {skillResources.map((res, index) => (
                        <div key={index} className="flex justify-between items-center p-1 bg-[#121212] border border-white/5 rounded">
                          <span className="truncate text-gray-400">{res}</span>
                          <button 
                            type="button" 
                            onClick={() => setSkillResources(skillResources.filter((_, i) => i !== index))}
                            className="text-gray-500 hover:text-rose-400 text-xs px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition"
                  >
                    Commit skill modifications
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Reading Notes */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none font-medium">Concept Synopsis</span>
                    <p className="text-xs text-gray-350 leading-relaxed font-sans bg-white/[0.03] border border-white/5 p-3.5 rounded-xl">
                      {activeSkill.notes || "No conceptual notes logged yet. Hit 'Edit Logs' to map details."}
                    </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center space-x-2.5">
                      <Hourglass className="h-4.5 w-4.5 text-indigo-400" />
                      <div>
                        <span className="block text-[9px] font-mono text-gray-500 uppercase leading-none">TIME DEVOTED</span>
                        <span className="block text-xs font-display font-medium text-white mt-1">{activeSkill.hoursStudied} Hours</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center space-x-2.5">
                      <BookOpen className="h-4.5 w-4.5 text-[#3afdcf]" />
                      <div>
                        <span className="block text-[9px] font-mono text-gray-500 uppercase leading-none">RESOURCES</span>
                        <span className="block text-xs font-display font-medium text-white mt-1">{activeSkill.resources.length} Tracks</span>
                      </div>
                    </div>
                  </div>

                  {/* Study curriculum resources list */}
                  <div className="space-y-2 pt-1">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">Study Materials & Syllabus</span>
                    
                    {activeSkill.resources.length === 0 ? (
                      <p className="text-[10px] text-gray-550 italic uppercase tracking-wider pl-1 font-mono">No reference files logged.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {activeSkill.resources.map((res, i) => (
                          <div 
                            key={i}
                            className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-lg group hover:border-slate-800 transition"
                          >
                            <span className="text-xs text-gray-300 font-mono max-w-[85%] truncate pr-2">
                              {i + 1}. {res}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-605 group-hover:text-indigo-400 transition cursor-pointer" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
              <p className="text-gray-500 text-sm">Select a skill progress ring to inspect study curriculum.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
