import React, { useState, useEffect, useContext, createContext } from 'react';
// IMPORTANT: Uncomment these in your real app!
import { submitComplaint, fetchComplaints } from '../api';
import { AuthContext } from '../AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import { 
  CheckCircle, 
  AlertCircle, 
  MapPin,
  FileText,
  Camera,
  Sparkles,
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
  Terminal,
  Wind,
  Award,
  Plus,
  X
} from 'lucide-react';



const QUESTION_MAPPING = {
  'Water': ["Days without water supply?", "Is the issue localized to your property?"],
  'Electricity': ["Complete blackout or voltage fluctuation?", "Estimated duration of issue?"],
  'Roads': ["Is this a pothole or structural collapse?", "Is there an immediate safety risk?"],
  'Sanitation': ["Has garbage overflowed onto the road?", "When was the last collection?"],
  'Others': ["Please specify the exact nature of the issue.", "Is emergency intervention required?"]
};

const DEPT_MAPPING = {
  'Water': 'Delhi Jal Board (DJB)',
  'Electricity': 'Department of Power (DISCOM)',
  'Roads': 'Public Works Department (PWD)',
  'Sanitation': 'Municipal Corporation of Delhi (MCD)',
  'Others': 'General Grievance Cell'
};

const detectCategory = (text) => {
  const lowerText = text.toLowerCase();
  if (['water', 'leak', 'pipe', 'jal', 'sewer'].some(w => lowerText.includes(w))) return 'Water';
  if (['power', 'electricity', 'light', 'outage', 'wire'].some(w => lowerText.includes(w))) return 'Electricity';
  if (['road', 'pothole', 'street', 'damage', 'traffic'].some(w => lowerText.includes(w))) return 'Roads';
  if (['garbage', 'trash', 'sanitation', 'smell', 'dump'].some(w => lowerText.includes(w))) return 'Sanitation';
  return 'Others';
};

