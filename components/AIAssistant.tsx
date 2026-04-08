import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, X } from 'lucide-react';
import { askAIChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const AIAssistant: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I am NexusAI. Ask me about company news, tech trends, or internal events.' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const answer = await askAIChat(userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <Bot size={20} />
          <span>NexusAI Chat</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none flex items-center gap-2 border border-zinc-700">
              <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              <span className="text-xs text-zinc-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Ask about Q3 goals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
