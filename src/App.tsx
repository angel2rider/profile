/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import MusicDial, { VIDEOS, VideoItem } from './MusicDial';

const ProfileUI = lazy(() => import('./ProfileUI'));

interface BackgroundVideoProps {
  src: string;
  isActive: boolean;
  isIntro?: boolean;
  isMuted?: boolean;
  shouldLoop?: boolean;
  onTimeUpdate?: any;
  onEnded?: any;
}

const BackgroundVideo = React.forwardRef<HTMLVideoElement, BackgroundVideoProps>(
  ({ src, isActive, isIntro, isMuted = true, shouldLoop = true, onTimeUpdate, onEnded }, externalRef) => {
    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
    const isVimeo = src.includes('vimeo.com');
    const internalRef = useRef<HTMLVideoElement>(null);

    const setRefs = React.useCallback(
      (node: HTMLVideoElement) => {
        internalRef.current = node;
        if (typeof externalRef === 'function') {
          externalRef(node);
        } else if (externalRef) {
          (externalRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
        }
      },
      [externalRef]
    );

    useEffect(() => {
      const video = internalRef.current;
      if (video && !isYouTube && !isVimeo) {
        if (isActive) {
          video.currentTime = 0;
          video.play().catch(e => {
            if (e.name !== 'AbortError') console.error("Video play error:", e);
          });
        } else {
          // Pause slightly after fade-out to ensure smooth visual transition
          const timer = setTimeout(() => {
            if (internalRef.current) internalRef.current.pause();
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    }, [isActive, isYouTube, isVimeo]);

    if (isYouTube && isActive) {
      let videoId = '';
      if (src.includes('youtu.be/')) videoId = src.split('youtu.be/')[1].split('?')[0];
      else if (src.includes('v=')) videoId = src.split('v=')[1].split('&')[0];
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 w-full h-full pointer-events-none">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=${shouldLoop ? 1 : 0}&playlist=${videoId}&modestbranding=1&playsinline=1`}
            className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] -translate-x-1/2 -translate-y-1/2 sm:w-[150vw] sm:h-[150vh]"
            allow="autoplay; encrypted-media"
            style={{ border: 'none' }}
          />
        </motion.div>
      );
    }

    if (isVimeo && isActive) {
      const videoId = src.split('vimeo.com/')[1].split('?')[0];
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 w-full h-full pointer-events-none">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=${shouldLoop ? 1 : 0}&byline=0&title=0&muted=${isMuted ? 1 : 0}`}
            className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] -translate-x-1/2 -translate-y-1/2 sm:w-[150vw] sm:h-[150vh]"
            allow="autoplay; fullscreen; picture-in-picture"
            style={{ border: 'none' }}
          />
        </motion.div>
      );
    }

    if (isYouTube || isVimeo) return null;

    // Fast HTML5 local Preloaded Video
    return (
      <video 
        ref={setRefs}
        src={src}
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${!isIntro ? 'scale-[1.35]' : 'scale-105'} ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        muted={isMuted}
        playsInline
        loop={shouldLoop}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    );
  }
);

// --- Intro Gate Components ---
function GateScene({ isTransitioning }: { isTransitioning: boolean }) {
  const textRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const currentRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y -= delta * 0.05;
      starsRef.current.rotation.x -= delta * 0.02;
    }

    if (!isTransitioning) {
      const { pointer } = state;
      targetRotation.current.x = (pointer.y * Math.PI) / 8;
      targetRotation.current.y = (pointer.x * Math.PI) / 8;

      currentRotation.current.x = THREE.MathUtils.damp(currentRotation.current.x, targetRotation.current.x, 4, delta);
      currentRotation.current.y = THREE.MathUtils.damp(currentRotation.current.y, targetRotation.current.y, 4, delta);

      if (textRef.current) {
        textRef.current.rotation.x = -currentRotation.current.x;
        textRef.current.rotation.y = currentRotation.current.y;
      }
    } else {
      // Small suck-in effect
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 8, 4, delta);
      const camera = state.camera as THREE.PerspectiveCamera;
      camera.fov = THREE.MathUtils.damp(camera.fov, 80, 4, delta);
      camera.updateProjectionMatrix();
      
      if (textRef.current) {
        // Slight stretch on Z axis
        textRef.current.scale.z = THREE.MathUtils.damp(textRef.current.scale.z, 3, 4, delta);
      }
      if (starsRef.current) {
        starsRef.current.position.z = THREE.MathUtils.damp(starsRef.current.position.z, 5, 4, delta);
      }
    }
  });

  return (
    <>
      <group ref={starsRef}>
        <Stars radius={50} depth={50} count={7000} factor={4} saturation={0} fade speed={2} />
      </group>
      <group ref={textRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Center>
            <Text3D
              font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
              size={2}
              height={0.4}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.03}
              bevelSize={0.03}
              bevelOffset={0}
              bevelSegments={5}
            >
              TheGT
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#ffffff" 
                emissiveIntensity={0.5} 
                roughness={0.1} 
                metalness={0.8} 
              />
            </Text3D>
          </Center>
        </Float>
      </group>
    </>
  );
}

// --- Main App ---

const PROFILE_FADE_IN_TIME = 18; // Configurable time in seconds before profile fades in

