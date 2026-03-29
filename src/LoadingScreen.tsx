import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-white/10"
            style={{ borderTopColor: 'rgba(255,255,255,0.8)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="mt-6 text-[11px] text-white/50 tracking-[0.3em] uppercase font-bold"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            Initializing Experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
