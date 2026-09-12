import React, { useState } from 'react';
import { Mascot, MascotState } from './components/Mascot';
import { DocumentInput } from './components/DocumentInput';
import { AnalysisResult } from './components/AnalysisResult';
import { Sparkles, Code } from 'lucide-react';

type Mode = 'General Mode' | 'CompScience Mode';
type AppState = 'input' | 'analyzing' | 'result' | 'error';

export default function App() {
  const [mode, setMode] = useState<Mode>('General Mode');
  const [appState, setAppState] = useState<AppState>('input');
  
  // Document state
  const [docText, setDocText] = useState('');
  const [docInfo, setDocInfo] = useState<{name: string, type: string, size: number, lines: number} | null>(null);
  
  // Result state
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDocumentReady = async (text: string, info: {name: string, type: string, size: number, lines: number}) => {
    setDocText(text);
    setDocInfo(info);
    setAppState('analyzing');
    setErrorMsg('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze document.');
      }
      
      setResult(data.result);
      setAppState('result');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while analyzing the document. Please try again.');
      setAppState('error');
    }
  };

  const reset = () => {
    setDocText('');
    setDocInfo(null);
    setResult('');
    setErrorMsg('');
    setAppState('input');
  };

  const getMascotState = (): MascotState => {
    switch (appState) {
      case 'input': return 'idle';
      case 'analyzing': return 'analyzing';
      case 'result': return 'complete';
      case 'error': return 'error';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col items-center mb-8 pt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          MochiDoc
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">Your cute little document analyst.</p>
      </header>

      {/* Mascot Area */}
      <div className="mb-8">
        <Mascot state={getMascotState()} mode={mode} />
      </div>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center">
        
        {/* Input State */}
        {(appState === 'input' || appState === 'error') && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Mode Selector */}
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-100 flex gap-1 mb-8">
              <button 
                onClick={() => setMode('General Mode')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${mode === 'General Mode' ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Sparkles className="w-4 h-4" /> General
              </button>
              <button 
                onClick={() => setMode('CompScience Mode')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${mode === 'CompScience Mode' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Code className="w-4 h-4" /> CompScience
              </button>
            </div>

            <DocumentInput onDocumentReady={handleDocumentReady} />
            
            {appState === 'error' && (
              <div className="w-full max-w-2xl mt-6">
                 <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                   <p className="text-red-700 font-medium">{errorMsg}</p>
                 </div>
                 <button onClick={reset} className="mt-4 text-slate-500 font-bold hover:text-slate-800 underline">
                   Try again
                 </button>
              </div>
            )}
          </div>
        )}

        {/* Analyzing State */}
        {appState === 'analyzing' && docInfo && (
          <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
             <div className="bg-white rounded-[2rem] shadow-xl shadow-pink-100/50 p-6 w-full border border-pink-50">
               <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-xl">📄</div>
                 <div className="overflow-hidden">
                   <h4 className="font-bold text-slate-700 truncate">{docInfo.name}</h4>
                   <p className="text-xs text-slate-400 font-medium">{docInfo.type} FORMAT</p>
                 </div>
               </div>
               <div className="flex justify-between text-sm text-slate-500 mb-4 px-2">
                 <span>Characters: <b className="text-slate-700">{docInfo.size.toLocaleString()}</b></span>
                 <span>Lines: <b className="text-slate-700">{docInfo.lines.toLocaleString()}</b></span>
               </div>
               <div className="bg-slate-50 rounded-xl p-3 flex justify-center items-center gap-2 text-sm font-bold text-slate-600 border border-slate-100">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-pink-500 rounded-full animate-spin"></div>
                  Analyzing document...
               </div>
             </div>
          </div>
        )}

        {/* Result State */}
        {appState === 'result' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Document Info Pill */}
            {docInfo && (
              <div className="flex justify-center mb-6">
                <div className="bg-white/60 backdrop-blur-md border border-white px-4 py-2 rounded-full shadow-sm flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 font-bold">
                    <span>📄</span> <span className="truncate max-w-[150px] md:max-w-xs">{docInfo.name}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="text-slate-500">
                    {docInfo.type} • {docInfo.size.toLocaleString()} chars
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="text-green-600 font-bold flex items-center gap-1">
                    ✓ Ready
                  </div>
                </div>
              </div>
            )}
            
            <AnalysisResult 
              result={result} 
              documentText={docText} 
              mode={mode} 
              onReset={reset} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-slate-400 text-sm font-medium">
        <p>MochiDoc analyzes text locally where possible. Files are not stored permanently.</p>
      </footer>
    </div>
  );
}

