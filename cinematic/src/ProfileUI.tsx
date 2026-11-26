import React, { useState, useEffect, useRef } from 'react';
import { Github, Mail } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { LYRICS, currentLyricIndex, currentWordIndex } from './lyrics';
import { usePreloadedImage } from './usePreloadedImage';


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

const SOCIAL_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>> | typeof Github> = {
  youtube: YoutubeIcon,
  github: Github,
  discord: DiscordIcon,
  x: XIcon,
  email: Mail,
};

const DISCORD_USER_ID = '1091039253988905110';
const API_KEY = import.meta.env.VITE_QUOTES_API_KEY?.trim() || 'KITv7/M2QEyfI4famv7fYg==eGlP3wSwgAMaOn9o';

const SOCIAL_LINKS = [
  { id: 'youtube', url: 'https://youtube.com/@clstocks4170', label: 'YouTube Channel' },
  { id: 'github', url: 'https://github.com/angel2rider', label: 'GitHub Profile' },
  { id: 'discord', url: 'https://discord.com/users/1091039253988905110', label: 'Discord Profile' },
  { id: 'x', url: 'https://x.com/TheGT2Angel', label: 'X (Twitter) Profile' },
  { id: 'email', url: 'mailto:vivekpereiraalbert@gmail.com', label: 'Send Email' },
];

const LOCAL_QUOTES = [
  { quote: 'Greatness lies within', author: 'TheGT' },
  { quote: "It's the small things that matter the most", author: 'TheGT' },
  { quote: 'Step through the gate. Discover greatness.', author: 'TheGT' },
  { quote: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { quote: 'Success is not final, failure is not fatal.', author: 'Winston Churchill' },
  { quote: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
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
  16384: { hash: '848f79194d4be5ff5f81505cbd0ce1e6', name: 'Bug Hunter Level 2' },
  131072: { hash: '6df5892e0f35b051f8b61eace34f4967', name: 'Early Verified Bot Developer' },
  262144: { hash: 'fee1624003e2fee35cb398e125dc479b', name: 'Moderator Programs Alumni' },
  4194304: { hash: '6bdc42827a38498929a4920da12695d9', name: 'Active Developer' },
};

const LOCAL_AVATAR = '/avatar.webp';
const LOCAL_DECORATION = '/avatar-decoration.webp';
const LOCAL_BADGES: Record<string, string> = {
  '3aa41de486fa12454c3761e8e223442e': '/badge-0.png',
  '7d9ae358c8c5e118768335dbe68b4fb8': '/badge-1.png',
};

interface ProfileBadge { id: string; description: string; icon: string; link?: string }
interface DiscordProfile {
  user?: {
    avatar_decoration_data?: { asset: string };
    collectibles?: { nameplate?: { asset: string } };
    primary_guild?: { identity_guild_id: string; identity_enabled: boolean; tag: string; badge: string };
  };
  badges?: ProfileBadge[];
}
interface LanyardData {
  discord_user: {
    id: string; username: string; global_name?: string; avatar: string;
    avatar_decoration_data?: { asset: string }; public_flags?: number;
    primary_guild?: { identity_guild_id: string; identity_enabled: boolean; badge: string; tag: string };
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: { type: number; name: string; state?: string; emoji?: { name: string; id?: string; animated?: boolean } }[];
}

function useDiscordProfile(userId: string) {
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://dcdn.dstn.to/profile/${userId}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DiscordProfile | null) => setProfile(data))
      .catch((err) => { if (err.name !== 'AbortError') console.error('Error fetching Discord profile:', err); });
    return () => controller.abort();
  }, [userId]);
  return profile;
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
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
          }, msg.d.heartbeat_interval);
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        } else if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
          setData(msg.d);
        }
      };
      ws.onclose = () => { clearInterval(heartbeat); setTimeout(connect, 5000); };
    }
    connect();
    return () => { clearInterval(heartbeat); if (ws) ws.close(); };
  }, [userId]);
  return data;
}

