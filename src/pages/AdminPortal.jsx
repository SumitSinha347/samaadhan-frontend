import React, { useEffect, useState } from 'react';
import { fetchComplaints, updateComplaint, fetchDepartments, fetchUsers, createDepartment, deleteDepartment, deleteUser } from '../api';
import { 
  Search, Filter, Users, ClipboardList, PlusCircle, AlertCircle, 
  CheckCircle, Trash2, Building, Activity, ShieldCheck, Database, 
  Cpu, Map, ChevronDown, CheckSquare, Clock
} from 'lucide-react';

const ComplaintCard = ({ complaint, onStatusChange }) => (
  <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-emerald-500 opacity-50"></div>
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-slate-900 text-blue-400 rounded-full border border-blue-900/50">{complaint.department}</span>
      <span className="text-xs font-mono text-slate-500">#{complaint.id}</span>
    </div>
    <h4 className="font-bold text-slate-200 text-base mb-2 leading-tight">{complaint.text}</h4>
    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
      <Map className="w-3.5 h-3.5" /> {complaint.location}
    </div>
    
    <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-auto">
      <div className="relative group/dropdown">
        <button className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${
          complaint.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          complaint.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
          'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {complaint.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : complaint.status === 'In Progress' ? <Activity className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {complaint.status} <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        <div className="absolute bottom-full left-0 mb-2 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 overflow-hidden z-20">
          <button onClick={() => onStatusChange(complaint.id, 'Pending')} className="w-full text-left px-4 py-2 text-xs font-bold text-amber-400 hover:bg-slate-700">Pending</button>
          <button onClick={() => onStatusChange(complaint.id, 'In Progress')} className="w-full text-left px-4 py-2 text-xs font-bold text-blue-400 hover:bg-slate-700">In Progress</button>
          <button onClick={() => onStatusChange(complaint.id, 'Completed')} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-700">Completed</button>
        </div>
      </div>
    </div>
  </div>
);

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('complaints'); // complaints | users
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [newDeptName, setNewDeptName] = useState('');
  const [deptFormStatus, setDeptFormStatus] = useState('');
  const [deptFormError, setDeptFormError] = useState('');

  const loadData = async () => {
    try {
      if (activeTab === 'complaints') {
        const complaintParams = {};
        if (departmentFilter) complaintParams.department = departmentFilter;
        if (statusFilter) complaintParams.status = statusFilter;

        const [cRes, dRes] = await Promise.all([
          fetchComplaints(complaintParams),
          fetchDepartments()
        ]);
        setComplaints(cRes.data);
        setDepartments(dRes.data);
      } else {
        const [uRes, dRes] = await Promise.all([ fetchUsers(), fetchDepartments() ]);
        setUsers(uRes.data);
        setDepartments(dRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, [departmentFilter, statusFilter, activeTab]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaint(id, { status });
      setComplaints(current => current.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Authorize deletion of user record?")) return;
    try {
      await deleteUser(id);
      setUsers(current => current.filter(u => u.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    setDeptFormError(''); setDeptFormStatus('');
    try {
      await createDepartment(newDeptName);
      setDeptFormStatus('Node added successfully.');
      setDepartments(current => [...current, newDeptName]);
      setNewDeptName('');
      setTimeout(() => setDeptFormStatus(''), 3000);
    } catch(err) { setDeptFormError('Failed to initialize node.'); }
  };

  const handleDeleteDepartment = async (name) => {
    if (!window.confirm(`Decommission ${name}?`)) return;
    try {
      await deleteDepartment(name);
      setDepartments(current => current.filter(d => d !== name));
    } catch(err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-['DM_Sans',sans-serif] pb-20 overflow-x-hidden relative text-slate-300">
      
      {/* --- CINEMATIC AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.2)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        {/* Radar sweep effect */}
        <div className="absolute w-[800px] h-[800px] border border-blue-900/20 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
          <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent to-blue-500/50 absolute left-1/2 origin-left"></div>
        </div>
        <div className="absolute w-[600px] h-[600px] border border-blue-900/10 rounded-full"></div>
        <div className="absolute w-[400px] h-[400px] border border-blue-900/10 rounded-full"></div>
        
        <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      {/* --- OFFICIAL TOP BAR --- */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-400 py-1.5 px-4 md:px-8 flex justify-between items-center text-[11px] font-bold tracking-widest uppercase z-40 relative">
        <div className="flex items-center gap-4">
          <span className="text-blue-500">SECURE CONNECTION</span>
          <span className="hidden sm:inline">GOVERNMENT OF NCT OF DELHI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* --- COMMAND CENTER HEADER --- */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 py-4 px-4 md:px-8 flex justify-between items-center shadow-2xl z-30 relative">
        <div className="flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/250px-Emblem_of_India.svg.png" alt="Emblem" className="h-10 opacity-80 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif] drop-shadow-md">
              CENTRAL <span className="text-blue-500">COMMAND</span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Global Administration Node</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clearance Level</span>
            <span className="text-sm font-extrabold text-emerald-400">OMEGA (Admin)</span>
          </div>
          <div className="w-10 h-10 border border-slate-700 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 relative z-10">
        
        {/* TELEMETRY ROW (Flashy Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Logs</p>
              <p className="text-2xl font-extrabold text-white font-mono">14,208</p>
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution Rate</p>
              <p className="text-2xl font-extrabold text-white font-mono">92.4%</p>
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Users</p>
              <p className="text-2xl font-extrabold text-white font-mono">3,492</p>
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl"></div>
            <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/50">
              <Cpu className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Engine Status</p>
              <p className="text-sm font-extrabold text-emerald-400 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> OPTIMAL
              </p>
            </div>
          </div>
        </div>

        {/* --- GLOWING TAB NAVIGATION --- */}
        <div className="flex bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1 mb-8 w-fit shadow-2xl">
          <button 
            onClick={() => setActiveTab('complaints')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'complaints' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ClipboardList className="w-4 h-4" /> Live Docket
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ShieldCheck className="w-4 h-4" /> System Control
          </button>
        </div>

        {/* --- COMPLAINTS VIEW --- */}
        {activeTab === 'complaints' && (
          <div className="animate-in fade-in duration-500">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif] tracking-wider">REAL-TIME FEED</h2>
              </div>
              
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative group flex-1 sm:flex-none">
                  <Filter className="w-4 h-4 absolute left-3 top-3.5 text-blue-400 group-focus-within:text-blue-300" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-300 text-xs font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Nodes</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="relative group flex-1 sm:flex-none">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-blue-400 group-focus-within:text-blue-300" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-300 text-xs font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.length > 0 ? (
                complaints.map(c => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-slate-700/50 border-dashed">
                  <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">No active anomalies detected.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- USERS & DEPARTMENTS VIEW --- */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-right-8 duration-500">
            
            {/* Users Table */}
            <div className="xl:col-span-2 bg-slate-800/40 backdrop-blur-xl rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Users className="w-32 h-32" />
              </div>
              <div className="p-6 md:p-8 border-b border-slate-700/50 bg-slate-900/50 relative z-10">
                <h2 className="text-2xl font-bold text-white font-['Outfit',sans-serif] tracking-wide">Identity Registry</h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Authorized personnel and citizen identities.</p>
              </div>
              
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-700/50 text-blue-400 text-[10px] uppercase tracking-widest">
                      <th className="p-4 md:px-8 font-bold">Subject Name</th>
                      <th className="p-4 font-bold">Com-Link (Email)</th>
                      <th className="p-4 font-bold">Clearance</th>
                      <th className="p-4 md:px-8 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30 text-sm">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 md:px-8 font-bold text-slate-200">{u.name}</td>
                        <td className="p-4 text-slate-400 font-mono text-xs">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                            u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                            u.role === 'department' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 md:px-8 text-right">
                           {u.role === 'citizen' && (
                             <button onClick={() => handleDeleteUser(u.id)} className="text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors border border-transparent hover:border-rose-500/30">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                           {u.role !== 'citizen' && <span className="text-slate-600 text-xs italic">Protected</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Management */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl flex flex-col relative h-fit">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="p-6 md:p-8 border-b border-slate-700/50 bg-slate-900/50 relative z-10">
                <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif] tracking-wide flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  Network Nodes
                </h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Manage Govt. Departments</p>
              </div>
              
              <div className="p-6 md:p-8 relative z-10">
                <form onSubmit={handleCreateDepartment} className="space-y-4 mb-8">
                  {deptFormError && (
                    <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl flex items-start text-xs font-bold uppercase tracking-wide border border-rose-500/20">
                      <AlertCircle className="w-4 h-4 mr-2" /> {deptFormError}
                    </div>
                  )}
                  {deptFormStatus && (
                    <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl flex items-start text-xs font-bold uppercase tracking-wide border border-emerald-500/20">
                      <CheckCircle className="w-4 h-4 mr-2" /> {deptFormStatus}
                    </div>
                  )}

                  <div className="relative group">
                    <input 
                      required type="text" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-white placeholder-slate-600 font-bold transition-all" 
                      placeholder="e.g. Health Ministry" 
                    />
                  </div>
                  
                  <button type="submit" className="w-full bg-blue-600/80 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all text-sm flex justify-center items-center gap-2 uppercase tracking-widest border border-blue-400/30">
                    <PlusCircle className="w-4 h-4" /> Initialize Node
                  </button>
                </form>

                <div>
                  <h3 className="text-[10px] font-bold text-blue-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Active Nodes
                  </h3>
                  <ul className="space-y-3">
                    {departments.map((d, i) => (
                      <li key={i} className="flex justify-between items-center bg-slate-900/50 p-3 pl-4 rounded-xl border border-slate-700/50 text-sm group hover:border-blue-500/30 transition-colors">
                        <span className="text-slate-300 font-bold tracking-wide">{d}</span>
                        <button onClick={() => handleDeleteDepartment(d)} className="text-rose-500/50 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPortal;
