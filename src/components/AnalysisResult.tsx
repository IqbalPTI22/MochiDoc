import React, { useState } from 'react';
import Markdown from 'react-markdown';

interface AnalysisResultProps {
  result: string;
  documentText: string;
  mode: string;
  onReset: () => void;
}

export function AnalysisResult({ result, documentText, mode, onReset }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState('');
  const [qnaList, setQnaList] = useState<{q: string, a: string}[]>([]);
  const [asking, setAsking] = useState(false);
  const [qnaError, setQnaError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || asking) return;

    const currentQ = question;
    setQuestion('');
    setAsking(true);
    setQnaError(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: documentText, question: currentQ, mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get answer');
      
      setQnaList(prev => [...prev, { q: currentQ, a: data.answer }]);
    } catch (err: any) {
      setQnaError(err.message || 'ERR_QNA_FAIL: Something went wrong.');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Result Area */}
      <div className="border-2 border-ink bg-panel">
        <div className="bg-ink-faint border-b-2 border-ink p-3 px-6 flex justify-between items-center">
          <h2 className="font-mono font-bold text-sm text-accent uppercase tracking-wider">
            OUTPUT_BUFFER
          </h2>
          <button 
            onClick={handleCopy}
            className="font-mono text-xs font-bold border-2 border-ink px-3 py-1 hover:bg-ink hover:text-panel transition-colors"
          >
            {copied ? 'COPIED_OK' : 'COPY_TEXT'}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <div className="markdown-body">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      </div>

      {/* Q&A Section */}
      <div className="border-2 border-ink p-6 md:p-8 bg-ink-faint">
        <h3 className="font-mono font-bold text-sm text-accent uppercase tracking-wider mb-6">
          ADD OTHER QUESTION
        </h3>
        
        <div className="space-y-6 mb-8">
          {qnaList.map((qna, i) => (
            <div key={i} className="space-y-4">
              <div className="flex gap-4">
                <div className="font-mono text-ink-dim font-bold mt-1">&gt;</div>
                <div className="font-mono text-ink font-bold">
                  {qna.q}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="font-mono text-accent font-bold mt-1">●</div>
                <div className="text-ink">
                  <div className="markdown-body text-sm">
                    <Markdown>{qna.a}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {asking && (
            <div className="flex gap-4">
              <div className="font-mono text-accent font-bold animate-pulse mt-1">●</div>
              <div className="text-ink-dim font-mono text-sm animate-pulse">
                PROCESSING...
              </div>
            </div>
          )}

          {qnaError && (
             <div className="p-4 border-2 border-red-500 bg-red-500/10 text-red-400 font-mono text-sm">
               {qnaError}
             </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter query..."
            className="flex-1 bg-panel border-2 border-ink focus:border-accent p-4 font-mono text-ink outline-none transition-colors"
            disabled={asking}
          />
          <button 
            type="submit"
            disabled={asking || !question.trim()}
            className="action-btn primary whitespace-nowrap disabled:opacity-50"
          >
            SUBMIT
          </button>
        </form>
      </div>

      <div className="flex justify-start">
        <button 
          onClick={onReset}
          className="action-btn"
        >
          RESET_SESSION
        </button>
      </div>

    </div>
  );
}
