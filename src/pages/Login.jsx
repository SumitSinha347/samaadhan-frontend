import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Building, 
  AlertCircle, 
  Landmark, 
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  MonitorSmartphone,
  FileBadge2,
  Globe2
} from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { login, signup } from '../api';
import digitalIndiaLogo from './digital_india_log.png';
import azadiLogo from './azadi_ka_amritMAhotsav.png';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignup) {
        const { data } = await signup({ name, email, password, role: 'citizen' });
        loginAuth(data);
        navigate('/citizen');
      } else {
        const { data } = await login({ email, password });
        loginAuth(data);
        
        if (data.role === 'admin') navigate('/admin');
        else if (data.role === 'department') navigate('/department');
        else navigate('/citizen');
      }
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      setError(typeof apiMessage === 'string' ? apiMessage : (isSignup ? 'Failed to create account.' : 'Invalid credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['DM_Sans',sans-serif] bg-slate-50 overflow-x-hidden">
      
      {/* --- OFFICIAL TOP BAR --- */}
      <div className="bg-[#1E293B] text-white py-1.5 px-4 md:px-8 flex justify-between items-center text-[11px] font-medium tracking-wide">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">GOVERNMENT OF NCT OF DELHI | दिल्ली सरकार</span>
          <span className="sm:hidden">DELHI GOVT</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#main-content" className="hover:text-blue-300 transition-colors hidden sm:inline">Skip to Main Content</a>
          <div className="flex items-center gap-2 border-l border-slate-600 pl-4">
            <button className="hover:text-blue-300">A-</button>
            <button className="hover:text-blue-300">A</button>
            <button className="hover:text-blue-300">A+</button>
          </div>
          <div className="border-l border-slate-600 pl-4">
            <select className="bg-transparent text-white border-none outline-none cursor-pointer hover:text-blue-300">
              <option className="text-black">English</option>
              <option className="text-black">हिन्दी</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- WHITE LOGO HEADER --- */}
      <div className="bg-white py-3 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center shadow-sm z-20 relative">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Emblem of India" 
            className="h-12 md:h-16"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight font-['Outfit',sans-serif]">
              SAMAADHAN
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-[0.15em]">
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
            className="h-12 md:h-16 object-contain"
          />
        </div>
      </div>

      {/* --- MAIN SPLIT LAYOUT --- */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* LEFT SIDE: VIBRANT HERO / CIVIC IMAGERY */}
        <div className="relative w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-center overflow-hidden bg-slate-900 min-h-[500px] lg:min-h-0">
          
          {/* Background Image & Overlays */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1587474260580-58955f191b79?auto=format&fit=crop&q=80&w=2000")' }}
          />
          {/* Vibrant Gradient Mesh Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#1E293B]/95 via-blue-900/80 to-emerald-900/90 mix-blend-multiply"></div>
          {/* Saffron subtle glow */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-500/20 to-transparent z-10 pointer-events-none"></div>

          {/* Rotating Ashoka Chakra Watermark */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg" 
            alt="Chakra"
            className="absolute -right-32 -bottom-32 w-[600px] h-[600px] opacity-[0.07] z-10 pointer-events-none animate-[spin_60s_linear_infinite]"
          />

          {/* Hero Content */}
          <div className="relative z-20 p-8 md:p-16 flex flex-col text-white h-full justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-fit mb-6 shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-50">Samaadhan AI Network: Online</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight font-['Outfit',sans-serif] mb-6 drop-shadow-lg">
              Empowering Delhi with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-emerald-400">
                Transparent Governance.
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-blue-50 max-w-xl font-medium leading-relaxed mb-10 drop-shadow-md">
              Report issues instantly. Track progress in real-time. Our advanced AI ensures your grievances reach the right official within seconds. 
              <br/><br/>
              <span className="font-bold italic">"Service at your doorstep."</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mt-auto">
              <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl">
                <MonitorSmartphone className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold">100% Digital Workflow</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl">
                <FileBadge2 className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-semibold">Verified Accountability</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: GLASSMORPHIC LOGIN */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-slate-50 flex items-center justify-center p-6 md:p-12 relative z-20 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
            
            {/* Subtle AI decorative blur inside the card */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                {isSignup ? 'Citizen Registration' : 'Portal Login'}
              </h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                {isSignup ? 'Join the Digital Delhi initiative.' : 'Access your personalized dashboard.'}
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8 relative z-10 border border-slate-200">
              <button 
                type="button"
                onClick={() => { setIsSignup(false); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${!isSignup ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setIsSignup(true); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${isSignup ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-start text-sm border border-rose-100 shadow-sm animate-in fade-in duration-300">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              
              {isSignup && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                    placeholder="Full Name as per Aadhaar"
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  placeholder="Registered Email ID"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  placeholder="Secure Password"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E293B] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-slate-900/10 flex items-center justify-center mt-6 disabled:opacity-70 group"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2 tracking-wide">
                    {isSignup ? 'Proceed to Registration' : 'Secure Login'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            {!isSignup && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">Quick Access Demos</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => { setEmail('admin@pscrm.com'); setPassword('admin123'); }}
                    className="flex flex-col items-center justify-center py-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-lg transition-all group"
                  >
                    <ShieldAlert className="w-4 h-4 text-slate-500 group-hover:text-blue-600 mb-1 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Admin</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEmail('water@pscrm.com'); setPassword('dept123'); }}
                    className="flex flex-col items-center justify-center py-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 rounded-lg transition-all group"
                  >
                    <Building className="w-4 h-4 text-slate-500 group-hover:text-orange-500 mb-1 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Official</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEmail('citizen1@pscrm.com'); setPassword('user123'); }}
                    className="flex flex-col items-center justify-center py-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-lg transition-all group"
                  >
                    <Users className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 mb-1 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Citizen</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- INTEGRATIONS FOOTER STRIP --- */}
      <div className="bg-white border-t border-slate-200 py-3 px-6 hidden md:flex items-center justify-center gap-12 text-slate-500 relative z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <span className="text-[11px] font-bold uppercase tracking-widest border-r border-slate-200 pr-8">Integrated Services</span>
        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
          <Globe2 className="w-4 h-4" />
          <span className="text-sm font-semibold">india.gov.in</span>
        </div>
        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
          <Landmark className="w-4 h-4" />
          <span className="text-sm font-semibold">e-District Delhi</span>
        </div>
        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
          <FileBadge2 className="w-4 h-4" />
          <span className="text-sm font-semibold">DigiLocker</span>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
