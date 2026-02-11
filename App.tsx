
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from './types';
import { getDbUsers, updateUserInDb, saveDbUsers } from './lib/mockDb';
import { Input, TextArea } from './components/Input';
import { DataTable } from './components/DataTable';

// --- Icons ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>,
  Automation: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Admin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
};

type Page = 'login' | 'signup' | 'dashboard' | 'admin' | 'settings' | 'automation';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPage]);

  const handleLogin = (email: string, pass: string) => {
    if (email === 'nbalasurya12345@gmail.com' && pass === 'surya143') {
      const users = getDbUsers();
      const admin = users.find(u => u.email === email);
      if (admin) {
        setUser(admin);
        setCurrentPage('admin');
        updateUserInDb(admin.id, { isOnline: true, lastLogin: new Date().toISOString() });
        return;
      }
    }

    const users = getDbUsers();
    const found = users.find(u => u.email === email);
    if (found) {
      if (found.isBlocked) {
        alert("Access Restricted by Admin.");
        return;
      }
      setUser(found);
      setCurrentPage('dashboard');
      updateUserInDb(found.id, { isOnline: true, lastLogin: new Date().toISOString() });
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleSignup = (name: string, email: string, pass: string) => {
    const users = getDbUsers();
    if (users.some(u => u.email === email)) {
      alert("User already exists.");
      return;
    }
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'user',
      provider: 'gemini',
      isBlocked: false,
      tokenUsage: 0,
      lastLogin: new Date().toISOString(),
      isOnline: true
    };
    saveDbUsers([...users, newUser]);
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const logout = () => {
    if (user) updateUserInDb(user.id, { isOnline: false });
    setUser(null);
    setCurrentPage('login');
  };

  // --- Layout Components ---

  const Sidebar = () => (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#395886]/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed lg:relative z-50 h-screen bg-[#395886] transition-transform duration-300 flex flex-col w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-xl text-[#395886] shadow-xl">S</div>
            <span className="font-extrabold text-lg text-white tracking-tight">SheetAutomation</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard, show: true },
            { id: 'automation', label: 'AI Automation', icon: Icons.Automation, show: true },
            { id: 'admin', label: 'Admin Panel', icon: Icons.Admin, show: user?.role === 'admin' },
            { id: 'settings', label: 'Settings', icon: Icons.Settings, show: true },
          ].filter(i => i.show).map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all-300 ${
                currentPage === item.id 
                  ? 'bg-[#638ECB] text-white shadow-lg shadow-[#000000]/10' 
                  : 'text-white/70 hover:bg-[#638ECB]/20 hover:text-white'
              }`}
            >
              <item.icon />
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-white/70 hover:bg-rose-500 hover:text-white transition-all-300 active:scale-95"
          >
            <Icons.Logout />
            <span className="text-sm font-semibold tracking-wide">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );

  const LoginView = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#395886] to-[#8AAEE0]">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2 tracking-tighter text-[#395886]">SheetAutomation<span className="text-[#638ECB]">.ai</span></h1>
            <p className="text-[#395886]/60 text-sm font-medium">Enterprise Intelligence Reimagined</p>
          </div>
          <div className="space-y-6">
            <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" />
            <Input label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" />
            <button onClick={() => handleLogin(email, pass)} className="w-full bg-[#395886] hover:bg-[#638ECB] py-4 rounded-xl font-bold text-[#F0F3FA] shadow-xl shadow-[#395886]/20 transition-all-300 active:scale-[0.98] mt-4">Sign In</button>
          </div>
          <p className="mt-10 text-center text-xs text-[#395886]/50">
            Need access? <button onClick={() => setCurrentPage('signup')} className="text-[#395886] font-bold hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    );
  };

  const SignupView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#395886] to-[#8AAEE0]">
        <div className="w-full max-w-md bg-white rounded-3xl p-12 shadow-2xl">
          <h2 className="text-2xl font-black mb-8 text-[#395886] text-center">Join SheetAutomation</h2>
          <div className="space-y-6">
              <Input label="Full Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Smith" />
              <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="alex@company.com" />
              <Input label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" />
          </div>
          <button onClick={() => handleSignup(name, email, pass)} className="w-full bg-[#395886] hover:bg-[#638ECB] py-4 rounded-xl font-bold text-[#F0F3FA] shadow-xl shadow-[#395886]/20 transition-all-300 mt-8">Register Now</button>
          <p className="mt-8 text-center text-xs text-[#395886]/50">Member already? <button onClick={() => setCurrentPage('login')} className="text-[#395886] font-bold">Sign in</button></p>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-[#395886] tracking-tight">Overview</h2>
        <p className="text-[#638ECB] text-sm font-semibold uppercase tracking-wider">Operational Health Status</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="saas-card p-8 space-y-4">
          <p className="text-[11px] font-black text-[#638ECB] uppercase tracking-[0.15em]">Computing Units Used</p>
          <p className="text-4xl font-black text-[#395886]">{user?.tokenUsage.toLocaleString()}</p>
          <div className="w-full bg-[#F0F3FA] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#395886] h-full transition-all duration-1000" style={{ width: `${Math.min((user?.tokenUsage || 0) / 100000 * 100, 100)}%` }} />
          </div>
          <p className="text-[10px] font-bold text-[#638ECB]">100,000 UNIT LIMIT</p>
        </div>

        <div className="saas-card p-8 space-y-4 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-black text-[#638ECB] uppercase tracking-[0.15em]">AI Model Context</p>
            <p className="text-4xl font-black text-[#395886]">Gemini 3</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Active & Ready</span>
          </div>
        </div>

        <div className="saas-card p-8 flex flex-col items-start justify-center gap-4 bg-[#D5DEEF]/40 border-none">
           <div>
             <h3 className="text-xl font-black text-[#395886]">New Synthesis</h3>
             <p className="text-sm text-[#395886]/70">Generate precise dataset batches in real-time.</p>
           </div>
           <button onClick={()=>setCurrentPage('automation')} className="bg-[#395886] text-[#F0F3FA] px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all-300">Launch Pipeline</button>
        </div>
      </div>

      <div className="saas-card p-12 text-center space-y-6">
         <div className="w-16 h-16 bg-[#F0F3FA] rounded-3xl flex items-center justify-center mx-auto text-[#395886] shadow-sm">
            <Icons.Dashboard />
         </div>
         <div className="max-w-md mx-auto">
           <h3 className="text-2xl font-black text-[#395886]">No Connected Streams</h3>
           <p className="text-[#638ECB] text-sm mt-3 font-medium">Link a Google Sheet in the automation tab to begin tracking synchronization events and data flow metrics.</p>
         </div>
      </div>
    </div>
  );

  const AutomationView = () => {
    const [fields, setFields] = useState('First Name, Last Name, Organization, Role, Email, Bio');
    const [rowCount, setRowCount] = useState(5);
    const [context, setContext] = useState('B2B Tech Startup Executives in the UK');
    const [url, setUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [mode, setMode] = useState<'ai' | 'link'>('ai');

    const handleRun = async () => {
      if (!user) return;
      if (user.tokenUsage >= 100000) {
        alert("Unit limit exceeded. Please contact system admin.");
        return;
      }
      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Generate a dataset of ${rowCount} items. Fields: ${fields}. Context: ${context}. Respond strictly in JSON format.`,
          config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || "[]");
        setPreviewData(data);
        updateUserInDb(user.id, { tokenUsage: user.tokenUsage + (response.text?.length || 0) / 4 });
      } catch (e) {
        alert("Synthesis failed. Check connectivity.");
      } finally {
        setIsGenerating(false);
      }
    };

    const handleExtract = async () => {
      if (!url) return;
      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze data at ${url}. Extract items for these fields: Name, Title, Insight. Return as JSON array.`,
          config: { responseMimeType: 'application/json' }
        });
        setPreviewData(JSON.parse(response.text || "[]"));
      } catch (e) {
        alert("Extraction protocol failed.");
      } finally {
        setIsGenerating(false);
      }
    };

    const handleExportExcel = () => {
      if (previewData.length === 0) return;
      
      const headers = Object.keys(previewData[0]);
      const csvContent = [
        headers.join(','),
        ...previewData.map(row => 
          headers.map(fieldName => {
            let value = row[fieldName] === null || row[fieldName] === undefined ? '' : String(row[fieldName]);
            // Escape double quotes by doubling them, then wrap the value in double quotes if it contains commas or quotes
            const escaped = value.replace(/"/g, '""');
            if (escaped.search(/("|,|\n)/g) >= 0) {
              return `"${escaped}"`;
            }
            return escaped;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sheetautomation_export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500 pb-10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-[#395886] tracking-tight">Synthesis Console</h2>
            <p className="text-[#638ECB] text-sm font-semibold uppercase tracking-widest">Algorithmic Data Generation</p>
          </div>
          <div className="flex bg-[#D5DEEF]/40 rounded-2xl p-1.5 border border-[#D5DEEF] w-fit">
            <button onClick={()=>setMode('ai')} className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all-300 ${mode==='ai' ? 'bg-white text-[#395886] shadow-sm' : 'text-[#395886]/40'}`}>Synthesizer</button>
            <button onClick={()=>setMode('link')} className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all-300 ${mode==='link' ? 'bg-white text-[#395886] shadow-sm' : 'text-[#395886]/40'}`}>Extractor</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-8">
            <div className="saas-card p-8 space-y-6">
              {mode === 'ai' ? (
                <>
                  <TextArea label="Synthesis Parameters" value={fields} onChange={e=>setFields(e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Volume" type="number" value={rowCount} onChange={e=>setRowCount(parseInt(e.target.value))} />
                    <div className="flex flex-col justify-end">
                      <button onClick={handleRun} disabled={isGenerating} className="w-full bg-[#395886] h-12 rounded-xl font-bold text-xs text-white transition-all-300 active:scale-95 shadow-lg shadow-[#395886]/20">
                        {isGenerating ? 'Compiling...' : 'Generate'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <Input label="External URL" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" />
                  <button onClick={handleExtract} disabled={isGenerating} className="w-full bg-[#8AAEE0] hover:bg-[#638ECB] h-14 rounded-xl font-bold text-sm text-[#395886] transition-all-300 shadow-sm">
                    {isGenerating ? 'Analyzing...' : 'Execute Extraction'}
                  </button>
                </div>
              )}
              <Input label="Operational Context" value={context} onChange={e=>setContext(e.target.value)} />
            </div>

            <div className="saas-card p-8 space-y-6">
               <h3 className="text-sm font-bold text-[#395886] flex items-center gap-2">Output Target</h3>
               <Input label="Google Sheet ID" placeholder="1vW_..." />
               <div className="border-2 border-dashed border-[#D5DEEF] rounded-2xl p-6 text-center hover:border-[#638ECB] transition-all-300 cursor-pointer group">
                  <span className="text-[11px] text-[#395886]/40 font-black uppercase tracking-widest group-hover:text-[#638ECB]">Cloud Credentials JSON</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="saas-card min-h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-[#D5DEEF] flex items-center justify-between bg-[#F0F3FA]/50">
                <span className="text-[11px] font-black uppercase text-[#395886] tracking-[0.2em]">Validated Preview</span>
                {previewData.length > 0 && (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleExportExcel}
                      className="flex items-center gap-2 text-[10px] font-black uppercase bg-white border border-[#D5DEEF] text-[#395886] px-4 py-2.5 rounded-xl shadow-sm transition-all-300 hover:bg-[#F0F3FA] active:scale-95"
                    >
                      <Icons.Download />
                      Export Excel
                    </button>
                    <button className="text-[10px] font-black uppercase bg-[#395886] text-white px-6 py-2.5 rounded-xl shadow-lg transition-all-300 active:scale-95">Push to Production</button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {previewData.length > 0 ? (
                  <DataTable data={previewData} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20 text-[#395886]">
                    <Icons.Automation />
                    <p className="text-sm font-black uppercase tracking-widest">Buffer Empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminView = () => {
    const [users, setUsers] = useState<UserProfile[]>(getDbUsers());
    const toggleBlock = (id: string) => {
      const updated = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
      setUsers(updated);
      saveDbUsers(updated);
    };
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h2 className="text-3xl font-black text-[#395886] tracking-tight">Admin Console</h2>
          <p className="text-[#638ECB] text-sm font-semibold uppercase tracking-widest">User Governance & Quota Policy</p>
        </header>
        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-[#F0F3FA] border-b border-[#D5DEEF]">
                <tr>
                  <th className="p-6 font-black uppercase text-[#395886] text-[10px] tracking-widest">Identified User</th>
                  <th className="p-6 font-black uppercase text-[#395886] text-[10px] tracking-widest">Usage Metric</th>
                  <th className="p-6 font-black uppercase text-[#395886] text-[10px] tracking-widest">Network Status</th>
                  <th className="p-6 font-black uppercase text-[#395886] text-[10px] tracking-widest">Control Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5DEEF] bg-white">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#F0F3FA]/50 transition-all-300">
                    <td className="p-6">
                      <p className="font-bold text-[#395886]">{u.name}</p>
                      <p className="text-[11px] text-[#395886]/50 font-medium">{u.email}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#395886]">{u.tokenUsage.toLocaleString()}</span>
                        <div className="w-24 h-1.5 bg-[#F0F3FA] rounded-full overflow-hidden">
                          <div className="bg-[#395886] h-full" style={{ width: `${Math.min((u.tokenUsage / 100000) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.isBlocked ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {u.isBlocked ? 'Restricted' : 'Authenticated'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <button onClick={()=>toggleBlock(u.id)} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all-300 shadow-sm ${u.isBlocked ? 'bg-[#638ECB] text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white'}`}>
                          {u.isBlocked ? 'Restore Access' : 'Restrict Access'}
                        </button>
                        <button className="px-4 py-2 bg-[#D5DEEF] text-[#395886] rounded-xl text-[10px] font-bold hover:bg-[#395886] hover:text-white transition-all-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (currentPage === 'login') return <LoginView />;
  if (currentPage === 'signup') return <SignupView />;

  return (
    <div className="min-h-screen flex bg-[#F0F3FA]">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Navbar Overlay */}
        <header className="h-20 bg-white border-b border-[#D5DEEF] px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 bg-[#F0F3FA] text-[#395886] rounded-xl lg:hidden shadow-sm">
              <Icons.Menu />
            </button>
            <div className="hidden lg:flex items-center gap-2">
               <span className="text-[10px] font-black text-[#638ECB] uppercase tracking-[0.3em]">Environment:</span>
               <span className="text-[10px] font-black text-[#395886] uppercase tracking-[0.3em]">Production v1.5.0</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] font-black text-[#638ECB] uppercase tracking-tighter">Remaining Quota</span>
               <span className="text-sm font-black text-[#395886]">{(100000 - (user?.tokenUsage || 0)).toLocaleString()} Units</span>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-[#395886] flex items-center justify-center font-black text-white shadow-xl">
              {user?.name[0]}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {currentPage === 'dashboard' && <DashboardView />}
            {currentPage === 'admin' && <AdminView />}
            {currentPage === 'automation' && <AutomationView />}
            {currentPage === 'settings' && <div className="p-32 text-center text-[#395886]/10 font-black uppercase tracking-[1em] italic">Synchronizing Preferences...</div>}
          </div>
          
          <footer className="mt-20 py-12 border-t border-[#D5DEEF] flex flex-col items-center gap-3 opacity-30">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#395886]">SheetAutomation.ai • Developed by Surya</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
