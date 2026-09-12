import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, RefreshCw, Send, Check } from 'lucide-react';

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
      setQnaError(err.message || 'Something went wrong asking the question.');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Result Card */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-50">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center px-6 md:px-8">
          <h2 className="font-bold text-slate-700 flex items-center gap-2">
            <span className="text-xl">✨</span> Analysis Result
          </h2>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <div className="markdown-body">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      </div>

      {/* Q&A Section */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-pink-100/50 p-6 md:p-8 border border-pink-50">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Ask MochiDoc about this document</h3>
        
        <div className="space-y-4 mb-6">
          {qnaList.map((qna, i) => (
            <div key={i} className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-500 text-sm">
                  Q
                </div>
                <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 text-slate-700 w-full font-medium border border-slate-100">
                  {qna.q}
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0 text-xl shadow-sm border border-pink-200">
                  🌸
                </div>
                <div className="bg-pink-50/50 rounded-2xl rounded-tl-none p-4 text-slate-800 w-full border border-pink-100">
                  <div className="markdown-body text-sm">
                    <Markdown>{qna.a}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {asking && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0 text-xl shadow-sm border border-pink-200 animate-pulse">
                🌸
              </div>
              <div className="bg-pink-50/50 rounded-2xl rounded-tl-none p-4 text-slate-500 w-full border border-pink-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {qnaError && (
             <div className="text-red-500 text-sm p-3 bg-red-50 rounded-xl border border-red-100">
               {qnaError}
             </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., What are the most important points?"
            className="flex-1 bg-slate-50 border-2 border-slate-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 rounded-xl px-4 py-3 outline-none transition-all text-slate-700"
            disabled={asking}
          />
          <button 
            type="submit"
            disabled={asking || !question.trim()}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            Ask <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-bold px-6 py-3 rounded-full hover:bg-pink-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Start New Document
        </button>
      </div>

    </div>
  );
}
