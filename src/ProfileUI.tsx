import React, { useState, useEffect, useRef } from 'react';
import { Github, Mail } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';

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
  4194304: { hash: '6bdc42827a38498929a4920da12695d9', name: 'Active Developer' },
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
      className="flex items-end justify-center gap-3 h-16 px-4 pb-2.5 rounded-2xl bg-white/10 border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-md"
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
      className="flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-colors shadow-lg"
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
    <div className="min-h-[60px] flex items-center justify-center w-full max-w-[90%] mt-2">
      <AnimatePresence mode="wait">
        {quote ? (
          <motion.div
            key={quote.quote}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-1 text-center"
          >
            <p className="text-sm text-white/80 font-medium italic text-center line-clamp-3 leading-snug">
              "{quote.quote}"
            </p>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">
              — {quote.author}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-white/40 font-medium text-center"
          >
            Loading quote...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Fireflies Component ---
function Fireflies() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
      {[...Array(15)].map((_, i) => {
        const randomX = (Math.random() - 0.5) * 250;
        const randomY = (Math.random() - 0.5) * 100;
        const randomDuration = Math.random() * 4 + 3;
        const randomDelay = Math.random() * -5;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#eab308] rounded-full"
            style={{
              boxShadow: '0 0 8px 2px rgba(234, 179, 8, 0.6)'
            }}
            animate={{
              x: [randomX, randomX + (Math.random() - 0.5) * 50, randomX],
              y: [randomY, randomY + (Math.random() - 0.5) * 50, randomY],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: randomDelay
            }}
          />
        );
      })}
    </div>
  );
}

export default function ProfileUI({ showUI }: { showUI: boolean }) {
  const lanyard = useLanyard('1091039253988905110');
  const customStatus = lanyard?.activities.find(a => a.type === 4);
  const activeBadges = lanyard?.discord_user.public_flags 
    ? Object.entries(DISCORD_BADGES)
        .filter(([flag]) => (lanyard.discord_user.public_flags! & parseInt(flag)) === parseInt(flag))
        .map(([_, badge]) => badge)
    : [];

  const getAnimProps = (delay: number) => ({
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: showUI ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 },
    transition: { duration: 0.8, delay: showUI ? delay : 0, ease: "easeOut" as const }
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useSpring(useTransform(mouseY, [-10, 10], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-10, 10], [-10, 10]), { stiffness: 150, damping: 20 });

  return (
    <div 
      className="min-h-full flex flex-col items-center justify-center p-6 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.main 
        className="w-full max-w-2xl flex flex-col items-center justify-center gap-10 z-10"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 text-center" style={{ transform: 'translateZ(30px)' }}>
          <motion.div className="relative group flex items-center justify-center w-32 h-32" {...getAnimProps(0)}>
            <img 
              src={lanyard?.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=256` : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&auto=format&fit=crop"}
              alt="Profile" 
              className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20 shadow-2xl z-10"
              referrerPolicy="no-referrer"
            />
            {lanyard?.discord_user.avatar_decoration_data && (
              <img 
                src={`https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png?size=256&passthrough=true`}
                alt="Avatar Decoration"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-none object-cover pointer-events-none z-20"
              />
            )}
          </motion.div>
          
          <motion.div className="relative flex flex-col items-center justify-center gap-2 w-full" {...getAnimProps(0.1)}>
            <Fireflies />
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg relative z-10">
              {lanyard?.discord_user.global_name || 'TheGT'}
            </h1>
            <div className="relative z-10 w-full flex justify-center">
              <RotatingQuote />
            </div>
          </motion.div>
        </div>

        {/* Discord Card */}
        <motion.div 
          className="w-full max-w-md bg-[#111214]/80 backdrop-blur-xl rounded-[24px] p-5 border border-white/10 shadow-2xl relative overflow-hidden group"
          {...getAnimProps(0.3)}
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative shrink-0 flex items-center justify-center w-16 h-16">
              <img 
                src={lanyard?.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=128` : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=128&auto=format&fit=crop"}
                alt="Discord Avatar" 
                className="w-16 h-16 rounded-full object-cover border border-white/10 z-10"
                referrerPolicy="no-referrer"
              />
              {lanyard?.discord_user.avatar_decoration_data && (
                <img 
                  src={`https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png?size=128&passthrough=true`}
                  alt="Avatar Decoration"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[125%] h-[125%] max-w-none object-cover pointer-events-none z-20"
                />
              )}
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#111214] z-30 ${
                lanyard?.discord_status === 'online' ? 'bg-[#23a559]' :
                lanyard?.discord_status === 'idle' ? 'bg-[#f0b232]' :
                lanyard?.discord_status === 'dnd' ? 'bg-[#f23f43]' : 'bg-[#80848e]'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <h2 className="text-lg font-bold text-white truncate leading-none">
                    {lanyard?.discord_user.global_name || 'TheGT'}
                  </h2>
                  <span className="text-sm font-medium text-[#b5bac1] truncate leading-none">
                    {lanyard?.discord_user.username || 'thegt2angel'}
                  </span>
                </div>
                
                {activeBadges.length > 0 && (
                  <div className="flex items-center gap-1 shrink-0 bg-[#1e1f22] px-2 py-1 rounded-md border border-white/5">
                    {activeBadges.map((badge, i) => (
                      <img 
                        key={i}
                        src={`https://cdn.discordapp.com/badge-icons/${badge.hash}.png`}
                        alt={badge.name}
                        title={badge.name}
                        className="w-4 h-4"
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-[#1e1f22] rounded-lg px-3 py-2 border border-white/5">
                {customStatus ? (
                  <p className="text-[13px] font-medium text-[#dbdee1] flex items-center gap-1.5 truncate">
                    {customStatus.emoji?.id ? (
                      <img 
                        src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}`} 
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
        </motion.div>

        {/* macOS Dock Social Links */}
        <motion.div className="mb-16" {...getAnimProps(0.2)}>
          <Dock>
            {SOCIAL_LINKS.map((link) => (
              <DockItem key={link.id} href={link.url} icon={link.icon} />
            ))}
          </Dock>
        </motion.div>

        {/* Footer */}
        <motion.footer className="text-[10px] font-medium tracking-widest uppercase text-white/20" {...getAnimProps(0.4)}>
          © TheGT
        </motion.footer>

      </motion.main>

    </div>
  );
}