function getStatusText(data: LanyardData | null) {
  if (!data) return 'Connecting…';
  const custom = data.activities.find((a) => a.type === 4);
  const activity = data.activities.find((a) => a.type !== 4);
  if (activity) return `${activity.type === 0 ? 'Playing' : activity.type === 2 ? 'Listening to' : activity.type === 3 ? 'Watching' : activity.type === 5 ? 'Competing in' : ''} ${activity.name}`.trim();
  if (custom?.state) return custom.state;
  switch (data.discord_status) {
    case 'online': return 'Online';
    case 'idle': return 'Idle';
    case 'dnd': return 'Do Not Disturb';
    case 'offline': return 'Offline';
    default: return 'Unknown';
  }
}

function LyricDisplay({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [pos, setPos] = useState({ line: -1, word: -1, gap: true });
  useEffect(() => {
    let raf = 0;
    let lastLine = -2;
    let lastWord = -2;
    let lastGap = true;
    const tick = () => {
      const t = audioRef.current?.currentTime ?? 0;
      const line = currentLyricIndex(t);
      const word = line >= 0 ? currentWordIndex(LYRICS[line], t) : -1;
      const current = line >= 0 ? LYRICS[line] : null;
      const upcoming = line >= 0 && line + 1 < LYRICS.length ? LYRICS[line + 1] : null;
      const gap = !current || (t > current.end && (!upcoming || t < upcoming.time));
      if (line !== lastLine || word !== lastWord || gap !== lastGap) {
        lastLine = line; lastWord = word; lastGap = gap;
        setPos({ line, word, gap });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audioRef]);

  const line = pos.line >= 0 ? LYRICS[pos.line] : null;
  const previous = !pos.gap && pos.line > 0 ? LYRICS[pos.line - 1].text : '';
  const next = !pos.gap && pos.line >= 0 && pos.line + 1 < LYRICS.length ? LYRICS[pos.line + 1].text : '';

  return (
    <div className="flex min-h-[110px] w-full max-w-xl flex-col items-center justify-center px-2 text-center sm:min-h-[150px]">
      <p className="lyric-line h-4 truncate font-lyric text-sm italic text-cream/20">{previous}</p>
      <p key={pos.line} className="lyric-line appear my-1 max-w-full font-lyric text-[22px] italic leading-tight text-cream sm:text-3xl">
        {line && !pos.gap ? (
          line.words.map((word, i) => (
            <span key={i} className={`lyric-word ${i < pos.word ? 'sung' : ''} ${i === pos.word ? 'active' : ''}`}>{word.text}</span>
          ))
        ) : (
          <span className="inline-flex items-center gap-2 text-cream/55" aria-label="Music playing">
            <span className="font-lyric text-2xl">♪</span>
            <span className="inline-flex items-end gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-cream/45" style={{ transform: `scaleY(${0.6 + (i + 1) * 0.2})` }} />
              ))}
            </span>
            <span className="font-lyric text-xl opacity-60">♫</span>
          </span>
        )}
      </p>
      <p className="lyric-line h-4 truncate font-lyric text-sm italic text-cream/20">{next}</p>
    </div>
  );
}

