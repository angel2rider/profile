/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Github, Mail } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- Custom Icons ---
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// --- Data ---
const SOCIAL_LINKS = [
  { id: 'youtube', url: 'https://youtube.com/@clstocks4170', icon: YoutubeIcon },
  { id: 'github', url: 'https://github.com/angel2rider', icon: Github },
  { id: 'discord', url: 'https://discord.com/users/1091039253988905110', icon: DiscordIcon },
  { id: 'x', url: 'https://x.com/TheGT2Angel', icon: XIcon },
  { id: 'email', url: 'mailto:vivekpereiraalbert@gmail.com', icon: Mail },
];

const DISCORD_BADGES: Record<number, { hash: string; name: string }> = {
  1: { hash: '5e74e9b61934fc1f67c65515d1f7e60d', name: 'Discord Staff' },
  2: { hash: '3f9748e53446a137a052f3454e2de41e', name: 'Partnered Server Owner' },
  4: { hash: 'bf01d1073931f921909045f3a39fd264', name: 'HypeSquad Events' },
  8: { hash: '2717692c7dca7289b35297368a940dd0', name: 'Bug Hunter Level 1' },
  64: { hash: '8a88d63823d8a71cd5e390baa45efa02', name: 'HypeSquad Bravery' },
  128: { hash: '011940fd013da3f7fb926e4a1cd2e618', name: 'HypeSquad Brilliance' },
  256: { hash: '3aa41de486fa12454c3761e8e223442e', name: 'HypeSquad Balance' },
  512: { hash: '7060786766c9c840eb3019e725d2b358', name: 'Early Supporter' },
  16384: { hash: '848f79194d4be5ff5f81505cbc0a2802', name: 'Bug Hunter Level 2' },
  131072: { hash: '6bdc42827a38498929a4920da12695d9', name: 'Early Verified Bot Developer' },
  4194304: { hash: '6bdc42827a38498929a4920da12695d9', name: 'Active Developer' }, // Using known hash for now
};

// --- Lanyard API Types & Hook ---
interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    global_name?: string;
    display_name?: string;
    avatar: string;
    avatar_decoration_data?: {
      asset: string;
    };
    public_flags?: number;
    primary_guild?: {
      identity_guild_id: string;
      identity_enabled: boolean;
      badge: string;
      tag: string;
    };
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: {
    type: number;
    name: string;
    details?: string;
    state?: string;
    application_id?: string;
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
    emoji?: {
      name: string;
      id?: string;
      animated?: boolean;
    };
  }[];
  listening_to_spotify: boolean;
  spotify?: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  };
}

function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let heartbeat: number;

    function connect() {
      ws = new WebSocket('wss://api.lanyard.rest/socket');

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
          heartbeat = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, msg.d.heartbeat_interval);

          ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userId }
          }));
        } else if (msg.op === 0) {
          if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
            setData(msg.d);
          }
        }
      };

      ws.onclose = () => {
        clearInterval(heartbeat);
        setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      clearInterval(heartbeat);
      if (ws) ws.close();
    };
  }, [userId]);

  return data;
}

function getStatusText(data: LanyardData | null) {
  if (!data) return 'Connecting...';
  const customStatus = data.activities.find(a => a.type === 4);
  const activity = data.activities.find(a => a.type !== 4);

  if (activity) {
    if (activity.type === 0) return `Playing ${activity.name}`;
    if (activity.type === 2) return `Listening to ${activity.name}`;
    if (activity.type === 3) return `Watching ${activity.name}`;
    if (activity.type === 5) return `Competing in ${activity.name}`;
    return activity.name;
  }

  if (customStatus?.state) return customStatus.state;

  switch (data.discord_status) {
    case 'online': return 'Online';
    case 'idle': return 'Idle';
    case 'dnd': return 'Do Not Disturb';
    case 'offline': return 'Offline';
    default: return 'Unknown';
  }
}

// --- macOS Dock Components ---
function Dock({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-end justify-center gap-3 h-16 px-4 pb-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { mouseX } as any);
        }
        return child;
      })}
    </motion.div>
  );
}

