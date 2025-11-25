import React, { useState } from 'react';
import { LayoutDashboard, MessageSquareText, Settings, Database, SlidersHorizontal } from 'lucide-react';
import BotSimulator from './components/BotSimulator';
import LeadsManager from './components/LeadsManager';
import IntegrationGuide from './components/IntegrationGuide';
import { Lead } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'leads' | 'setup'>('dashboard');
  
  // Centralized State for Configuration
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [sheetId, setSheetId] = useState('');
  const [instagramToken, setInstagramToken] = useState('');
  
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleLeadDetected = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Adarsh Realtor
          </h1>
          <p className="text-xs text-slate-400 mt-1">Automation Hub</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'simulator' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <MessageSquareText size={18} />
            Bot Simulator
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leads' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Database size={18} />
            Leads
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase mb-2">Admin</p>
            <button 
              onClick={() => setActiveTab('setup')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'setup' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <SlidersHorizontal size={18} />
              Setup
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-sm font-medium">Adarsh Admin</p>
              <p className="text-xs text-slate-500">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-50 p-4 flex justify-between items-center">
        <span className="font-bold">Adarsh Realtor</span>
        <button className="text-white" onClick={() => setActiveTab('setup')}>Setup</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto mt-14 md:mt-0">
        
        {/* API Key Warning Banner */}
        {!apiKey && activeTab !== 'setup' && (
          <button 
            onClick={() => setActiveTab('setup')}
            className="w-full mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center hover:bg-red-100 transition-colors"
          >
            <div>
              <p className="font-bold">⚠️ Setup Required</p>
              <p className="text-sm">Gemini API Key missing. Click here to configure.</p>
            </div>
            <span className="font-semibold text-sm underline">Go to Setup &rarr;</span>
          </button>
        )}

        {/* Dynamic Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Automation Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">Total Leads Captured</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{leads.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">Bot Status</p>
                  <p className="text-3xl font-bold text-green-600 mt-2 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${apiKey ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    {apiKey ? 'Active' : 'Offline'}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">Google Sheet Sync</p>
                  <p className={`text-3xl font-bold mt-2 ${sheetId ? 'text-blue-600' : 'text-slate-400'}`}>
                    {sheetId ? 'Connected' : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Mini view of leads */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold mb-4">Recent Leads</h3>
                    {leads.slice(0, 3).map(lead => (
                       <div key={lead.id} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100">
                          <div>
                            <p className="font-medium text-slate-800">{lead.name}</p>
                            <p className="text-xs text-slate-500">{lead.requirement}</p>
                          </div>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Synced</span>
                       </div>
                    ))}
                    {leads.length === 0 && <p className="text-slate-400 text-sm italic">No leads captured yet.</p>}
                 </div>

                 {/* System Health */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold mb-4">Configuration Health</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700">Gemini API Key</span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {apiKey ? 'Configured' : 'Missing'}
                          </span>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700">Google Sheet ID</span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${sheetId ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {sheetId ? 'Configured' : 'Not Linked'}
                          </span>
                       </div>
                       <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700">Instagram Token</span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${instagramToken ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {instagramToken ? 'Configured' : 'Pending'}
                          </span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="h-full">
               <h2 className="text-2xl font-bold text-slate-800 mb-6">Bot Logic Simulator</h2>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <BotSimulator apiKey={apiKey} onLeadDetected={handleLeadDetected} />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                      <h4 className="font-bold text-blue-800 mb-2">How it works</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        This simulator uses the <strong>Gemini API Key</strong> you saved in the Setup tab.
                      </p>
                      <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                         <li>The bot acts like an Instagram DM agent.</li>
                         <li>It collects Name, Phone, and Requirement.</li>
                         <li>Once collected, it adds the lead to the table.</li>
                      </ul>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="h-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Lead Database</h2>
              <LeadsManager leads={leads} />
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="h-full">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings & Configuration</h2>
              <IntegrationGuide 
                apiKey={apiKey} 
                setApiKey={setApiKey}
                sheetId={sheetId}
                setSheetId={setSheetId}
                instagramToken={instagramToken}
                setInstagramToken={setInstagramToken}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;