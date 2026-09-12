import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText, Code } from 'lucide-react';

export type MascotState = 'idle' | 'analyzing' | 'complete' | 'error';

interface MascotProps {
  state: MascotState;
  mode: 'General Mode' | 'CompScience Mode';
}

export function Mascot({ state, mode }: MascotProps) {
  const getFace = () => {
    switch (state) {
      case 'idle': return '(｡•ᴗ•｡)';
      case 'analyzing': return '(✧ω✧)';
      case 'complete': return '(≧▽≦)';
      case 'error': return '(╥﹏╥)';
    }
  };

  const getMessage = () => {
    switch (state) {
      case 'idle': return mode === 'General Mode' ? 'Ready to read!' : 'Ready to debug!';
      case 'analyzing': return 'Thinking really hard...';
      case 'complete': return 'All done! ✨';
      case 'error': return 'Oh no...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <motion.div 
        animate={
          state === 'analyzing' ? { y: [-5, 5, -5], rotate: [-2, 2, -2] } : 
          state === 'complete' ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } :
          state === 'error' ? { x: [-5, 5, -5, 5, 0] } :
          { y: [-2, 2, -2] }
        }
        transition={{ repeat: state === 'analyzing' || state === 'idle' ? Infinity : 0, duration: 2 }}
        className={`w-32 h-32 rounded-[2rem] flex flex-col items-center justify-center shadow-lg border-4 transition-colors duration-500 relative
          ${mode === 'General Mode' ? 'bg-pink-100 border-pink-300 text-pink-700' : 'bg-indigo-100 border-indigo-300 text-indigo-700'}
          ${state === 'error' ? 'bg-red-100 border-red-300 text-red-700' : ''}
        `}
      >
        {/* Decor */}
        {mode === 'General Mode' && state !== 'error' && (
          <Sparkles className="absolute top-2 right-2 w-5 h-5 text-pink-400 opacity-50" />
        )}
        {mode === 'CompScience Mode' && state !== 'error' && (
          <Code className="absolute top-2 right-2 w-5 h-5 text-indigo-400 opacity-50" />
        )}
        
        <span 
          className="text-3xl font-bold tracking-[0.15em] pl-[0.15em] flex items-center justify-center"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {getFace()}
        </span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        key={state + mode}
        className="mt-4 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm border border-slate-200 text-slate-600"
      >
        {getMessage()}
      </motion.div>
    </div>
  );
}
