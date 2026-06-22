import React, { useState } from 'react';
import { Coins, Plus, DollarSign, Calendar, Users, Trash2, ArrowUpRight, TrendingUp, Filter } from 'lucide-react';
import { RevenueRecord, RevenueStatus } from '../types';

interface RevenueViewProps {
  revenue: RevenueRecord[];
  onSaveRevenueRecord: (record: RevenueRecord) => void;
  onDeleteRevenueRecord: (recordId: string) => void;
}

export default function RevenueView({ revenue, onSaveRevenueRecord, onDeleteRevenueRecord }: RevenueViewProps) {
  
  // New Record Form State
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [amount, setAmount] = useState(1500);
  const [status, setStatus] = useState<RevenueStatus>('Proposal Sent');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Filtering Options
  const [statusFilter, setStatusFilter] = useState<'All' | RevenueStatus>('All');

  // Submit Invoice Data
  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectName.trim()) return;

    const newRecord: RevenueRecord = {
      id: `rev-${Date.now()}`,
      clientName: clientName.trim(),
      projectName: projectName.trim(),
      amount: Number(amount),
      status,
      date
    };

    onSaveRevenueRecord(newRecord);
    setClientName('');
    setProjectName('');
    setAmount(1500);
    setStatus('Proposal Sent');
    setIsAddingRecord(false);
  };

  const handleUpdateStatus = (record: RevenueRecord, newStatus: RevenueStatus) => {
    onSaveRevenueRecord({
      ...record,
      status: newStatus
    });
  };

  // Aggregates derivation
  const totalRevenue = revenue
    .filter(r => ['Paid', 'Completed'].includes(r.status))
    .reduce((sum, item) => sum + item.amount, 0);

  // Compute monthly revenue (e.g., current month is June 2026 based on metadata)
  const monthlyRevenue = revenue
    .filter(r => ['Paid', 'Completed'].includes(r.status) && r.date.includes('-06-'))
    .reduce((sum, item) => sum + item.amount, 0);

  const activePipelineValue = revenue
    .filter(r => ['Proposal Sent', 'Negotiating'].includes(r.status))
    .reduce((sum, item) => sum + item.amount, 0);

  const activeLeadsCount = revenue.filter(r => r.status === 'Lead').length;

  const filteredRecords = revenue.filter(r => statusFilter === 'All' || r.status === statusFilter);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            Revenue Ledger Pipeline <Coins className="h-5.5 w-5.5 text-indigo-400" />
          </h2>
          <p className="text-xs text-gray-400">Track structural cashflows, invoices, client acquisition targets, and active business proposals.</p>
        </div>

        <button
          onClick={() => setIsAddingRecord(!isAddingRecord)}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <Plus className="h-4.5 w-4.5" /> Log Transaction
        </button>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Earned */}
        <div className="p-4.5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-3xl flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">TOTAL PAYOUTS EARNED</span>
          <span className="block text-xl font-display font-bold text-white mt-2">${totalRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block font-mono">Cleared in bank account</span>
        </div>

        {/* Monthly Revenue */}
        <div className="p-4.5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/10 rounded-bl-3xl flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">REVENUE (JUN 2026)</span>
          <span className="block text-xl font-display font-bold text-white mt-2">${monthlyRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 mt-1 block font-mono">Active month stats</span>
        </div>

        {/* Contract Pipeline */}
        <div className="p-4.5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-purple-500/10 rounded-bl-3xl flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-purple-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">ACTIVE CONTRACT PIPELINE</span>
          <span className="block text-xl font-display font-bold text-white mt-2">${activePipelineValue.toLocaleString()}</span>
          <span className="text-[10px] text-purple-400 mt-1 block font-mono">In negotiation steps</span>
        </div>

        {/* Marketing funnel */}
        <div className="p-4.5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-yellow-500/10 rounded-bl-3xl flex items-center justify-center">
            <Users className="h-4 w-4 text-yellow-400" />
          </div>
          <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none text-gray-500">MARKETING ACTIVE FUNNEL</span>
          <span className="block text-xl font-display font-bold text-white mt-2">{activeLeadsCount} Leads</span>
          <span className="text-[10px] text-gray-400 mt-1 block">Cold outreach targets</span>
        </div>
      </div>

      {/* Save Invoice panel Overlay */}
      {isAddingRecord && (
        <form onSubmit={handleSubmitInvoice} className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Input Revenue Pipeline Record</span>
            <button 
              type="button" 
              onClick={() => setIsAddingRecord(false)}
              className="text-[10px] font-mono text-gray-450 hover:text-white underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-405 font-bold tracking-wider mb-1.5">Client Descriptor *</label>
              <input
                type="text"
                required
                placeholder="e.g. Midtown Real Estate"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-505"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-405 font-bold tracking-wider mb-1.5">Project Scope *</label>
              <input
                type="text"
                required
                placeholder="e.g. Custom landing portfolio"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-505"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-405 font-bold tracking-wider mb-1.5">Invoice Amount (USD) *</label>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-505 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-405 font-bold tracking-wider mb-1.5">Acquisition Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-505"
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="w-1/2">
              <label className="block text-[10px] font-mono uppercase text-gray-455 font-bold tracking-wider mb-1">FUNNEL STATUS LEVEL</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RevenueStatus)}
                className="w-full text-xs px-3 py-2 bg-[#121212] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Lead">Lead (Prospecting)</option>
                <option value="Proposal Sent">Proposal Sent (Pending)</option>
                <option value="Negotiating">Negotiating (In process)</option>
                <option value="Paid">Paid (Clearing)</option>
                <option value="Completed">Completed (Tax Invoiced)</option>
              </select>
            </div>

            <div className="w-1/2 flex items-end justify-end h-full pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition active:scale-95"
              >
                Register Pipeline Node
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Client ledger table and Filter panel */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden space-y-4">
        
        {/* Filter Toolbar selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-white/5">
          <span className="text-xs font-display font-medium text-white flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-gray-400" /> Funnel Ledger Audit
          </span>

          <div className="flex bg-[#121212] border border-white/10 p-1 rounded-xl">
            {(['All', 'Lead', 'Proposal Sent', 'Negotiating', 'Paid', 'Completed'] as const).map((v) => {
              const active = statusFilter === v;
              return (
                <button
                  key={v}
                  onClick={() => setStatusFilter(v)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition ${active ? 'bg-indigo-600 text-white' : 'text-gray-450 hover:text-white'}`}
                >
                  {v === 'Proposal Sent' ? 'Sent' : v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ledger list */}
        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-gray-500 font-mono text-[11px]">
            No financial transactions matched your ledger selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Client Name</th>
                  <th className="py-2.5 px-3">Project Scope</th>
                  <th className="py-2.5 px-3">Invoice Amount</th>
                  <th className="py-2.5 px-3">Funnel Status</th>
                  <th className="py-2.5 px-3">Acquisition Date</th>
                  <th className="py-2.5 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 font-semibold text-white">{record.clientName}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-400">{record.projectName}</td>
                    <td className="py-3 px-3 font-mono text-xs text-indigo-400 font-bold">${record.amount.toLocaleString()}</td>
                    
                    <td className="py-3 px-3">
                      <select
                        value={record.status}
                        onChange={(e) => handleUpdateStatus(record, e.target.value as RevenueStatus)}
                        className={`
                          text-[10px] font-mono font-semibold px-2 py-1 bg-[#121212] border rounded-lg focus:outline-none cursor-pointer
                          ${record.status === 'Paid' || record.status === 'Completed' ? 'border-emerald-500/30 text-emerald-450' : ''}
                          ${record.status === 'Negotiating' ? 'border-purple-500/30 text-purple-400' : ''}
                          ${record.status === 'Proposal Sent' ? 'border-indigo-500/30 text-indigo-400' : ''}
                          ${record.status === 'Lead' ? 'border-gray-800 text-gray-400' : ''}
                        `}
                      >
                        <option value="Lead">Lead</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Negotiating">Negotiating</option>
                        <option value="Paid">Paid</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-[11px] text-gray-400 font-mono">
                      {record.date}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove financial ledger record for ${record.clientName}?`)) {
                            onDeleteRevenueRecord(record.id);
                          }
                        }}
                        className="p-1 hover:text-rose-450 text-gray-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