const CitizenPortal = () => {
  const { user } = useContext(AuthContext);
  const [myComplaints, setMyComplaints] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form & AI State
  const [formData, setFormData] = useState({ location: '', text: '', category: '', department: '', image: null });
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('idle'); // idle -> analyzing -> questions -> submitting -> success
  const [submittedData, setSubmittedData] = useState(null);
  
  // AI Scan Terminal effect state
  const [scanLogs, setScanLogs] = useState([]);

  useEffect(() => {
    fetchComplaints().then(({ data }) => setMyComplaints(data)).catch(console.error);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const closeAndClearForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setFormData({ location: '', text: '', category: '', department: '', image: null });
      setAnswers([]);
      setQuestions([]);
      setStatus('idle');
      setSubmittedData(null);
      setScanLogs([]);
    }, 300); // Wait for modal close animation
  };

  // The Cinematic AI Scan Sequence
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setStatus('analyzing');
    setScanLogs(['> INITIALIZING SAMAADHAN NLP ENGINE...']);
    
    const logs = [
      '> PARSING GEOLOCATION DATA...',
      '> EXTRACTING KEYWORDS...',
      '> CROSS-REFERENCING DEPARTMENT SLAs...',
      '> MATCH FOUND. ROUTING PROTOCOL ENGAGED.'
    ];

    let delay = 600;
    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
      }, delay);
      delay += 800; // stagger the logs
    });

    setTimeout(() => {
      const detectedCat = detectCategory(formData.text);
      const detectedDept = DEPT_MAPPING[detectedCat];
      const categoryQuestions = QUESTION_MAPPING[detectedCat];
      
      setFormData(prev => ({ ...prev, category: detectedCat, department: detectedDept }));
      setQuestions(categoryQuestions);
      setAnswers(categoryQuestions.map(q => ({ q, a: '' })));
      setStatus('questions');
    }, delay + 500);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const payload = { ...formData, answers, name: user?.name, citizenEmail: user?.email };
      const { data } = await submitComplaint(payload);
      setSubmittedData(data);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['DM_Sans',sans-serif] pb-20 overflow-x-hidden relative">
      
      {/* --- OFFICIAL TOP BAR (Inherited from Login for consistency) --- */}
      <div className="bg-[#1E293B] text-white py-1.5 px-4 md:px-8 flex justify-between items-center text-[11px] font-medium tracking-wide z-40 relative">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">GOVERNMENT OF NCT OF DELHI | दिल्ली सरकार</span>
          <span className="sm:hidden">DELHI GOVT</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-l border-slate-600 pl-4">
            <span className="hover:text-blue-300 cursor-pointer">A-</span>
            <span className="hover:text-blue-300 cursor-pointer">A</span>
            <span className="hover:text-blue-300 cursor-pointer">A+</span>
          </div>
        </div>
      </div>

      <div className="bg-white py-3 px-4 md:px-8 flex justify-between items-center shadow-sm z-30 relative border-b border-slate-200">
        <div className="flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/250px-Emblem_of_India.svg.png" alt="Emblem" className="h-10 md:h-12" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1E293B] tracking-tight font-['Outfit',sans-serif]">SAMAADHAN</h1>
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">Citizen Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right mr-2">
            <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1 justify-end"><ShieldCheck className="w-3 h-3"/> Verified</span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
            {user?.name?.charAt(0) || 'C'}
          </div>
        </div>
      </div>

      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Abstract topographic/grid SVG pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
      </div>

      {/* --- BENTO BOX DASHBOARD --- */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 relative z-10">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name.split(' ')[0]}</span>.
          </h2>
          <p className="text-slate-500 font-medium mt-2">Here is your civic overview for Delhi NCT.</p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* HERO ACTION CARD (Span 2) */}
          <div className="md:col-span-2 relative bg-slate-900 rounded-[2rem] p-8 overflow-hidden group shadow-2xl shadow-blue-900/10 border border-slate-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587474260580-58955f191b79?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full w-fit mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-200">AI Neural Engine Active</span>
              </div>
              
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit',sans-serif] leading-tight mb-3">
                  Initiate Grievance <br/> Protocol
                </h3>
                <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
                  Our AI automatically scans your complaint, detects the category, and routes it to the exact nodal officer responsible.
                </p>
              </div>

              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                Report New Issue
              </button>
            </div>
            {/* Decorative Graphic */}
            <Activity className="absolute -bottom-10 -right-10 w-64 h-64 text-blue-500 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
          </div>

          {/* SIDE WIDGETS */}
          <div className="flex flex-col gap-6">
            {/* Civic Score Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-[2rem] p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
              <Award className="absolute -right-4 -top-4 w-24 h-24 text-emerald-500 opacity-5" />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Civic Trust Score</p>
              <div className="flex items-end gap-2 mb-2">
                <h4 className="text-4xl font-extrabold text-slate-800 font-['Outfit',sans-serif]">A+</h4>
                <span className="text-sm text-emerald-600 font-bold mb-1">Excellent</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Thank you for being an active citizen since {user?.joined}.</p>
            </div>

            {/* Delhi Live Widget */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live: New Delhi</p>
                <Wind className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 font-['Outfit',sans-serif]">AQI 142</span>
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">Moderate</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">MCD sweeping trucks active in your zone.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE GRIEVANCES DOCKET */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              Active Grievance Docket
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View Archive &rarr;</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myComplaints.length > 0 ? (
              myComplaints.map(c => <ComplaintCard key={c.id} complaint={c} />)
            ) : (
              <div className="col-span-full py-12 text-center bg-white/50 rounded-[2rem] border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">Docket is currently empty.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* FLOATING AI FORM MODAL (THE "OUT OF BOX" UI) */}
      {/* ========================================== */}
      
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeAndClearForm}></div>
          
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Samaadhan AI Assist</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Secure Protocol</p>
                </div>
              </div>
              <button onClick={closeAndClearForm} className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-8 overflow-y-auto">
              
              {/* STAGE 1: IDLE / INPUT */}
              {(status === 'idle' || (status === 'error' && !questions.length)) && (
                <form onSubmit={handleInitialSubmit} className="space-y-6 animate-in fade-in">
                  <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">Describe the Issue</h2>
                  <p className="text-sm text-slate-500 mb-6">Type naturally. Our engine will understand the context.</p>

                  <div className="space-y-5">
                    <div className="relative group">
                      <div className="absolute top-[14px] left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                        placeholder="Exact Location / Landmark"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute top-[14px] left-0 pl-4 flex items-start pointer-events-none">
                        <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <textarea
                        required rows={4} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium resize-none"
                        placeholder="What needs to be fixed? E.g., 'Huge pothole causing traffic jam...'"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <label className="cursor-pointer flex-1 bg-white py-3.5 px-4 border border-slate-200 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50 focus:outline-none flex justify-center items-center transition-all group">
                        <Camera className="w-5 h-5 mr-2 text-slate-400 group-hover:text-blue-600" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">{formData.image ? 'Image Attached. Click to Change' : 'Attach Photo Proof'}</span>
                        <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#1E293B] text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-lg mt-8 flex items-center justify-center gap-2 group">
                    Start AI Analysis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              {/* STAGE 2: CINEMATIC AI TERMINAL */}
              {status === 'analyzing' && (
                <div className="py-8 animate-in fade-in">
                  <div className="bg-slate-900 rounded-2xl p-6 font-mono text-xs sm:text-sm text-emerald-400 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[250px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 animate-[shimmer_2s_infinite]"></div>
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                      <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                      <span className="text-slate-400">root@samaadhan-ai:~# run_analysis.sh</span>
                    </div>
                    <div className="space-y-3">
                      {scanLogs.map((log, i) => (
                        <div key={i} className="animate-in fade-in slide-in-from-left-4">{log}</div>
                      ))}
                      <div className="animate-pulse">_</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: FOLLOW UP QUESTIONS & ROUTING CONFIRMATION */}
              {(status === 'questions' || status === 'submitting') && (
                <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden">
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500 opacity-[0.03] pointer-events-none" />
                    <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-1">Target Locked</h4>
                    <p className="text-slate-700 font-medium">
                      Routing to: <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded shadow-sm border border-blue-100">{formData.department}</span>
                    </p>
                  </div>

                  <div className="space-y-5">
                    <h4 className="font-bold text-slate-900 font-['Outfit',sans-serif]">Please provide a few more details:</h4>
                    {questions.map((q, idx) => (
                      <div key={idx}>
                        <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">{q}</label>
                        <input
                          required type="text" value={answers[idx].a}
                          onChange={(e) => { const newAns = [...answers]; newAns[idx].a = e.target.value; setAnswers(newAns); }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                          placeholder="Type answer here..."
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 mt-8 flex items-center justify-center gap-2">
                    {status === 'submitting' ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : <><CheckCircle className="w-5 h-5" /> Generate Official Docket</>}
                  </button>
                </form>
              )}

              {/* STAGE 4: DIGITAL RECEIPT (SUCCESS) */}
              {status === 'success' && submittedData && (
                <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-['Outfit',sans-serif]">Dispatched!</h2>
                  <p className="text-slate-500 mb-8 font-medium">Your grievance is now in the official government queue.</p>
                  
                  <div className="bg-slate-900 rounded-2xl p-6 text-left max-w-sm mx-auto shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 border-b border-slate-800 pb-2">Docket Receipt</span>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Tracking ID</p>
                        <p className="font-mono text-lg font-bold text-white">{submittedData.id}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Assigned</p>
                          <p className="text-sm font-bold text-blue-400 leading-tight">{submittedData.department}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Category</p>
                          <p className="text-sm font-bold text-emerald-400">{submittedData.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={closeAndClearForm} className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-800 underline">
                    Return to Dashboard
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Required for button sweep animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
};

export default CitizenPortal;