function RotatingQuote() {
  const [quote, setQuote] = useState<{ quote: string; author: string }>(
    () => LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)]
  );

  useEffect(() => {
    let cancelled = false;
    const fetchQuote = async () => {
      try {
        let candidate: { quote: string; author: string } | null = null;
        for (let attempt = 0; attempt < 4; attempt++) {
          const response = await fetch('https://api.api-ninjas.com/v1/quotes', { headers: { 'X-Api-Key': API_KEY } });
          const data = await response.json();
          if (!Array.isArray(data) || data.length === 0) break;
          candidate = data[0];
          if (candidate.quote.length <= 130) break;
        }
        if (!cancelled && candidate) setQuote(candidate);
      } catch {
        setQuote((prev) => {
          const pool = LOCAL_QUOTES.filter((q) => q.quote !== prev.quote);
          return pool[Math.floor(Math.random() * pool.length)];
        });
      }
    };
    fetchQuote();
    const timer = setInterval(fetchQuote, 10000);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return (
    <div className="flex min-h-[110px] w-full max-w-xl flex-col items-center justify-center px-2 text-center sm:min-h-[150px]">
      <AnimatePresence mode="wait">
        <motion.div key={quote.quote} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-2 [text-shadow:0_2px_24px_rgba(10,8,14,0.95)]">
          <p className="line-clamp-3 font-lyric text-[22px] italic leading-tight text-cream sm:text-3xl">"{quote.quote}"</p>
          <p className="font-hud text-[9px] tracking-[0.25em] text-cream/45">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Dock({ children, nameplateSrc }: { children: React.ReactNode; nameplateSrc?: string }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="relative flex h-16 origin-center items-end justify-center gap-2 overflow-hidden rounded-2xl border border-cream/15 bg-ink/55 px-3 pb-2.5 shadow-[0_18px_50px_rgba(10,8,14,0.4)] backdrop-blur-md sm:gap-3 sm:px-4"
      role="navigation"
      aria-label="Social links"
    >
      {nameplateSrc && (
        <img src={nameplateSrc} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-25 mix-blend-screen" referrerPolicy="no-referrer" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { mouseX } as any) : child
      )}
    </motion.div>
  );
}

function DockItem({ mouseX, href, icon: Icon, label }: { mouseX?: any; href: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | typeof Github; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const width = useSpring(useTransform(distance, [-100, 0, 100], [44, 70, 44]), { mass: 0.1, stiffness: 200, damping: 15 });
  return (
    <motion.a
      ref={ref} href={href} target="_blank" rel="noopener noreferrer"
      style={{ width, height: width }}
      className="relative z-10 flex items-center justify-center rounded-2xl border border-cream/12 bg-cream/[0.05] text-cream/70 transition-colors hover:border-cream/30 hover:bg-cream/15 hover:text-cream"
      aria-label={label}
    >
      <Icon className="h-1/2 w-1/2" aria-hidden="true" />
    </motion.a>
  );
}

function BadgeImage({ src, local, alt }: { src: string; local?: string; alt: string }) {
  const resolved = usePreloadedImage(local ? undefined : src, local ?? src);
  return <img src={resolved} alt={alt} title={alt} className="h-3.5 w-3.5 opacity-80" referrerPolicy="no-referrer" />;
}

export default function ProfileUI({ showUI, audioRef, phase, quotesMode = false }: {
  showUI: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  phase: string;
  quotesMode?: boolean;
}) {
  const lanyard = useLanyard(DISCORD_USER_ID);
  const profile = useDiscordProfile(DISCORD_USER_ID);
  const profileUser = profile?.user;
  const customStatus = lanyard?.activities.find((a) => a.type === 4);

  const fallbackBadges: ProfileBadge[] = lanyard?.discord_user.public_flags
    ? Object.entries(DISCORD_BADGES)
        .filter(([flag]) => (lanyard.discord_user.public_flags! & Number(flag)) === Number(flag))
        .map(([_, badge]) => ({ id: badge.name, description: badge.name, icon: badge.hash }))
    : [];
  const badges = profile?.badges?.length ? profile.badges : fallbackBadges;
  const guild = profileUser?.primary_guild ?? lanyard?.discord_user.primary_guild;
  const avatarDecoration = profileUser?.avatar_decoration_data?.asset ?? lanyard?.discord_user.avatar_decoration_data?.asset;
  const status = lanyard?.discord_status ?? 'offline';
  const statusDot = status === 'online' ? 'bg-teal' : status === 'idle' ? 'bg-sand' : status === 'dnd' ? 'bg-clay' : 'bg-cream/30';
  const avatarSrc = usePreloadedImage(
    lanyard?.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.png?size=256` : undefined,
    LOCAL_AVATAR
  );
  const decorationSrc = usePreloadedImage(
    avatarDecoration ? `https://cdn.discordapp.com/avatar-decoration-presets/${avatarDecoration}.png?size=256&passthrough=true` : undefined,
    LOCAL_DECORATION
  );
  const nameplateSrc = usePreloadedImage(
    profileUser?.collectibles?.nameplate
      ? `https://cdn.discordapp.com/assets/collectibles/${profileUser.collectibles.nameplate.asset}img.png?passthrough=true`
      : undefined,
    '/nameplate.webp'
  );

  const [fit, setFit] = useState(1);
  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const content = contentRef.current;
    const parent = content?.parentElement;
    if (!content || !parent) return;
    const update = () => {
      const h = parent.clientHeight || parent.getBoundingClientRect().height;
      const w = parent.clientWidth || parent.getBoundingClientRect().width;
      const margin = h < 420 ? 52 : 12;
      setFit(Math.max(0.36, Math.min(1, (h - margin) / Math.max(1, content.scrollHeight), (w - 12) / Math.max(1, content.scrollWidth))));
    };
    const observer = new ResizeObserver(update);
    observer.observe(content);
    observer.observe(parent);
    update();
    const delayed = window.setTimeout(update, 600);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      observer.disconnect();
      window.clearTimeout(delayed);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: showUI ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.7, delay: showUI ? delay : 0, ease: 'easeOut' as const },
  });
  const snap = () => ({
    initial: { opacity: 0, y: 6 },
    animate: showUI ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    transition: { duration: 0.1, ease: 'easeOut' as const },
  });

  return (
    <div ref={contentRef} className="relative flex h-full w-full flex-col items-center justify-center gap-8 p-3 sm:gap-12 sm:p-5" style={{ transform: `scale(${fit})`, transformOrigin: 'center center' }}>
      {/* Identity */}
      <motion.div className="flex flex-col items-center gap-5 text-center" {...anim(0)}>
        <div className="relative h-16 w-16 sm:h-20 sm:w-20">
          <img src={avatarSrc} alt="TheGT" className="relative z-10 h-full w-full rounded-full border border-cream/25 object-cover" referrerPolicy="no-referrer" />
          {avatarDecoration && (
            <img src={decorationSrc} alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[118%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover [filter:saturate(0.7)_brightness(0.95)]" />
          )}
          <div className={`absolute bottom-0 right-0 z-30 h-3.5 w-3.5 rounded-full border-2 border-ink ${statusDot}`} />
        </div>

        <div>
          <h1 className="wordmark font-display text-4xl leading-none sm:text-5xl">
            <span className="audio-name inline-block">{(lanyard?.discord_user.global_name || 'TheGT').split('').map((letter, i) => (
              <span key={i} className="name-letter" style={{ '--band': `var(--audio-band-${i % 5})` } as React.CSSProperties}>{letter}</span>
            ))}</span>
          </h1>
          <p className="mt-2 font-hud text-[10px] tracking-[0.25em] text-cream/45">
            @{lanyard?.discord_user.username || 'thegt2angel'} · LEONIDA
          </p>
        </div>

        {quotesMode ? <RotatingQuote /> : <LyricDisplay audioRef={audioRef} />}
      </motion.div>

      {/* Player details + links */}
      <div className="w-full max-w-md min-h-[86px]">
        {(phase === 'full' || phase === 'end') && (
          <motion.div className="flex flex-col items-center gap-5" {...snap()}>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] text-cream/60">
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                <span className="max-w-[180px] truncate">{customStatus?.state || getStatusText(lanyard)}</span>
              </span>
              {guild?.identity_enabled && guild.tag && guild.badge && (
                <span className="font-hud text-[10px] tracking-[0.2em] text-cream/55">{guild.tag}</span>
              )}
              {badges.length > 0 && (
                <span className="flex items-center gap-1.5">
                  {badges.map((badge) => {
                    const src = badge.icon.startsWith('http') ? badge.icon : `https://cdn.discordapp.com/badge-icons/${badge.icon}.png`;
                    const local = badge.icon.startsWith('http') ? undefined : LOCAL_BADGES[badge.icon];
                    return <BadgeImage key={badge.id} src={src} local={local} alt={badge.description} />;
                  })}
                </span>
              )}
            </div>

            <Dock nameplateSrc={nameplateSrc}>
              {SOCIAL_LINKS.map((link) => (
                <DockItem key={link.id} href={link.url} icon={SOCIAL_ICONS[link.id]} label={link.label} />
              ))}
            </Dock>

            <footer className="font-hud text-[9px] tracking-[0.25em] text-cream/25">© 2026 THEGT · VICE CITY</footer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
