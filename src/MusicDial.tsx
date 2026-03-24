import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'motion/react';

export interface VideoItem {
  id: number;
  name: string;
  src: string;
  hue: number;
}

export const VIDEOS: VideoItem[] = [
  { id: 0, name: 'Track 1', src: '', hue: 0 },
  { id: 1, name: 'Track 2', src: '', hue: 90 },
  { id: 2, name: 'Track 3', src: '', hue: 180 },
  { id: 3, name: 'Track 4', src: '', hue: 270 },
  { id: 4, name: 'Track 5', src: '', hue: 45 },
];

interface MusicDialProps {
  onSelect: (video: VideoItem) => void;
  activeVideo: VideoItem;
}

export default function MusicDial({ onSelect, activeVideo }: MusicDialProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { mass: 0.8, stiffness: 100, damping: 25 });
  
  const gear1 = useTransform(smoothRotation, v => v * 1.5);
  const gear2 = useTransform(smoothRotation, v => -v * 0.8);
  const gear3 = useTransform(smoothRotation, v => v * 0.5);

  const itemAngle = 360 / VIDEOS.length;

  const handleWheel = (e: React.WheelEvent) => {
    if (!isHovered) return;
    // Adjust rotation. Scroll down (positive deltaY) -> rotate negative (counter-clockwise)
    rotation.set(rotation.get() - e.deltaY * 0.15);
  };

  useEffect(() => {
    return smoothRotation.on('change', (v) => {
      let normalizedV = -v / itemAngle;
      let index = Math.round(normalizedV) % VIDEOS.length;
      if (index < 0) index += VIDEOS.length;
      
      if (VIDEOS[index].id !== activeVideo.id) {
        onSelect(VIDEOS[index]);
      }
    });
  }, [smoothRotation, activeVideo.id, itemAngle, onSelect]);

  return (
    <div 
      className="fixed right-0 top-0 w-16 h-full z-50 flex items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
    >
      <motion.div 
        className="absolute top-1/2 right-0 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        animate={{ 
          width: isHovered ? 360 : 160, 
          height: isHovered ? 360 : 160,
          x: '50%',
          y: '-50%',
          opacity: isHovered ? 1 : 0.15
        }}
        initial={{ x: '50%', y: '-50%' }}
        transition={{ type: 'spring', mass: 0.8, stiffness: 100, damping: 20 }}
      >
        {/* Radar sweep gradient */}
        <motion.div style={{ rotate: gear3 }} className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0)_100%)] pointer-events-none" />
        
        {/* Concentric circles with gear ratios */}
        <motion.div style={{ rotate: gear1 }} className="absolute inset-[8%] rounded-full border border-white/5 pointer-events-none border-t-white/20" />
        <motion.div style={{ rotate: gear2 }} className="absolute inset-[20%] rounded-full border border-white/10 border-dashed opacity-50 pointer-events-none" />
        <motion.div style={{ rotate: gear3 }} className="absolute inset-[35%] rounded-full border border-white/5 pointer-events-none border-b-white/20" />
        
        {/* Crosshairs */}
        <div className="absolute w-full h-[1px] bg-white/5 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-white/5 pointer-events-none" />
        
        {/* Center Hub */}
        <div className="absolute w-20 h-20 rounded-full border border-white/20 bg-black/80 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] pointer-events-none">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
        
        <motion.div className="absolute inset-0" style={{ rotate: smoothRotation }}>
          {VIDEOS.map((video, i) => {
            const angle = i * itemAngle;
            const isActive = video.id === activeVideo.id;
            return (
              <DialItem 
                key={video.id} 
                video={video} 
                angle={angle} 
                isActive={isActive} 
                isHovered={isHovered}
                currentRotation={smoothRotation}
              />
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}

function DialItem({ video, angle, isActive, isHovered, currentRotation }: any) {
  const counterRotation = useTransform(currentRotation, (v: number) => -v - angle);

  return (
    <div 
      className="absolute top-1/2 left-0 w-full h-0 flex items-center"
      style={{ transform: `translateY(-50%) rotate(${angle}deg)` }}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <motion.div 
          style={{ rotate: counterRotation }}
          className="relative flex items-center justify-center"
        >
          {/* Text and connecting line */}
          <div className={`absolute right-full mr-2 transition-all duration-500 flex items-center gap-3 ${isActive ? 'opacity-100 translate-x-0' : (isHovered ? 'opacity-50 translate-x-2' : 'opacity-0 translate-x-4')} origin-right`}>
            <span className={`whitespace-nowrap font-mono tracking-[0.2em] uppercase text-[10px] ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-bold' : 'text-white/60'}`}>
              {video.name}
            </span>
            <div className={`h-[1px] transition-all duration-500 ${isActive ? 'w-8 bg-white/60' : 'w-3 bg-white/20'}`} />
          </div>

          {/* The Node */}
          <div className={`relative flex items-center justify-center w-8 h-8 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
            {/* Rotating dashed ring for active state */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
                  className="absolute inset-0 rounded-full border border-white/40 border-dashed"
                />
              )}
            </AnimatePresence>
            
            {/* Central shape */}
            <div className={`transition-all duration-500 ${isActive ? 'w-2.5 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,1)] rotate-45' : 'w-1.5 h-1.5 bg-white/40 rotate-0'} `} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
