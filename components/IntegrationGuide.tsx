import React, { useState } from 'react';
import { Copy, Terminal, ExternalLink, HelpCircle, Save, Check, Globe, Server, Key, AlertTriangle } from 'lucide-react';

interface IntegrationGuideProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  sheetId: string;
  setSheetId: (id: string) => void;
  instagramToken: string;
  setInstagramToken: (token: string) => void;
}

const INTEGRATION_CODE = `
// FILE: server.js
// HOSTING: Render.com / Railway / Heroku
// IMPORTANT: Add 'Environment Variables' in your hosting settings:
// API_KEY (Your Gemini Key)
// IG_TOKEN (Your Instagram Token)
// SHEET_ID (Your Google Sheet ID)

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(express.json());

// 1. Credentials from Environment Variables (Hosting Settings)
const GOOGLE_API_KEY = process.env.API_KEY; 
const IG_TOKEN = process.env.IG_TOKEN;
const SHEET_ID = process.env.SHEET_ID;

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

// 2. Verification Endpoint for Instagram
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    if (mode === 'subscribe' && token === 'adarsh_realtor_verify_123') {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// 3. Handle Incoming Messages
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    if (body.object === 'instagram') {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];
      
      if (messaging && messaging.message) {
        const senderId = messaging.sender.id;
        const messageText = messaging.message.text;

        // A. Generate AI Response
        const chatResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: \`You are Adarsh Realtor AI. User said: "\${messageText}". Reply politely in under 30 words asking for Name/Phone if missing.\`
        });
        
        const aiText = chatResponse.text;

        // B. Send back to Instagram (Mock function for demo)
        // In real deployment, you use axios/fetch to post to graph.facebook.com
        console.log(\`Replied to \${senderId}: \${aiText}\`);
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server is running on port \${PORT}\`));
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
    alert('Backend Server code copied!');
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* INTRO: THE BIG PICTURE */}
      <div className="bg-slate-900 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🚀 Setup Overview
        </h2>
        <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertTriangle className="text-yellow-400 shrink-0 mt-1" size={20} />
          <p className="text-sm text-blue-100">
            <strong>Blank Screen Issue Fixed:</strong> Agar pehle website blank aa rahi thi, to ab theek ho jayegi. Maine code mein zaruri script add kar di hai.
          </p>
        </div>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          Ye pura system 2 hisso (parts) mein chalta hai. Dono zaroori hain:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 p-5 rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg"><Globe size={20} /></div>
              <h3 className="font-bold">Part 1: Dashboard Website</h3>
            </div>
            <p className="text-sm text-slate-300">
              Ye wo website hai jo abhi aap dekh rahe hain.
              <br/><br/>
              <strong>Kaam:</strong> Leads dekhna aur Simulator chalana.
              <br/>
              <strong>Status:</strong> ✅ Hosted on Netlify (Ready)
            </p>
          </div>

          <div className="bg-white/10 p-5 rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500 rounded-lg"><Server size={20} /></div>
              <h3 className="font-bold">Part 2: Automation Server</h3>
            </div>
            <p className="text-sm text-slate-300">
              Ye code background mein chalta hai (Invisible).
              <br/><br/>
              <strong>Kaam:</strong> Instagram se message lena aur reply dena.
              <br/>
              <strong>Status:</strong> ⏳ Needs Hosting (Render/Railway)
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: CONFIGURATION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Key size={20} className="text-slate-400" />
            Step 1: Configure Keys
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Yahan apni API keys save karein taake Simulator kaam kare.
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Gemini Key */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key (Required)</label>
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
          </div>

          {/* Instagram Token */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram Access Token (Optional for Simulator)</label>
            <input 
              type="password" 
              value={instagramToken}
              onChange={(e) => setInstagramToken(e.target.value)}
              placeholder="EAA..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          {/* Google Sheet ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Google Sheet ID (Optional for Simulator)</label>
            <input 
              type="text" 
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="1BxiMvs..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all ${saved ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saved ? 'Saved!' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: SERVER CODE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
         <div className="p-6 border-b border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Terminal size={20} className="text-slate-400" />
              Step 2: Backend Code (Automation Server)
           </h3>
           <p className="text-slate-500 text-sm mt-1">
             Ye code sirf tab chahiye jab aap Instagram Automation ko live (24/7) karna chahein. 
             Isay <strong>Render.com</strong> par host karna hoga.
           </p>
         </div>

        <div 
          className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => setShowCode(!showCode)}
        >
          <span className="text-sm font-medium text-slate-600">
            {showCode ? 'Hide Backend Code' : 'View Backend Code'}
          </span>
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">Node.js</span>
        </div>

        {showCode && (
          <div className="bg-slate-900">
             <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800 bg-slate-800/50">
               <span className="text-xs text-slate-400 font-mono">server.js</span>
               <button 
                  onClick={copyToClipboard}
                  className="text-xs flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <Copy size={12} /> Copy Code
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