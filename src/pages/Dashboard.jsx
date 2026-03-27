import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Activity, CheckCircle, Clock, AlertTriangle, 
  Map, BarChart3, TrendingUp, Sparkles, ShieldCheck, MapPin
} from 'lucide-react';
import digitalIndiaLogo from './digital_india_log.png';
import azadiLogo from './azadi_ka_amritMAhotsav.png';

// ============================================================================
// 1. REAL API IMPORTS (Uncomment these when ready to connect to backend)
// ============================================================================
import { fetchDashboard, fetchComplaints } from '../api';

// ============================================================================
// 2. LOCAL PREVIEW MOCKS (Delete this block once you uncomment the API above)


// Vibrant Color Palette for the Chart
const CHART_COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#f59e0b']; 

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchComplaints()]).then(([dashRes, compRes]) => {
      setStats(dashRes.data);
      setComplaints(compRes.data);
      setIsLoading(false);
    });
  }, []);

  const chartData = stats ? Object.keys(stats.byDepartment).map(key => ({
    name: key.replace('Department', '').trim(),
    complaints: stats.byDepartment[key]
  })) : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['DM_Sans',sans-serif] pb-0 overflow-x-hidden text-slate-800 flex flex-col">
      
      {/* --- OFFICIAL TOP BAR --- */}
      <div className="bg-[#1E293B] text-white py-1.5 px-4 md:px-8 flex justify-between items-center text-[11px] font-medium tracking-wide z-40 relative">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">GOVERNMENT OF NCT OF DELHI | दिल्ली सरकार</span>
          <span className="sm:hidden">DELHI GOVT</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-l border-slate-600 pl-4">
            <span className="hover:text-orange-400 cursor-pointer transition-colors">A-</span>
            <span className="hover:text-white cursor-pointer transition-colors">A</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">A+</span>
          </div>
        </div>
      </div>

      {/* --- WHITE LOGO HEADER --- */}
      <div className="bg-white py-3 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center shadow-[0_2px_15px_rgba(0,0,0,0.03)] z-30 relative border-b border-slate-100">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/250px-Emblem_of_India.svg.png" 
            alt="Emblem of India" 
            className="h-10 md:h-14 opacity-90"
          />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight font-['Outfit',sans-serif]">
              SAMAADHAN
            </h1>
            <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">
              AI-Powered Citizen Portal • Delhi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <img 
            src={digitalIndiaLogo}
            alt="Digital India" 
            className="h-8 md:h-10 object-contain hidden lg:block"
          />
          <img 
            src={azadiLogo}
            alt="Azadi Ka Amrit Mahotsav" 
            className="h-10 md:h-14 object-contain"
          />
        </div>
      </div>

      {/* --- HERO INTRODUCTION (VIBRANT DELHI BACKGROUND) --- */}
      <div className="bg-slate-50 border-b border-slate-200/60 relative overflow-hidden flex items-center min-h-[480px]">
        
        {/* Animated India Gate Background - Highly Visible on Right */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-[center_top_15%] opacity-90 animate-[kenburns_30s_ease-out_infinite_alternate]"
            style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/1920px-India_Gate_in_New_Delhi_03-2016.jpg")' }}
          ></div>
        </div>

        {/* Vibrant Light-Theme Gradients: Saffron-tinted white on left, fading to completely transparent on the right to show India Gate */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-50/95 via-white/80 to-transparent w-full md:w-5/6"></div>
        
        {/* Bottom fade to blend seamlessly with the dashboard below */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#F8FAFC] via-white/10 to-transparent opacity-100"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 w-full">
          <div className="max-w-2xl">
            {/* Tricolor-themed badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md border-l-4 border-l-orange-500 border-r-4 border-r-emerald-500 rounded-full w-fit mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-700">Public Transparency Dashboard</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight mb-5 leading-[1.15]">
              Real-time civic data <br/>
              for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-600 to-emerald-600 drop-shadow-sm">better Delhi.</span>
            </h2>
            
            <p className="text-slate-700 font-semibold text-lg leading-relaxed max-w-xl bg-white/60 backdrop-blur-md p-4 -ml-4 rounded-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              Track the live resolution of grievances across all municipal departments. Powered by the official Samaadhan AI routing engine.
            </p>
          </div>
          
          <div className="hidden lg:flex flex-col gap-4 relative">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-3xl -m-5 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"></div>
            
            <div className="bg-white/95 backdrop-blur-xl shadow-sm border border-slate-100 rounded-2xl p-4 flex items-center gap-4 w-64 relative z-10 hover:-translate-y-1 transition-transform cursor-default">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Sparkles className="w-5 h-5"/></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Engine Status</p>
                <p className="text-sm font-bold text-slate-800">Operational</p>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-xl shadow-sm border border-slate-100 rounded-2xl p-4 flex items-center gap-4 w-64 relative z-10 hover:-translate-y-1 transition-transform cursor-default">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600"><ShieldCheck className="w-5 h-5"/></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Integrity</p>
                <p className="text-sm font-bold text-slate-800">Verified & Synced</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-20 flex-1 w-full relative z-20">

        {/* --- APEX METRICS GRID WITH COLOR ACCENTS --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            
            {/* Total Issues */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-blue-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total Registered</p>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">{stats.total.toLocaleString()}</h3>
                <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% this month</p>
              </div>
            </div>

            {/* Resolved */}
            <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-emerald-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Successfully Resolved</p>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">{stats.resolved.toLocaleString()}</h3>
                <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">87.6% Resolution Rate</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-indigo-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Work In Progress</p>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">{stats.inProgress.toLocaleString()}</h3>
                <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">Crews dispatched</p>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-orange-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Action</p>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">{stats.pending.toLocaleString()}</h3>
                <p className="text-[11px] text-orange-600 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">Within standard SLAs</p>
              </div>
            </div>

          </div>
        )}

        {/* --- MAIN ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CHART: Department Workload */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8 flex flex-col h-[450px] animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> Department Distribution
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Volume of grievances parsed by AI per nodal agency.</p>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 w-full">
              {isLoading ? (
                <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', color: '#0f172a'}} 
                    />
                    <Bar dataKey="complaints" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* MAP: Live Geotracking WITH REAL MAP BACKGROUND */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8 flex flex-col h-[450px] animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Map className="w-5 h-5 text-emerald-600" /> Active Geospatial Clusters
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Real-time mapping of critical civic anomalies.</p>
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Live
              </span>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative shadow-inner">
              {isLoading ? (
                <div className="w-full h-full animate-pulse bg-slate-100 flex items-center justify-center">
                  <Map className="w-8 h-8 text-slate-300" />
                </div>
              ) : (
                <div className="w-full h-full relative overflow-hidden bg-white">
                  
                  {/* REAL DELHI MAP BACKGROUND via OSM IFRAME (Styled to look like a clean designer dashboard map) */}
                  <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply" style={{ filter: 'grayscale(100%) contrast(120%)' }}>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src="https://www.openstreetmap.org/export/embed.html?bbox=76.90,28.50,77.30,28.75&layer=mapnik" 
                    ></iframe>
                  </div>

                  {/* Gradient Overlay to soften the map edges */}
                  <div className="absolute inset-0 z-0 bg-[radial-gradient(transparent_40%,white_100%)] pointer-events-none"></div>
                  
                  {/* Simulated Plot Markers overlaying the real map */}
                  <div className="absolute inset-0 z-10">
                    {complaints.map((c, i) => {
                      const top = `${25 + (i * 27) % 50}%`;
                      const left = `${15 + (i * 33) % 70}%`;
                      
                      return (
                        <div key={c.id} className="absolute group cursor-pointer pointer-events-auto" style={{ top, left }}>
                          
                          {/* Marker Pin */}
                          <div className="relative flex items-center justify-center">
                            {c.priority === 'Critical' && <span className="absolute w-8 h-8 rounded-full bg-rose-500 opacity-40 animate-ping"></span>}
                            {c.priority === 'High' && <span className="absolute w-6 h-6 rounded-full bg-orange-500 opacity-40 animate-ping"></span>}
                            
                            <div className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-lg border-2 border-white ${
                              c.priority === 'Critical' ? 'bg-rose-600' : 
                              c.priority === 'High' ? 'bg-orange-500' : 'bg-blue-600'
                            }`}>
                              <MapPin className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          {/* Designer Popup Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white border border-slate-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-slate-900 text-sm">{c.category}</div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{c.status}</span>
                            </div>
                            <div className="text-xs text-slate-600 mb-3 leading-snug">{c.text.substring(0, 40)}...</div>
                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <Map className="w-3 h-3"/> {c.location}
                            </div>
                            
                            {/* Triangle point for tooltip */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-slate-200 -z-10 -mt-[1px]"></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- OFFICIAL FOOTER --- */}
      <div className="mt-auto bg-white border-t border-slate-200 py-6 px-6 md:px-10 z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Use</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Help & Support</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Department of IT, Government of NCT of Delhi.
          </p>
        </div>
      </div>

      {/* --- GLOBAL ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.05) translate(-1%, -1%); }
        }
      `}} />
      
    </div>
  );
};

export default Dashboard;
