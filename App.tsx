import React, { useState } from 'react';
import { LayoutDashboard, MessageSquareText, Settings, Database, Code2 } from 'lucide-react';
import BotSimulator from './components/BotSimulator';
import LeadsManager from './components/LeadsManager';
import IntegrationGuide from './components/IntegrationGuide';
import { Lead } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'leads' | 'setup'>('dashboard');
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [sheetId, setSheetId] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleLeadDetected = (lead: Lead) => {
    // Check if duplicate logic could go here
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
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase mb-2">Development</p>
            <button 
              onClick={() => setActiveTab('setup')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'setup' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Code2 size={18} />
              Setup Guide
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
        <button className="text-white" onClick={() => alert('Please use desktop for full configuration.')}>Menu</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto mt-14 md:mt-0">
        
        {/* API Key Banner if missing */}
        {!apiKey && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold">Setup Required</p>
              <p className="text-sm">Please enter your Gemini API Key to enable the AI features.</p>
            </div>
            <input 
              type="password" 
              placeholder="Paste API Key Here" 
              className="px-3 py-2 border rounded text-sm w-64"
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
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
                  <p className="text-sm text-slate-500 font-medium">Bot Response Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">100%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">Status</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                    Active
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Mini view of leads */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold mb-4">Recent Activity</h3>
                    {leads.slice(0, 3).map(lead => (
                       <div key={lead.id} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100">
                          <div>
                            <p className="font-medium text-slate-800">{lead.name}</p>
                            <p className="text-xs text-slate-500">{lead.requirement}</p>
                          </div>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Captured</span>
                       </div>
                    ))}
                    {leads.length === 0 && <p className="text-slate-400 text-sm">No recent activity.</p>}
                 </div>

                 {/* Configuration Status */}
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold mb-4">System Health</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Gemini AI Engine</span>
                          <span className={`text-xs px-2 py-1 rounded ${apiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {apiKey ? 'Connected' : 'Disconnected'}
                          </span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Google Sheets Link</span>
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Simulated</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Instagram Webhook</span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">Pending Setup</span>
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
                      <h4 className="font-bold text-blue-800 mb-2">How to test</h4>
                      <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                        <li>Start by saying "Hi" or "I need a flat".</li>
                        <li>The bot will ask for your Name.</li>
                        <li>Then it will ask for your Phone.</li>
                        <li>Finally, it confirms your requirement.</li>
                        <li>Once complete, the lead appears in the database.</li>
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
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Deployment Guide</h2>
              <IntegrationGuide />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;