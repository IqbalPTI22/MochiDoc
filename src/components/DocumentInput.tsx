import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle2, AlertCircle } from 'lucide-react';

interface DocumentInputProps {
  onDocumentReady: (text: string, info: { name: string, type: string, size: number, lines: number }) => void;
}

export function DocumentInput({ onDocumentReady }: DocumentInputProps) {
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Basic validation
    if (!file.type.startsWith('text/') && !file.name.match(/\.(txt|md|json|yaml|yml|xml|csv|log|ini|cfg|conf|toml)$/i)) {
      setError("Oops! MochiDoc can only read text-based documents. Please choose a supported text file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
       setError("This file is a bit too big for me! Please keep it under 5MB.");
       return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').length;
      onDocumentReady(text, {
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'TEXT',
        size: text.length,
        lines
      });
    };
    reader.onerror = () => {
      setError("Something went wrong reading your file.");
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setError("MochiDoc needs something to analyze first. Paste some text.");
      return;
    }
    setError(null);
    const lines = pastedText.split('\n').length;
    onDocumentReady(pastedText, {
      name: 'Pasted Text',
      type: 'TEXT',
      size: pastedText.length,
      lines
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-pink-100/50 p-6 md:p-8 border border-pink-50">
      
      <div className="flex justify-center space-x-2 mb-6">
        <button 
          onClick={() => setPasteMode(false)}
          className={`px-6 py-2 rounded-full font-bold transition-all ${!pasteMode ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Upload File
        </button>
        <button 
          onClick={() => setPasteMode(true)}
          className={`px-6 py-2 rounded-full font-bold transition-all ${pasteMode ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Paste Text
        </button>
      </div>

      <div className="min-h-[240px] flex flex-col justify-center">
        {!pasteMode ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-3 border-dashed border-pink-200 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all group"
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              accept=".txt,.md,.json,.yaml,.yml,.xml,.csv,.log,.ini,.cfg,.conf,.toml,text/*"
              onChange={handleFileSelected}
            />
            <div className="bg-pink-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Drop a document here</h3>
            <p className="text-slate-500 text-center text-sm max-w-xs">
              Supports .txt, .md, .json, .yaml, .log, .csv, and other text formats.
            </p>
            <p className="text-pink-400 font-semibold text-xs mt-4 uppercase tracking-wider bg-pink-100/50 px-3 py-1 rounded-full">
              Text documents only
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <textarea
              className="w-full h-48 p-4 rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all resize-none outline-none text-slate-700"
              placeholder="Paste your text here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
            <button 
              onClick={handlePasteSubmit}
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 font-bold transition-colors shadow-md"
            >
              Use Pasted Text
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
