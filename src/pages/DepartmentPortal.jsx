import React, { useEffect, useState, useContext, createContext, useMemo } from 'react';

// ============================================================================
// 1. REAL API IMPORTS (Uncomment this line when ready to connect to backend)
// ============================================================================
import { fetchComplaints, updateComplaint } from '../api';
import { AuthContext } from '../AuthContext';

import { 
  Sparkles, TrendingUp, AlertTriangle, MapPin, 
  Clock, CheckCircle, ChevronDown, Map, HardHat, FileText, Inbox
} from 'lucide-react';




// ============================================================================
// 3. EXECUTIVE MINIMAL DISPATCH CARD
// ============================================================================
const DispatchCard = ({ complaint, onStatusChange, index }) => {
  const isHighPriority = complaint.priority === 'High';
  
  return (
    <div 
      className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both bg-white rounded-2xl p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all relative group flex flex-col h-full"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">{complaint.category}</span>
          {isHighPriority && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Critical
            </span>
          )}
        </div>
        <span className="text-xs font-mono font-medium text-slate-400">#{complaint.id}</span>
      </div>
      
      <h4 className="font-semibold text-slate-800 text-lg tracking-tight mb-4 leading-snug flex-1">{complaint.text}</h4>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {complaint.location}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> {complaint.date}
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</span>
        <div className="relative group/dropdown">
          <button className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
            complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 
            complaint.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 
            'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}>
            {complaint.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : complaint.status === 'In Progress' ? <HardHat className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            {complaint.status} <ChevronDown className="w-3 h-3 ml-0.5 opacity-40" />
          </button>
          
          {/* Elegant Dropdown */}
          <div className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 overflow-hidden z-20 transform translate-y-2 group-hover/dropdown:translate-y-0 p-1">
            <button type="button" onClick={() => onStatusChange(complaint.id, 'Pending')} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"><FileText className="w-3.5 h-3.5 text-slate-400"/> Pending</button>
            <button type="button" onClick={() => onStatusChange(complaint.id, 'In Progress')} className="w-full text-left px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"><HardHat className="w-3.5 h-3.5 text-blue-500"/> In Progress</button>
            <button type="button" onClick={() => onStatusChange(complaint.id, 'Resolved')} className="w-full text-left px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2 transition-colors"><CheckCircle className="w-3.5 h-3.5 text-emerald-500"/> Resolved</button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// 4. MAIN DEPARTMENT PORTAL COMPONENT
// ============================================================================
const DepartmentPortal = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const loadData = async () => {
    if (!user || user.role !== 'department') return;
    setIsLoading(true);
    try {
      const { data } = await fetchComplaints({ department: user.department });
      setComplaints(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaint(id, { status });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  // AI Metrics Calculation
  const aiInsights = useMemo(() => {
    if (complaints.length === 0) return null;
    
    const categoryCounts = {};
    const locationCounts = {};
    let highPriCount = 0;
    
    complaints.forEach(c => {
      if (c.status !== 'Resolved') {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        const rootLoc = c.location.toLowerCase();
        locationCounts[rootLoc] = (locationCounts[rootLoc] || 0) + 1;
        if (c.priority === 'High') highPriCount++;
      }
    });

    const activeCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
    if (activeCount === 0) return null;

    const topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, Object.keys(categoryCounts)[0]);
    const topLocationRaw = Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, Object.keys(locationCounts)[0]);
    const topLocation = topLocationRaw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    return {
      topCategory: { name: topCategory, count: categoryCounts[topCategory] },
      topLocation: { name: topLocation, count: locationCounts[topLocationRaw] },
      criticalCount: highPriCount,
      activeCount: activeCount
    };
  }, [complaints]);

  if (!user || user.role !== 'department') return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['DM_Sans',sans-serif] pb-24 overflow-x-hidden text-slate-800">
      
      {/* --- REFINED TOP BAR --- */}
      <div className="bg-[#0F172A] text-slate-300 py-2 px-6 md:px-10 flex justify-between items-center text-[10px] font-semibold tracking-widest uppercase relative z-40">
        <div className="flex items-center gap-6">
          <span className="text-white">GOVERNMENT OF NCT OF DELHI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer transition-colors">A-</span>
          <span className="hover:text-white cursor-pointer transition-colors">A</span>
          <span className="hover:text-white cursor-pointer transition-colors">A+</span>
        </div>
      </div>

      {/* --- CLEAN EXECUTIVE HEADER --- */}
      <div className="bg-white border-b border-slate-200/80 py-5 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center z-30 relative">
        <div className="flex items-center gap-5">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/250px-Emblem_of_India.svg.png" alt="Emblem" className="h-10 md:h-12 opacity-90" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">{user.department}</h1>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-[0.15em] mt-0.5">Samaadhan Operations Node</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">{user.name}</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
               Verified Official
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-10">

        {/* --- UNIFIED AI BRIEFING PANEL (Designer Touch) --- */}
        {aiInsights && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Executive Briefing
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
              
              {/* Surge Detection */}
              <div className="flex-1 p-6 md:p-8 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Surge Volume</p>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{aiInsights.topCategory.name}</h4>
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700">{aiInsights.topCategory.count}</span> active cases tracking.</p>
              </div>

              {/* Hotspot */}
              <div className="flex-1 p-6 md:p-8 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Map className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Geographic Hotspot</p>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 truncate">{aiInsights.topLocation.name}</h4>
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700">{aiInsights.topLocation.count}</span> concentrated reports.</p>
              </div>

              {/* Priority */}
              <div className="flex-1 p-6 md:p-8 hover:bg-slate-50/50 transition-colors group relative overflow-hidden">
                {aiInsights.criticalCount > 0 && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${aiInsights.criticalCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority Matrix</p>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                  {aiInsights.criticalCount > 0 ? `${aiInsights.criticalCount} Critical` : 'Nominal'}
                </h4>
                <p className="text-sm text-slate-500">
                  {aiInsights.criticalCount > 0 ? <span className="text-rose-600 font-medium">Requires immediate intervention.</span> : 'No severe emergencies.'}
                </p>
              </div>
              
            </div>
          </div>
        )}

        {/* --- DISPATCH QUEUE --- */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Inbox className="w-4 h-4 text-slate-400" />
              Active Work Orders
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-56 bg-white rounded-2xl border border-slate-100 animate-pulse shadow-sm"></div>
              ))}
            </div>
          ) : complaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((c, index) => (
                <DispatchCard
                  key={c.id}
                  complaint={c}
                  index={index}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1">Inbox Zero</h3>
              <p className="text-slate-500 text-sm">All operational queues are currently clear.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DepartmentPortal;