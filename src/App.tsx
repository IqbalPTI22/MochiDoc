import React, { useState } from 'react';
import { Mascot, MascotState } from './components/Mascot';
import { DocumentInput } from './components/DocumentInput';
import { AnalysisResult } from './components/AnalysisResult';

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
    <div className="app-container-wrap">
      <div className="app-container">
        
        {/* Sidebar */}
        <div className="md:border-r-2 border-b-2 md:border-b-0 border-ink p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h1 className="font-display text-5xl md:text-6xl leading-none text-accent mb-2">MochiDoc</h1>
              <p className="text-xs text-ink-dim font-bold ml-[18px]">Your cute little document analyst.</p>
            </div>

            <Mascot state={getMascotState()} mode={mode} />

            {(appState === 'input' || appState === 'error') && (
              <div className="mt-8 flex flex-col gap-2">
                <div className="font-mono text-[0.6rem] opacity-40 mb-2 uppercase tracking-widest">Mode_Select</div>
                <button 
                  onClick={() => setMode('General Mode')}
                  className={`border-2 border-ink px-6 py-2 font-mono text-xs font-bold text-left transition-colors ${mode === 'General Mode' ? 'bg-ink text-panel' : 'text-ink bg-transparent hover:bg-ink-faint'}`}
                >
                  GEN_ANALYST
                </button>
                {mode === 'General Mode' && (
                  <p className="text-[0.65rem] text-ink-dim font-mono mb-2 ml-2 border-l-2 border-accent pl-2">
                    For articles, notes, & literature.<br/>Accepts: .txt, .md, .csv, .rtf
                  </p>
                )}

                <button 
                  onClick={() => setMode('CompScience Mode')}
                  className={`border-2 border-ink px-6 py-2 font-mono text-xs font-bold text-left transition-colors ${mode === 'CompScience Mode' ? 'bg-ink text-panel' : 'text-ink bg-transparent hover:bg-ink-faint'}`}
                >
                  COMP_SCI
                </button>
                {mode === 'CompScience Mode' && (
                  <p className="text-[0.65rem] text-ink-dim font-mono mb-2 ml-2 border-l-2 border-accent pl-2">
                    For configs, logs, & code.<br/>Accepts: .json, .yaml, .xml, .log, .ini...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-12 flex flex-col h-full overflow-y-auto">
          {/* Input State */}
          {(appState === 'input' || appState === 'error') && (
            <div className="flex-1 flex flex-col w-full h-full">
              <DocumentInput onDocumentReady={handleDocumentReady} mode={mode} />
              {appState === 'error' && (
                <div className="mt-6 p-4 border-2 border-red-500 bg-red-500/10 text-red-400 font-mono text-sm">
                  <p className="font-bold mb-2">ERROR_DETECTED</p>
                  <p>{errorMsg}</p>
                  <button onClick={reset} className="mt-4 underline hover:text-red-300">
                    RETRY_OPERATION
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analyzing State */}
          {appState === 'analyzing' && docInfo && (
            <div className="flex-1 flex flex-col items-center justify-center h-full">
              <div className="border-2 border-ink p-8 text-center max-w-sm w-full bg-ink-faint">
                <div className="text-accent text-4xl mb-4">⚙️</div>
                <h4 className="font-mono font-bold text-ink truncate mb-2">{docInfo.name}</h4>
                <div className="font-mono text-xs text-ink-dim flex justify-center gap-4 mb-6">
                  <span>CHR:{docInfo.size}</span>
                  <span>LNS:{docInfo.lines}</span>
                </div>
                <div className="bg-accent text-black font-mono text-xs font-bold py-2 px-4 uppercase animate-pulse">
                  Analyzing_Document...
                </div>
              </div>
            </div>
          )}

          {/* Result State */}
          {appState === 'result' && (
            <div className="flex-1 flex flex-col h-full">
              {docInfo && (
                <div className="mb-8 border-b-2 border-ink-faint pb-4 flex flex-wrap items-center gap-4 font-mono text-xs text-ink-dim">
                  <span className="text-accent">●</span>
                  <span className="text-ink font-bold truncate max-w-[200px]">{docInfo.name}</span>
                  <span>{docInfo.type}</span>
                  <span>{docInfo.size} CHR</span>
                  <span className="text-[#4ade80]">✓ STATUS_OK</span>
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
        </div>

        {/* Footer */}
        <footer className="col-span-1 md:col-span-2 border-t-2 border-ink p-3 md:px-8 flex flex-col md:flex-row justify-between items-center font-mono text-[0.65rem] text-ink-dim gap-2">
          <span>FILE_STATUS: {appState === 'input' ? 'AWAITING_INPUT' : appState === 'analyzing' ? 'PROCESSING' : appState === 'result' ? 'ANALYSIS_COMPLETE' : 'ERROR_STATE'}</span>
          <span className="text-center md:text-right">MochiDoc analyzes text locally where possible. Files are not stored permanently.</span>
        </footer>
      </div>
    </div>
  );
}

