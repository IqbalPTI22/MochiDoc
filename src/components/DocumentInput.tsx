import React, { useState, useRef } from 'react';

interface DocumentInputProps {
  onDocumentReady: (text: string, info: { name: string, type: string, size: number, lines: number }) => void;
  mode: string;
}

export function DocumentInput({ onDocumentReady, mode }: DocumentInputProps) {
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGeneral = mode === 'General Mode';
  const allowedExts = isGeneral 
    ? ['txt', 'md', 'csv', 'rtf'] 
    : ['json', 'yaml', 'yml', 'xml', 'csv', 'log', 'ini', 'cfg', 'conf', 'toml'];
  const allowedExtsString = allowedExts.map(ext => `.${ext}`).join(', ');

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const extMatch = file.name.match(/\.([^.]+)$/);
    const fileExt = extMatch ? extMatch[1].toLowerCase() : '';

    if (!allowedExts.includes(fileExt) && !file.type.startsWith('text/')) {
      setError(`ERR_UNSUPPORTED_FORMAT: Domain ${isGeneral ? 'GEN_ANALYST' : 'COMP_SCI'} only accepts ${allowedExtsString}.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
       setError("ERR_FILE_TOO_LARGE: Max size is 5MB.");
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
      setError("ERR_READ_FAILED: Something went wrong reading your file.");
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setError("ERR_EMPTY_INPUT: Paste some text first.");
      return;
    }
    setError(null);
    const lines = pastedText.split('\n').length;
    onDocumentReady(pastedText, {
      name: 'PASTED_BUFFER',
      type: 'TEXT',
      size: pastedText.length,
      lines
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setPasteMode(false)}
          className={`action-btn ${!pasteMode ? 'primary' : ''}`}
        >
          Upload File
        </button>
        <button 
          onClick={() => setPasteMode(true)}
          className={`action-btn ${pasteMode ? 'primary' : ''}`}
        >
          Paste Text
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        {!pasteMode ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-[300px] border-4 border-dashed border-ink-faint flex flex-col items-center justify-center p-8 text-center hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              accept={allowedExts.map(ext => `.${ext}`).join(',')}
              onChange={handleFileSelected}
            />
            <div className="text-accent mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <h3 className="font-mono text-xl mb-2 text-ink font-bold">Drop a document here</h3>
            <p className="text-sm text-ink-dim max-w-sm mb-10">
              {isGeneral 
                ? 'Supports .txt, .md, .csv, and .rtf files for general analysis.'
                : 'Supports .json, .yaml, .log, .xml, .ini, and other configs for technical analysis.'}
            </p>
            <div className="font-mono text-[0.7rem] text-accent uppercase tracking-wider">
              <span className="mr-2">●</span> TEXT DOCUMENTS ONLY
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full flex-1">
            <textarea
              className="flex-1 w-full p-6 bg-ink-faint border-2 border-ink text-ink font-mono focus:border-accent outline-none resize-none min-h-[300px]"
              placeholder={isGeneral ? "> Paste your article, notes, or essay here..." : "> Paste your JSON, logs, or config data here..."}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
            <button 
              onClick={handlePasteSubmit}
              className="action-btn primary mt-6 self-start"
            >
              Execute Analysis
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 border-2 border-red-500 bg-red-500/10 text-red-400 font-mono text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
