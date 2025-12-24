
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Icons } from '../constants';
import { decodeBase64, encodeBase64, decodeAudioData } from '../services/geminiService';

// Fixed: Added LiveSessionProps to support theme prop and satisfy TypeScript in App.tsx
interface LiveSessionProps {
  theme?: 'light' | 'dark';
}

const LiveSession: React.FC<LiveSessionProps> = ({ theme = 'dark' }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const isDark = theme === 'dark';

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  }, []);

  const startSession = async () => {
    try {
      // Create new GoogleGenAI instance using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Live connected');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const data = encodeBase64(new Uint8Array(int16.buffer));
              
              // CRITICAL: Always use the resolved session promise to avoid race conditions
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data, mimeType: 'audio/pcm;rate=16000' } });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => [...prev, `Gemini: ${text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscript(prev => [...prev, `You: ${text}`]);
            }

            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              // Ensure gapless playback using nextStartTimeRef cursor
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              // Fix: Correctly access .current on sourcesRef
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live error', e);
            stopSession();
          },
          onclose: () => {
            console.log('Live closed');
            setIsActive(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: 'You are a helpful and very concise AI assistant in a real-time audio conversation. Speak naturally but keep responses short.'
        }
      });

      const session = await sessionPromise;
      sessionRef.current = session;
      setIsActive(true);
    } catch (err) {
      console.error(err);
      alert("Microphone permission required for Live conversation.");
    }
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center p-6 ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full bg-blue-500/20 animate-ping ${isActive ? 'block' : 'hidden'}`} />
          <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive ? 'bg-blue-600 shadow-2xl shadow-blue-500/50 scale-110' : (isDark ? 'bg-slate-800' : 'bg-white shadow-lg')
          }`}>
            <div className={`${isActive || isDark ? 'text-white' : 'text-slate-600'} scale-[2]`}>
              <Icons.Audio />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Gemini Live</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isActive ? "Listening and thinking..." : "Start a hands-free, real-time voice conversation."}
          </p>
        </div>

        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white active:scale-95' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
          }`}
        >
          {isActive ? 'Stop Session' : 'Start Conversation'}
        </button>

        {transcript.length > 0 && (
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl p-4 h-48 overflow-y-auto text-left space-y-2 text-sm`}>
             {transcript.map((t, i) => (
               <div key={i} className={t.startsWith('You:') ? 'text-blue-400' : (isDark ? 'text-slate-300' : 'text-slate-600')}>
                 {t}
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSession;