function DockItem({ mouseX, href, icon: Icon }: { mouseX?: any, href: string, icon: any, key?: string | number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [44, 72, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      style={{ width, height: width }}
      className="flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors shadow-lg"
    >
      <Icon className="w-1/2 h-1/2" />
    </motion.a>
  );
}

// --- Rotating Quote Component ---
function RotatingQuote() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
          headers: { 'X-Api-Key': 'KITv7/M2QEyfI4famv7fYg==eGlP3wSwgAMaOn9o' }
        });
        const data = await response.json();
        if (data && data.length > 0) {
          setQuote(data[0]);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-24 flex items-center justify-center w-full max-w-[90%] mt-1">
      <AnimatePresence mode="wait">
        {quote ? (
          <motion.div
            key={quote.quote}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-1"
          >
            <p className="text-sm text-white/80 font-medium italic text-center line-clamp-3">
              "{quote.quote}"
            </p>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">
              — {quote.author}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-white/40 font-medium"
          >
            Loading quote...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
function ProfileUI() {
  const lanyard = useLanyard('1091039253988905110');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), { stiffness: 150, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), { stiffness: 150, damping: 30 });

  const bgX = useSpring(useTransform(mouseX, [-1, 1], ['-1%', '1%']), { stiffness: 150, damping: 30 });
  const bgY = useSpring(useTransform(mouseY, [-1, 1], ['-1%', '1%']), { stiffness: 150, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const avatarUrl = lanyard?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=256`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  const decorationUrl = lanyard?.discord_user.avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png?size=256`
    : null;

  const statusColors = {
    online: '#23a559',
    idle: '#f0b232',
    dnd: '#f23f43',
    offline: '#80848e',
  };

  const statusColor = lanyard ? statusColors[lanyard.discord_status] : statusColors.offline;

  const customStatus = lanyard?.activities?.find(a => a.type === 4);
  const activity = lanyard?.activities?.find(a => a.type !== 4);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.main 
        style={{ rotateX, rotateY }}
        className="w-full max-w-[400px] flex flex-col items-center text-center relative z-10"
      >
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 mb-4">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
            {decorationUrl && (
              <img
                src={decorationUrl}
                alt="Decoration"
                className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] max-w-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            {lanyard?.discord_user.global_name || lanyard?.discord_user.display_name || lanyard?.discord_user.username || 'TheGT'}
          </h1>
          <RotatingQuote />
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-6" />

        {/* Location Row */}
        <div className="flex items-center gap-1.5 text-white/40 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[11px] font-bold tracking-widest uppercase">TVM, KERALA</span>
        </div>

        {/* Discord Info Panel (Horizontal Card) */}
        <div className="w-full max-w-[440px] p-4 rounded-[2rem] bg-[#111111]/80 border border-white/[0.05] shadow-2xl backdrop-blur-xl mb-12 flex items-center gap-4">
          
          {/* Avatar & Status */}
          <div className="relative w-[72px] h-[72px] shrink-0">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            {decorationUrl && (
              <img
                src={decorationUrl}
                alt="Decoration"
                className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] max-w-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            )}
            {/* Status Dot */}
            <div 
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-[3px] border-[#111111]"
              style={{ backgroundColor: statusColor }}
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col justify-center text-left overflow-hidden w-full">
            <div className="flex items-center gap-2 mb-1.5 w-full min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-white truncate min-w-0">
                {lanyard?.discord_user.global_name || lanyard?.discord_user.display_name || 'TheGT'}
              </h1>
              <span className="text-sm font-medium text-white/40 truncate min-w-0">
                {lanyard?.discord_user.username || 'thegt2angel'}
              </span>
              
              {/* Badges */}
              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                {/* Server Tag Badge */}
                {lanyard?.discord_user.primary_guild?.identity_enabled && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.02]">
                    {lanyard.discord_user.primary_guild.badge && (
                      <img 
                        src={`https://cdn.discordapp.com/guild-tag-badges/${lanyard.discord_user.primary_guild.identity_guild_id}/${lanyard.discord_user.primary_guild.badge}.png`}
                        alt="Guild Badge"
                        className="w-3.5 h-3.5 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="text-[10px] font-semibold text-white/80 tracking-wide">
                      {lanyard.discord_user.primary_guild.tag}
                    </span>
                  </div>
                )}
                
                {/* Discord Badges from public_flags */}
                {Object.entries(DISCORD_BADGES).map(([flag, badge]) => {
                  if (((lanyard?.discord_user.public_flags ?? 0) & Number(flag)) !== 0) {
                    return (
                      <img
                        key={flag}
                        src={`https://cdn.discordapp.com/badge-icons/${badge.hash}.png`}
                        alt={badge.name}
                        title={badge.name}
                        className="w-5 h-5 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Status / Activity */}
            <div className="flex flex-col gap-1">
              {lanyard?.listening_to_spotify && lanyard.spotify ? (
                <div className="flex items-center gap-3 mt-1">
                  <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white/10">
                    <img 
                      src={lanyard.spotify.album_art_url}
                      alt={lanyard.spotify.album}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[12px] font-bold text-white truncate">
                      Listening to Spotify
                    </span>
                    <span className="text-[11px] text-white/60 truncate">{lanyard.spotify.song}</span>
                    <span className="text-[11px] text-white/60 truncate">by {lanyard.spotify.artist}</span>
                  </div>
                </div>
              ) : activity ? (
                <div className="flex items-center gap-3 mt-1">
                  {/* Activity Image */}
                  {activity.assets?.large_image && (
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white/10">
                      <img 
                        src={activity.assets.large_image.startsWith('mp:external/') 
                          ? `https://media.discordapp.net/external/${activity.assets.large_image.replace('mp:external/', '')}`
                          : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {activity.assets.small_image && (
                        <img 
                          src={activity.assets.small_image.startsWith('mp:external/') 
                            ? `https://media.discordapp.net/external/${activity.assets.small_image.replace('mp:external/', '')}`
                            : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
                          alt="small asset"
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111111] bg-[#111111]"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Activity Text */}
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[12px] font-bold text-white truncate">
                      {activity.type === 0 ? 'Playing ' : activity.type === 2 ? 'Listening to ' : activity.type === 3 ? 'Watching ' : ''}
                      {activity.name}
                    </span>
                    {activity.details && (
                      <span className="text-[11px] text-white/60 truncate">{activity.details}</span>
                    )}
                    {activity.state && (
                      <span className="text-[11px] text-white/60 truncate">{activity.state}</span>
                    )}
                  </div>
                </div>
              ) : customStatus ? (
                <p className="text-[13px] font-medium text-[#a0a0a0] truncate flex items-center gap-1.5">
                  {customStatus.emoji?.id ? (
                    <img 
                      src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=16`} 
                      alt="emoji" 
                      className="w-4 h-4 inline-block shrink-0"
                    />
                  ) : customStatus.emoji?.name ? (
                    <span className="shrink-0">{customStatus.emoji.name}</span>
                  ) : null}
                  <span className="truncate">{customStatus.state}</span>
                </p>
              ) : (
                <p className="text-[13px] font-medium text-[#a0a0a0] truncate flex items-center gap-1.5">
                  <span className="truncate">{getStatusText(lanyard)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* macOS Dock Social Links */}
        <div className="mb-16">
          <Dock>
            {SOCIAL_LINKS.map((link) => (
              <DockItem key={link.id} href={link.url} icon={link.icon} />
            ))}
          </Dock>
        </div>

        {/* Footer */}
        <footer className="text-[10px] font-medium tracking-widest uppercase text-white/20">
          © TheGT
        </footer>

      </motion.main>
    </div>
  );
}

const PROFILE_FADE_IN_TIME = 18; // Configurable time in seconds before profile fades in

export default function App() {
  const [stage, setStage] = useState<'gate' | 'transition' | 'profile'>('gate');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showUI, setShowUI] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleGateClick = () => {
    if (stage !== 'gate') return;
    setStage('transition');
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(e => console.error("Fullscreen failed:", e));
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error("Video play failed:", e));
    }

    setTimeout(() => {
      setStage('profile');
    }, 1500);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime > PROFILE_FADE_IN_TIME) {
      setShowUI(true);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  return (
    <>
      {/* Background Video */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-1000 bg-black ${stage !== 'gate' ? 'opacity-100' : 'opacity-0'}`}>
        {!videoEnded && (
          <video 
            ref={videoRef}
            src="https://cdn.jsdelivr.net/gh/angel2rider/profile@main/main.mp4" 
            className="w-full h-full object-cover"
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
          />
        )}
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
            className="fixed inset-0 z-50 cursor-pointer flex items-center justify-center"
            onClick={handleGateClick}
            initial={{ backgroundColor: 'rgba(0,0,0,1)' }}
            animate={{ backgroundColor: stage === 'transition' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: stage === 'transition' ? 1.5 : 0.5 }}
          >
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
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

      {/* Main Profile UI (Preloaded invisibly) */}
      <motion.div 
        className="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: (stage === 'profile' && showUI) ? 1 : 0, 
          y: (stage === 'profile' && showUI) ? 0 : 20 
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ pointerEvents: (stage === 'profile' && showUI) ? 'auto' : 'none' }}
      >
        <ProfileUI />
      </motion.div>
    </>
  );
}
