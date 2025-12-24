
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageResult } from '../types';
import { Icons } from '../constants';

// Fixed: Added ImageGenProps to support theme prop and satisfy TypeScript in App.tsx
interface ImageGenProps {
  theme?: 'light' | 'dark';
}

const ImageGen: React.FC<ImageGenProps> = ({ theme = 'dark' }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9">("1:1");
  const isDark = theme === 'dark';

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generateImage(prompt, aspectRatio);
      if (url) {
        setResults(prev => [{ url, prompt, timestamp: Date.now() }, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className={`p-6 h-full overflow-y-auto ${isDark ? '' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} border rounded-3xl p-6 shadow-2xl backdrop-blur`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Art with Gemini</h2>
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with purple neon lights and hovering cars..."
              className={`w-full h-32 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all`}
            />
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aspect Ratio:</span>
                {(["1:1", "4:3", "16:9"] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : (isDark ? 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`ml-auto px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all ${
                  isGenerating || !prompt.trim()
                    ? (isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400') + ' cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20'
                }`}
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icons.Image />
                )}
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {results.map((res, i) => (
            <div key={res.timestamp} className={`group relative ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-3xl overflow-hidden border shadow-xl transition-all hover:scale-[1.02]`}>
              <img src={res.url} alt={res.prompt} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <p className="text-white text-sm line-clamp-2 mb-2">{res.prompt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Generated {new Date(res.timestamp).toLocaleTimeString()}</span>
                  <a 
                    href={res.url} 
                    download={`gemini-gen-${res.timestamp}.png`}
                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors backdrop-blur"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGen;