export default function App() {
  const [stage, setStage] = useState<'gate' | 'transition' | 'profile'>('gate');
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showUI, setShowUI] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showGreatnessText, setShowGreatnessText] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoItem>(() => VIDEOS[Math.floor(Math.random() * VIDEOS.length)]);
  const [playingIntro, setPlayingIntro] = useState(true);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const updateGlow = (time: number) => {
      // Update ~24 times per second to optimize mobile perf
      if (time - lastTime > 40) {
        // Query the video that is currently fading in or fully visible
        const videoEl = document.querySelector('video.opacity-100') as HTMLVideoElement;
        if (videoEl && glowCanvasRef.current && !videoEl.paused && !videoEl.ended) {
          const ctx = glowCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.filter = videoEl.style.filter || 'none';
            ctx.drawImage(videoEl, 0, 0, 64, 64);
          }
        }
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(updateGlow);
    };

    animationFrameId = requestAnimationFrame(updateGlow);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleGateClick = () => {
    if (stage !== 'gate') return;
    setStage('transition');
    setShowGreatnessText(true);
    
    // Robust fullscreen request with vendor prefixes
    const docEl = document.documentElement as any;
    try {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch((e: any) => console.error("Fullscreen failed:", e));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen API error:", err);
    }

    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Video play failed:", e);
          }
        });
      }
    }

    setTimeout(() => {
      setStage('profile');
    }, 1500);

    setTimeout(() => {
      setShowGreatnessText(false);
    }, 6000);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.currentTime > PROFILE_FADE_IN_TIME) {
      setShowUI(true);
    }
  };

  const handleVideoEnded = () => {
    if (playingIntro) {
      setPlayingIntro(false);
      setShowUI(true);
    }
  };

  const handleVideoSelect = (video: VideoItem) => {
    setPlayingIntro(false);
    setActiveVideo(video);
    setVideoEnded(false);
    setShowUI(true);
  };

  const currentSrc = playingIntro ? '/main.mp4' : activeVideo.src;
  const currentKey = playingIntro ? 'intro' : activeVideo.id;

  return (
    <div className="fixed inset-0 bg-[#050505] p-3 sm:p-6 md:p-8 flex items-center justify-center">
      {/* Ambient Glow Canvas */}
      <canvas
        ref={glowCanvasRef}
        width={64}
        height={64}
        className={`absolute inset-0 w-full h-full object-cover blur-[60px] sm:blur-[100px] scale-110 transition-opacity duration-1000 ${currentSrc !== '' && !videoEnded ? 'opacity-60' : 'opacity-0'}`}
      />

      {/* Main Frame */}
      <div className="relative w-full h-full rounded-[2rem] sm:rounded-[2.5rem] bg-black z-10 shadow-2xl border border-white/10">
        
        {/* Background Videos pre-mounted for instant load */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 bg-black overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] ${stage !== 'gate' ? 'opacity-100' : 'opacity-[0.01]'}`}>
          <BackgroundVideo 
            ref={videoRef}
            src="/main.mp4"
            isActive={playingIntro && !videoEnded}
            isIntro={true}
            isMuted={stage === 'gate'}
            shouldLoop={stage === 'gate'}
            onTimeUpdate={playingIntro ? handleTimeUpdate : undefined}
            onEnded={playingIntro ? handleVideoEnded : undefined}
          />
          {VIDEOS.map(video => (
            <BackgroundVideo 
              key={video.id}
              src={video.src}
              isActive={!playingIntro && activeVideo.id === video.id && !videoEnded}
              isIntro={false}
              isMuted={false}
              shouldLoop={true}
            />
          ))}
          {/* Pixelated Filter Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.15) 50%)',
              backgroundSize: '3px 3px'
            }}
          />
        </div>

        {/* 3D Gate */}
        <AnimatePresence>
          {stage !== 'profile' && (
            <motion.div 
              className="absolute inset-0 z-50 cursor-pointer flex items-center justify-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]"
              onClick={handleGateClick}
              initial={{ backgroundColor: 'rgba(0,0,0,1)' }}
              animate={{ backgroundColor: stage === 'transition' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: stage === 'transition' ? 1.5 : 0.5 }}
            >
              <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Suspense fallback={null}>
                  <GateScene isTransitioning={stage === 'transition'} />
                </Suspense>
              </Canvas>
              
              {/* Vignette overlay during transition */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === 'transition' ? 1 : 0 }}
                style={{
                  background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,1) 100%)'
                }}
              />
              
              {stage === 'gate' && (
                <motion.div 
                  className="absolute bottom-10 text-white/50 text-sm tracking-widest uppercase font-medium"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Click to Enter
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greatness Ahead Text */}
        <AnimatePresence>
          {showGreatnessText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/70 text-[11px] tracking-[0.3em] uppercase font-bold pointer-events-none"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
              Greatness Lies Ahead...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Profile UI (Deferred until gate is clicked to optimize initial load) */}
        {stage !== 'gate' && (
          <div 
            className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col rounded-[2rem] sm:rounded-[2.5rem]"
            style={{ pointerEvents: (stage === 'profile' && showUI) ? 'auto' : 'none' }}
          >
            <Suspense fallback={null}>
              <ProfileUI showUI={stage === 'profile' && showUI} />
            </Suspense>
          </div>
        )}
        
        {/* Music Selection Dial */}
        {stage === 'profile' && showUI && (
          <MusicDial onSelect={handleVideoSelect} activeVideo={activeVideo} />
        )}
      </div>
    </div>
  );
}
