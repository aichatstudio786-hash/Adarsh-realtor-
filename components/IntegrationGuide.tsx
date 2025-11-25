import React, { useState } from 'react';
import { Copy, Terminal, ExternalLink, HelpCircle, Save, Check } from 'lucide-react';

interface IntegrationGuideProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  sheetId: string;
  setSheetId: (id: string) => void;
  instagramToken: string;
  setInstagramToken: (token: string) => void;
}

const INTEGRATION_CODE = `
// NOTE: Ye code aapko Render ya Vercel pe host karna hoga.
// Ye website sirf "Control Panel" hai. Instagram ko 24/7 server chahiye.

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(express.json());

// Ye values aapke setup tab se ayengi
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const IG_TOKEN = process.env.IG_TOKEN;
const SHEET_ID = process.env.SHEET_ID;

// 1. Instagram Webhook Verification (One time setup)
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'adarsh_realtor_verify_123') {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// 2. Message Aane Par Kya Hoga
app.post('/webhook', async (req, res) => {
  const event = req.body.entry?.[0]?.messaging?.[0];
  
  if (event && event.message?.text) {
    const senderId = event.sender.id;
    const userMessage = event.message.text;
    
    // Gemini se reply generate karein
    const aiResponse = await generateReply(userMessage);
    
    // Instagram par wapis bhejein
    await sendToInstagram(senderId, aiResponse);
  }
  res.sendStatus(200);
});

// ... Helper functions for Gemini and Instagram API ...
`;

const IntegrationGuide: React.FC<IntegrationGuideProps> = ({
  apiKey, setApiKey,
  sheetId, setSheetId,
  instagramToken, setInstagramToken
}) => {
  const [showCode, setShowCode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(INTEGRATION_CODE);
    alert('Server code copied!');
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* SECTION 1: CONFIGURATION FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">1. Keys & IDs (Configuration)</h3>
          <p className="text-slate-500 text-sm">Yahan apni details daalein taake app sahi se kaam kare.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Gemini Key */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
            <div className="flex gap-2">
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex items-center gap-2 text-sm">
                <ExternalLink size={14} /> Get Key
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-1">Ye bot ke dimagh (AI) ke liye zaroori hai.</p>
          </div>

          {/* Instagram Token */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram Access Token</label>
            <input 
              type="password" 
              value={instagramToken}
              onChange={(e) => setInstagramToken(e.target.value)}
              placeholder="EAA..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Meta Developers portal se milega (Graph API).</p>
          </div>

          {/* Google Sheet ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Google Sheet ID</label>
            <input 
              type="text" 
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="1BxiMvs..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Apne Google Sheet URL ke beech ka code.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all ${saved ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saved ? 'Settings Saved' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: EXPLANATION (The "Why") */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-3">
          <HelpCircle size={20} />
          Ye Server Code kyu chahiye? (Explanation)
        </h3>
        <div className="space-y-3 text-amber-800 text-sm leading-relaxed">
          <p>
            <strong>Bhai, scene ye hai:</strong> Aapne jo abhi ye website kholi hai, ye aapka <strong>Dashboard</strong> hai. 
            Yahan aap leads dekh sakte ho aur bot ko test kar sakte ho.
          </p>
          <p>
            Lekin, jab koi customer raat ko 3 baje Instagram pe message karega, to ye website to aapke laptop pe band hogi. 
            Isliye humein ek <strong>"Chowkidaar" (Server)</strong> chahiye jo 24 ghante internet par online rahe.
          </p>
          <p>
            Niche jo code diya hai, wo us "Chowkidaar" ka code hai. Ye code Instagram ke messages sunega, 
            Gemini se answer puchega, aur customer ko reply karega.
          </p>
          <p className="font-semibold mt-2">
            Is code ko copy karke aapko Render.com ya Vercel par "Deploy" karna padega. Wo free services hain.
          </p>
        </div>
      </div>

      {/* SECTION 3: THE SERVER CODE */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div 
          className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => setShowCode(!showCode)}
        >
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Terminal size={18} />
            Server Code Snippet
          </h3>
          <span className="text-xs text-blue-600 font-medium">
            {showCode ? 'Hide Code' : 'Show Code'}
          </span>
        </div>

        {showCode && (
          <div className="bg-slate-900">
             <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800 bg-slate-800/50">
               <span className="text-xs text-slate-400 font-mono">index.js / server.js</span>
               <button 
                  onClick={copyToClipboard}
                  className="text-xs flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <Copy size={12} /> Copy
                </button>
             </div>
             <pre className="p-4 overflow-x-auto text-xs font-mono text-blue-300 leading-relaxed">
               {INTEGRATION_CODE}
             </pre>
          </div>
        )}
      </div>

    </div>
  );
};

export default IntegrationGuide;