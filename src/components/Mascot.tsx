import React from 'react';
import { motion } from 'motion/react';

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
      case 'idle': return 'Ready to read!';
      case 'analyzing': return 'Processing...';
      case 'complete': return 'Analysis complete';
      case 'error': return 'System Error';
    }
  };

  return (
    <div className="bg-ink-faint border-2 border-ink p-6 text-center my-8 relative overflow-hidden">
      <motion.div 
        animate={
          state === 'analyzing' ? { y: [-2, 2, -2], rotate: [-1, 1, -1] } : 
          state === 'complete' ? { scale: [1, 1.05, 1] } :
          state === 'error' ? { x: [-3, 3, -3, 3, 0] } :
          { y: [0, 0] }
        }
        transition={{ repeat: state === 'analyzing' ? Infinity : 0, duration: 0.5 }}
      >
        <span 
          className="text-[43px] leading-[53px] block mb-2 text-ink font-sans tracking-[0.1em] pl-[0.1em]"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {getFace()}
        </span>
      </motion.div>
      <span className="font-mono text-[0.6rem] uppercase tracking-widest bg-accent text-black px-2 py-0.5 font-bold">
        {getMessage()}
      </span>
    </div>
  );
}
