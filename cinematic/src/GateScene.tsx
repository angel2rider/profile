import React from 'react';
import { motion } from 'motion/react';
import { REVEAL_TIME } from './audioTimeline';

export default function GateSceneCanvas({
  countdown,
  soundOn,
  time,
}: {
  countdown: number;
  soundOn: boolean;
  time: number;
}) {
  const progress = Math.min(100, (time / REVEAL_TIME) * 100);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <p className="font-hud text-[10px] tracking-[0.45em] text-vice-orange/85">VICE CITY RADIO</p>

        <h1 className="wordmark mt-3 font-display text-[clamp(5rem,18vw,13rem)] leading-[0.9] tracking-[-0.01em]">
          TheGT
        </h1>

        <p className="mt-4 font-hud text-[10px] tracking-[0.4em] text-cream/50">LEONIDA · 2026</p>
        <p className="vice-gradient-text mt-1 font-display text-2xl leading-none tracking-[0.35em]">VI</p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1 }}
      >
        <span className="whitespace-nowrap font-hud text-[10px] tracking-[0.32em] text-cream/60 sm:text-[11px] sm:tracking-[0.45em]">
          {soundOn ? (countdown > 0 ? `REVEAL IN ${String(countdown).padStart(2, '0')}` : 'HERE WE GO') : 'CLICK ANYWHERE TO START'}
        </span>
        <div className="h-px w-24 overflow-hidden bg-cream/15">
          <div
            className="vice-gradient h-full transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}
