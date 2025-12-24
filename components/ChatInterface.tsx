
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithGrounding } from '../services/geminiService';
import { Icons } from '../constants';

interface ChatInterfaceProps {
  theme?: 'light' | 'dark';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ theme = 'dark' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let location = undefined;
      if (useLocation) {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      }

      const response = await chatWithGrounding(input, location);
      const text = response.text || "No response received.";
      
      const sources: { uri: string; title: string }[] = [];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      groundingChunks?.forEach((chunk: any) => {
        if (chunk.web) sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        if (chunk.maps) sources.push({ uri: chunk.maps.uri, title: chunk.maps.title });
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text,
        timestamp: Date.now(),
        sources: sources.length > 0 ? sources : undefined,
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "System interrupted. Error connecting to Gemini kernel. Check API key status.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 sm:px-6">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 hide-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fadeIn">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl ${isDark ? 'bg-white/5 text-amber-500 shadow-amber-500/10' : 'bg-indigo-600/10 text-indigo-600 shadow-indigo-600/10'}`}>
              <Icons.Chat />
            </div>
            <div>
              <h3 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Omniscient Engine</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 max-w-[280px]">Ask about hospitality trends, guest sentiment analysis, or local search.</p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 sm:p-6 shadow-sm ${
              m.role === 'user' 
                ? (isDark ? 'bg-amber-500 text-black font-bold' : 'bg-indigo-600 text-white font-bold shadow-indigo-600/20') 
                : (isDark ? 'bg-slate-900 text-slate-200 border border-white/5' : 'bg-white text-slate-800 border border-slate-200 shadow-slate-100')
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</div>
              {m.sources && (
                <div className="mt-4 pt-4 border-t border-current/10 flex flex-wrap gap-2">
                  {m.sources.map((s, idx) => (
                    <a 
                      key={idx} 
                      href={s.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                        m.role === 'user' ? 'bg-black/10 hover:bg-black/20' : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200')
                      }`}
                    >
                      {s.title || 'Manifest Reference'}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-full px-6 py-4 flex space-x-2 items-center ${isDark ? 'bg-slate-900 border border-white/5' : 'bg-white border border-slate-200'}`}>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 sm:p-8 border-t transition-colors duration-500 mb-20 lg:mb-0 ${isDark ? 'bg-obsidian/50 border-white/5' : 'bg-white/80 border-slate-200'} backdrop-blur-xl rounded-t-[2.5rem]`}>
        <div className="flex items-center gap-3 mb-4">
           <label className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer select-none group">
              <input 
                type="checkbox" 
                checked={useLocation} 
                onChange={(e) => setUseLocation(e.target.checked)}
                className="w-4 h-4 rounded-lg border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
              />
              <span className="group-hover:text-amber-500 transition-colors">Inject Geo-Context (Maps)</span>
           </label>
        </div>
        <div className={`flex items-center gap-4 border rounded-2xl p-2 px-5 shadow-2xl transition-all ${isDark ? 'bg-slate-900 border-white/10 focus-within:border-amber-500' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-600'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate the AI..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-bold placeholder-slate-500 py-3"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`p-3 rounded-xl transition-all ${
              input.trim() ? (isDark ? 'bg-amber-500 text-black hover:scale-110 shadow-lg shadow-amber-500/20' : 'bg-indigo-600 text-white hover:scale-110 shadow-lg shadow-indigo-600/20') : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
