import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-ink px-6"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(201,130,107,0.12) 0%, rgba(107,91,120,0.06) 40%, transparent 70%)' }}
          />

          <div className="dossier-paper w-full max-w-xs rounded-[6px] border border-[#1d1720]/15 bg-[#e9dfd0] px-8 py-8 text-center shadow-[0_30px_80px_rgba(6,4,10,0.5)]">
            <p className="font-hud text-[9px] tracking-[0.4em] text-[#6b5b78]">VICE CITY RADIO</p>
            <p className="wordmark-ink mt-2 font-display text-3xl leading-none text-[#1d1720]">TheGT</p>

            <div className="mx-auto mt-6 h-px w-full overflow-hidden bg-[#1d1720]/12">
              <motion.div
                className="vice-gradient h-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
              />
            </div>

            <p className="mt-4 font-hud text-[9px] tracking-[0.35em] text-[#6b5b78]">TUNING 89.6</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
