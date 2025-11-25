import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, RefreshCw, Save } from 'lucide-react';
import { createChatSession, extractLeadData } from '../services/geminiService';
import { ChatMessage, Lead } from '../types';

interface BotSimulatorProps {
  apiKey: string;
  onLeadDetected: (lead: Lead) => void;
}

const BotSimulator: React.FC<BotSimulatorProps> = ({ apiKey, onLeadDetected }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat on mount or when API key changes
  useEffect(() => {
    if (apiKey) {
      startNewSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startNewSession = () => {
    try {
      const session = createChatSession(apiKey);
      setChatSession(session);
      setMessages([{
        role: 'model',
        text: "Namaste! Welcome to Adarsh Realtor. How can I help you find your dream property today?",
        timestamp: Date.now()
      }]);
    } catch (e) {
      console.error("Failed to start session", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: input });
      const modelMsg: ChatMessage = { role: 'model', text: result.text, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);

      // Attempt to extract lead data after every turn
      analyzeChatForLead([...messages, userMsg, modelMsg]);

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ Error connecting to AI. Check API Key.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeChatForLead = async (history: ChatMessage[]) => {
    const historyText = history.map(m => `${m.role}: ${m.text}`).join('\n');
    const data: any = await extractLeadData(apiKey, historyText);

    if (data && data.isComplete) {
      const newLead: Lead = {
        id: Date.now().toString(),
        name: data.name || 'Unknown',
        phone: data.phone || 'Unknown',
        requirement: data.requirement || 'Not specified',
        status: 'New',
        timestamp: Date.now(),
        source: 'Simulator'
      };
      onLeadDetected(newLead);
    }
  };

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200">
        <p className="text-slate-500">Please enter your Gemini API Key in Settings to start the simulator.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Live Simulator</h3>
            <p className="text-xs text-slate-500">Testing "Adarsh Realtor" Persona</p>
          </div>
        </div>
        <button 
          onClick={startNewSession}
          className="text-slate-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
          title="Restart Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3 text-sm
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Type a message as a user..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotSimulator;