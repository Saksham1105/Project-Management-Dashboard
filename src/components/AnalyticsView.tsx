import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, BarChart4, GraduationCap, Coins, Milestone } from 'lucide-react';
import { ProjectOSData, Project, LearningSkill, RevenueRecord } from '../types';

interface AnalyticsViewProps {
  data: ProjectOSData;
}

export default function AnalyticsView({ data }: AnalyticsViewProps) {
  
  const projects = data.projects;
  const skills = data.skills;
  const revenue = data.revenue;

  // 1. PROJECT CATEGORIES AND STATUSES (BAR CHART & PIE CHART)
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const projectStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // STATUS COLORS FOR CIRCULAR METER
  const STATUS_COLORS: Record<string, string> = {
    Idea: '#94a3b8',
    Planning: '#38bdf8',
    Building: '#818cf8',
    Testing: '#f59e0b',
    Completed: '#34d399',
    'On Hold': '#ef4444'
  };

  // 2. SKILLS VS STUDY HOURS BAR CHART
  const skillHoursData = skills.map(s => ({
    name: s.category,
    hours: s.hoursStudied,
    pct: s.progress
  }));

  // 3. REVENUE PIPELINE OVER DATES (AREA CHART)
  // Sort payments chronologically
  const paidCompletedRevenue = [...revenue]
    .filter(r => ['Paid', 'Completed'].includes(r.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let rollingSum = 0;
  const revenueGrowthData = paidCompletedRevenue.map(r => {
    rollingSum += r.amount;
    return {
      date: r.date,
      amount: r.amount,
      cumulative: rollingSum,
      clientName: r.clientName
    };
  });

  // 4. TASK BACKLOG METRIC
  // Count tasks in each back-log bucket
  const allTasks = projects.flatMap(p => p.tasks);
  const taskStatusCounts = allTasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskDistributionData = [
    { name: 'Todo Backlog', count: taskStatusCounts['Todo'] || 0, fill: '#38bdf8' },
    { name: 'In Progress Sprint', count: taskStatusCounts['In Progress'] || 0, fill: '#818cf8' },
    { name: 'Under Review', count: taskStatusCounts['Review'] || 0, fill: '#a78bfa' },
    { name: 'Done (Completed)', count: taskStatusCounts['Done'] || 0, fill: '#34d399' }
  ];

  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === 'Done').length;
  const completionRatio = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Custom visual components
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          Workspace Analytics Console <BarChart4 className="h-5.5 w-5.5 text-indigo-400" />
        </h2>
        <p className="text-xs text-gray-400">Deep diagnostics, financial growth rates, code compliance tracking, and cognitive study loops.</p>
      </div>

      {/* Grid: First row line charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Cumulative Revenue growth area curves */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="h-4.5 w-4.5 text-emerald-400" /> Revenue Growth Rate (Cumulative USD)
            </h4>
            <span className="text-[10px] font-mono text-gray-400 font-bold">Gross paid</span>
          </div>

          {revenueGrowthData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 font-mono text-[11px]">
              No paid/completed revenue to chart yet.
            </div>
          ) : (
            <div className="h-64 w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" ticks={revenueGrowthData.map(d => d.date)} />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCumulative)" name="Cumulative Earned ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Skills studying metrics bars */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="h-4.5 w-4.5 text-indigo-400" /> Academic Studying Blocks (Hours per Skill)
            </h4>
            <span className="text-[10px] font-mono text-gray-400 font-bold">Training ledger</span>
          </div>

          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]} name="Studied (Hrs)" />
                <Bar dataKey="pct" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Progress (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid: second row circles & distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Project workspace status distribution diagram */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Milestone className="h-4.5 w-4.5 text-purple-400" /> Workspace Pipeline States
            </h4>
          </div>

          {projectStatusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-500 font-mono text-xs">
              No project workspaces.
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name] || '#6366f1'} 
                        stroke="rgba(255, 255, 255, 0.05)"
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>

              {/* Status legends custom */}
              <div className="flex flex-wrap gap-2.5 justify-center mt-2.5 text-[9px] font-mono leading-none">
                {projectStatusData.map((d, i) => (
                  <div key={i} className="flex items-center space-x-1">
                    <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: STATUS_COLORS[d.name] || '#6366f1' }} />
                    <span className="text-gray-400">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Task backlog distribution table bars */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-400" /> Task Status backlog Distribution
            </h4>
            <span className="text-[10px] font-mono text-emerald-450 font-bold">{completionRatio}% Completion Ratio</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Horizontal progress indicators */}
            <div className="md:col-span-7 space-y-3.5 py-2.5">
              {taskDistributionData.map((bucket, i) => {
                const fraction = totalTasks > 0 ? (bucket.count / totalTasks) * 100 : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 leading-none">
                      <span>{bucket.name}</span>
                      <span className="text-white font-bold">{bucket.count} Tickets ({Math.round(fraction)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/5">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${fraction}%`, backgroundColor: bucket.fill }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Circle micro-analytics ratio meter */}
            <div className="md:col-span-5 p-4.5 bg-white/[0.03] border border-white-5 rounded-xl relative overflow-hidden text-center flex flex-col items-center justify-center">
              <span className="block text-[9px] font-mono text-gray-550 uppercase tracking-widest leading-none font-bold">CLEARED RATIO</span>
              <span className="block text-3xl font-display font-bold text-white mt-1.5">{completionRatio}%</span>
              <p className="text-[10px] text-gray-405 mt-1.5 leading-relaxed font-sans">
                {doneTasks} out of {totalTasks} back-log tasks completed. Excellent operational run rate.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
