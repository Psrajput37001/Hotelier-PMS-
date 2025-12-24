
import React, { useState } from 'react';
import { ProjectFile } from '../types';

interface WelcomeScreenProps {
  onFilesUploaded: (files: ProjectFile[]) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList) return;

    const processedFiles: ProjectFile[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      const content = await file.text();
      processedFiles.push({
        name: file.name,
        path: file.name, // In a real app we'd get the full relative path
        content: content,
        type: file.type || 'text/plain',
        size: file.size
      });
    }

    onFilesUploaded(processedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-3xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">explore your project?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Upload your source files to start the analysis. I'll provide a full workspace dashboard once you're ready.
          </p>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative group cursor-pointer
            border-2 border-dashed rounded-2xl p-16
            transition-all duration-300 ease-in-out
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'}
          `}
        >
          <input 
            type="file" 
            multiple 
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-6">
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              transition-transform duration-500 group-hover:scale-110
              ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}
            `}>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <p className="text-xl font-semibold text-slate-200">
                Click or drag files to this area
              </p>
              <p className="text-sm text-slate-500 font-medium">
                Supports multiple files (JS, TS, CSS, HTML, JSON, etc.)
              </p>
            </div>

            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all transform active:scale-95">
              Select Files
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <FeatureCard 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
            title="Syntax Highlighting"
            desc="Full preview with modern color schemes."
          />
          <FeatureCard 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            title="Analysis Tools"
            desc="Built-in code structure visualizations."
          />
          <FeatureCard 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="Instant Preview"
            desc="Navigate through your codebase seamlessly."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-left hover:border-slate-700 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 mb-4">
      {icon}
    </div>
    <h3 className="text-slate-100 font-bold mb-1">{title}</h3>
    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
  </div>
);

export default WelcomeScreen;
