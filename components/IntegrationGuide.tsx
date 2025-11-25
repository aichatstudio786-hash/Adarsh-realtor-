import React from 'react';
import { Copy, Terminal, ExternalLink, AlertTriangle } from 'lucide-react';

const INTEGRATION_CODE = `
// server.js (Node.js) - HOST THIS ON RENDER/HEROKU/VERCEL
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { google } = require('googleapis');
const app = express();
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const IG_TOKEN = process.env.IG_TOKEN;
const VERIFY_TOKEN = 'adarsh_realtor_verify_123';

// 1. Webhook Verification for Instagram
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// 2. Handle Incoming Messages
app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const event = entry?.messaging?.[0];
  
  if (event) {
    const senderId = event.sender.id;
    const messageText = event.message?.text;
    
    // Process with Gemini
    if (messageText) {
      const response = await generateGeminiReply(messageText);
      await sendInstagramReply(senderId, response);
      
      // Extract and Save to Sheets Logic here...
    }
  }
  res.sendStatus(200);
});

async function generateGeminiReply(text) {
  const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
  const model = ai.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are Adarsh Realtor's AI assistant..." 
  });
  const result = await model.generateContent(text);
  return result.response.text();
}

async function sendInstagramReply(recipientId, text) {
  await fetch(\`https://graph.facebook.com/v18.0/me/messages?access_token=\${IG_TOKEN}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: text }
    })
  });
}

app.listen(3000, () => console.log('Adarsh Bot Server Running'));
`;

const IntegrationGuide: React.FC = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(INTEGRATION_CODE);
    alert('Backend code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
          <AlertTriangle size={20} />
          Real Automation Requirements
        </h3>
        <p className="mt-2 text-amber-700">
          This web app is your <strong>Control Center</strong>. However, because Instagram sends data 24/7, 
          you cannot run the bot <i>only</i> in this browser tab. You must host a small "Backend Server".
        </p>
        <p className="mt-2 text-amber-700 font-medium">
          Don't worry, I have generated the code you need below. You can host this for free on Render.com or Vercel.
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-2 text-slate-200 text-sm font-mono">
            <Terminal size={16} />
            server.js
          </div>
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
          >
            <Copy size={14} />
            Copy Code
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
          {INTEGRATION_CODE}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Step 1: Get Credentials</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <ExternalLink size={16} className="text-blue-500" />
              <span><strong>Gemini API Key:</strong> Get from Google AI Studio.</span>
            </li>
            <li className="flex gap-2">
              <ExternalLink size={16} className="text-pink-500" />
              <span><strong>Instagram Access Token:</strong> Get from Meta Developers Portal (Add 'Instagram Graph API').</span>
            </li>
            <li className="flex gap-2">
              <ExternalLink size={16} className="text-green-500" />
              <span><strong>Google Sheets ID:</strong> Create a sheet and copy the ID from the URL.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Step 2: Connect</h4>
          <p className="text-sm text-slate-600 mb-4">
            Once you host the code above, paste your <strong>Webhook URL</strong> into the Meta Developer Portal.
          </p>
          <div className="p-3 bg-slate-100 rounded text-center text-xs font-mono text-slate-500 select-all">
            https://your-server-url.com/webhook
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;