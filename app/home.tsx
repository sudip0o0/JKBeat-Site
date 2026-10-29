'use client'; // Interactive landing-page components.

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useInView, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/config';

type ToastConfig = { message: string; actionLabel?: string; onAction?: () => void };
const ToastContext = createContext<(message: string, action?: { label: string; onClick: () => void }) => void>(() => {});
const APK_DOWNLOAD_URL = 'https://github.com/sudipmondal999/JKBeat-Releases/releases/latest/download/JKBeat.apk';
const HELP_EMAIL = 'sudipmondal4220@gmail.com';
const HELP_SUBJECT = 'JKBeat Website - Help Request';
const HELP_BODY = 'Hello JKBeat Support,\n\nI need help with JKBeat.\n\nMy issue:\n[Please describe your issue here]\n\nThank you.';
const tracks = [
  { title: 'Jailer 2', artist: 'Thimble', art: 'violet' },
  { title: 'Neon Pulse', artist: 'JKBeat Collective', art: 'orange' },
  { title: 'Monsoon Lights', artist: 'Aria Sky', art: 'blue' },
  { title: 'Velvet Orbit', artist: 'DJ Nova', art: 'pink' },
  { title: 'Afterglow Avenue', artist: 'Echo Atlas', art: 'green' },
  { title: 'Soft Satellites', artist: 'Luma Drift', art: 'gold' },
];
const moods = ['Chill','Commute','Energize','Feel Good','Focus','Gaming','Party','Romance','Sad','Sleep','Workout'];
const genres = ['African','Arabic','Bengali','Bhojpuri','Classical','Country','Dance & Electronic','Desi Hip-Hop','Hip Hop','Indie','K-Pop','Pop','Rock','Tamil','Telugu'];
function Icon({ name, rounded = false }: { name: string; rounded?: boolean }) { return <span aria-hidden="true" className={rounded ? 'material-symbols-rounded' : 'material-symbols-outlined'}>{name}</span>; }
function GitHubIcon() { return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.09.67-3.74-1.31-3.74-1.31-.51-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.24.92.1-.72.39-1.2.71-1.48-2.46-.28-5.05-1.23-5.05-5.49 0-1.21.43-2.2 1.14-2.97-.11-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.64 10.64 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.59 5.2-5.06 5.48.4.35.75 1.02.75 2.06V22c0 .29.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" /></svg>; }
function Logo({ large = false }: { large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <span className={`brand ${large ? 'brand-large' : ''}`}><span className="logo-crop">{failed ? <Icon name="headphones" rounded /> : <img src="/logo.jpg" alt="" onError={() => setFailed(true)} />}</span><span>JKBeat<span className="brand-dot">.</span></span></span>;
}
function openHelpMail() {
  const mailto = `mailto:${HELP_EMAIL}?subject=${encodeURIComponent(HELP_SUBJECT)}&body=${encodeURIComponent(HELP_BODY)}`;
  const fallback = () => {
    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(HELP_EMAIL);
        window.dispatchEvent(new CustomEvent('jkbeat-toast', { detail: { message: 'Support email copied to clipboard.' } }));
      } catch {
        window.dispatchEvent(new CustomEvent('jkbeat-toast', { detail: { message: `Support email: ${HELP_EMAIL}` } }));
      }
    };
    window.dispatchEvent(new CustomEvent('jkbeat-toast', { detail: { message: `No email app found. Email us at ${HELP_EMAIL}.`, actionLabel: 'Copy email', action: copyEmail } }));
  };
  const timer = window.setTimeout(fallback, 1200);
  try {
    window.location.href = mailto;
  } catch {
    window.clearTimeout(timer);
    fallback();
  }
}

function RequestHelpButton() {
  const toast = useContext(ToastContext);
  return <Button variant="default" onClick={() => {
    const mailto = `mailto:${HELP_EMAIL}?subject=${encodeURIComponent(HELP_SUBJECT)}&body=${encodeURIComponent(HELP_BODY)}`;
    const fallback = () => {
      toast(`No email app found. Email us at ${HELP_EMAIL}.`, { label: 'Copy email', onClick: async () => {
        try {
          await navigator.clipboard.writeText(HELP_EMAIL);
          toast('Support email copied to clipboard.');
        } catch {
          toast(`Support email: ${HELP_EMAIL}`);
        }
      } });
    };
    const timer = window.setTimeout(fallback, 1200);
    try {
      window.location.href = mailto;
    } catch {
      window.clearTimeout(timer);
      fallback();
    }
  }}>{<Icon name="mail"/>} Request Help</Button>;
}

function ExternalButton({ label, url, icon = 'arrow_outward', variant = 'outline' }: { label: string; url?: string; icon?: string; variant?: 'default'|'outline'|'ghost' }) {
  const toast = useContext(ToastContext);
  const handleClick = (event?: React.MouseEvent<HTMLElement>) => {
    if (label === 'Request Help') return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    toast('Coming Soon!');
  };
  return url ? <Button asChild variant={variant} onClick={handleClick}><a href={url} target="_blank" rel="noopener noreferrer" onClick={event => { event.preventDefault(); handleClick(event); }}>{icon === 'github' ? <GitHubIcon/> : <Icon name={icon}/>} {label}</a></Button> : <Button variant={variant} onClick={handleClick}>{icon === 'github' ? <GitHubIcon/> : <Icon name={icon}/>} {label}</Button>;
}
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.5 }}>{children}</motion.div>;
}
function Navbar({ light, toggle }: { light: boolean; toggle: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="navbar"><div className="nav-inner"><a href="#" aria-label="JKBeat home"><Logo/></a><nav aria-label="Main navigation" className={open ? 'nav-links open' : 'nav-links'}>{['Features','Interface','Downloads','Community','Help'].map(n => <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setOpen(false)}>{n}</a>)}</nav><div className="nav-actions"><Button variant="ghost" size="icon" aria-label={`Switch to ${light ? 'dark' : 'light'} theme`} onClick={toggle}><Icon name={light ? 'dark_mode' : 'light_mode'}/></Button><span className="nav-github"><ExternalButton label="GitHub" url={siteConfig.github} icon="github" variant="ghost"/></span><Button asChild size="sm"><a href="#downloads">Download <Icon name="arrow_downward"/></a></Button><Button size="icon" variant="ghost" className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></Button></div></div></header>;
}
function AlbumArt({ art, className = '' }: { art: string; className?: string }) { return <div className={`album-art ${art} ${className}`} aria-hidden="true"><div className="orb"/><div className="art-grain"/><span>JK / SOUND SERIES</span></div>; }
function Equalizer({ playing = true }: { playing?: boolean }) { return <div className={`equalizer ${playing ? '' : 'paused'}`} aria-hidden="true">{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${15 + ((i * 37) % 85)}%`, animationDelay: `${i * -0.13}s` }}/>)}</div>; }
export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    audio.pause();
    setIsPlaying(false);
  };
  const artStyle = {
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: "linear-gradient(0deg, rgba(27, 14, 28, 0.52), rgba(27, 14, 28, 0.18)), url('/jailer2-cover.jpg')",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as const;
  const artworkLabelStyle = {
    position: 'absolute',
    left: '12%',
    bottom: '11%',
    padding: '5px 9px',
    borderRadius: 4,
    background: '#110b16b8',
    color: '#fff',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: '1.6px',
  } as const;
  const coverPlayStyle = {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 82,
    height: 82,
    borderRadius: 18,
    border: 'none',
    background: 'rgba(226, 43, 43, 0.92)',
    boxShadow: '0 18px 32px rgba(0,0,0,0.28)',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    cursor: 'pointer',
  };
  return <section className="hero container"><Reveal className="hero-copy"><div className="eyebrow pill"><span className="status-dot"/> OPEN SOURCE. OPEN POSSIBILITIES.</div><h1><span className="hero-intro">JKBeat — The Advanced YouTube Music Client</span>Your music.<br/><span className="gradient-text">Your rules.</span></h1><p>Built with Material Design 3 for Android, Windows, Linux &amp; macOS. Open-source, ad-free, and yours to customize.</p><div className="hero-buttons"><Button asChild><a href="#downloads"><Icon name="download"/> Download Now</a></Button><ExternalButton label="View on GitHub" url={siteConfig.github} icon="github"/></div><div className="platform-line"><Icon name="android"/><Icon name="desktop_windows"/><Icon name="terminal"/><Icon name="laptop_mac"/><span>One rhythm. Every platform.</span></div></Reveal><Reveal className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-glow"/><div className="hero-player"><div className="player-top"><span><span className="status-dot"/> NOW PLAYING</span><Icon name="more_horiz"/></div>  <div className="hero-cover" style={artStyle} role="img" aria-label="Jailer 2 album art"><span style={artworkLabelStyle}>JAILER 2</span></div><div className="track-title"><div><h3>Jailer 2</h3><p>Thimble</p></div><Icon name="favorite"/></div><div className="progress"><span style={{width:'38%'}}/></div><div className="time-row"><span>1:24</span><span>3:42</span></div><div className="hero-controls"><Icon name="shuffle"/><Icon name="skip_previous"/><Button size="icon" aria-label={isPlaying ? 'Pause Jailer 2' : 'Play Jailer 2'} onClick={togglePlayback}><Icon name={isPlaying ? 'pause' : 'play_arrow'} rounded/></Button><Icon name="skip_next"/><Icon name="repeat"/></div><audio ref={audioRef} src="/audio/jailer2.mp3" preload="auto" onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} /><Equalizer playing={isPlaying}/></div><div className="floating-tag"><Icon name="graphic_eq"/><div>Lose yourself in sound.<small>Find yourself in JKBeat.</small></div></div><div className="hero-caption"><Icon name="code"/> Open Source · Community Driven · Free Forever</div></Reveal></section>;}
function HeroPlayerControls({ onPlay, videoPlaying = false }: { onPlay?: () => void; videoPlaying?: boolean }) { const [playing,setPlaying] = useState(false); const isOfficialVideo = Boolean(onPlay); const handlePlay = () => { if (isOfficialVideo) { onPlay?.(); return; } setPlaying(!playing); }; const buttonLabel = videoPlaying ? 'Use the YouTube controls to pause playback' : playing ? 'Pause visual preview' : isOfficialVideo ? 'Play Jailer 2' : 'Play visual preview'; return <><div className="progress"><span style={{width:'38%'}}/></div><div className="time-row"><span>1:24</span><span>3:42</span></div><div className="hero-controls"><Icon name="shuffle"/><Icon name="skip_previous"/><Button size="icon" aria-label={buttonLabel} disabled={videoPlaying} onClick={handlePlay}><Icon name={videoPlaying ? 'volume_up' : playing ? 'pause' : 'play_arrow'} rounded/></Button><Icon name="skip_next"/><Icon name="repeat"/></div><span className="demo-caption">{isOfficialVideo ? (videoPlaying ? 'Official YouTube video · use its controls to pause or seek' : 'Tap play to load the official YouTube video') : 'Interactive visual preview · no audio'}</span></>; }function Counter({ value, suffix }: { value: number; suffix: string }) { const ref=useRef<HTMLSpanElement>(null);const visible=useInView(ref,{once:true}); const reduced=useReducedMotion(); const [count,setCount]=useState(0);useEffect(()=>{if(!visible)return;if(reduced){setCount(value);return;}let frame=0;const start=performance.now();const tick=(now:number)=>{const p=Math.min((now-start)/1000,1);setCount(Math.round(value*(1-Math.pow(1-p,3))));if(p<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[visible,value,reduced]);return <span ref={ref}>{count}{suffix}</span>; }
export function StatsStrip() { return <div className="container"><div className="stats-strip"><div><strong><Counter value={12} suffix="K+"/></strong><span>Downloads</span></div><div><strong>4.8<span className="star">★</span></strong><span>Community rating</span></div><div><strong><Counter value={200} suffix="+"/></strong><span>Contributors</span></div><div><strong>100%</strong><span>Free &amp; open source</span></div></div><p className="demo-caption centered">Illustrative community statistics for this showcase.</p></div>; }
export function AppMockup() {
  const [active,setActive]=useState('Library'); const [mood,setMood]=useState('Chill'); const [track,setTrack]=useState(0); const [playing,setPlaying]=useState(false);const [progress,setProgress]=useState(32); const [query,setQuery]=useState(''); const [liked,setLiked]=useState<number[]>([1,3]);const toast=useContext(ToastContext);
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setProgress(p=>p>=100?0:p+0.25),600);return()=>clearInterval(timer);},[playing]);
  const side=['Library','Liked','Downloaded','Cached','My Top 50','Local','Import Spotify','Import YouTube'];const icons=['library_music','favorite','download','offline_bolt','trending_up','folder','playlist_add','subscriptions'];
  const filtered=tracks.filter((t,i)=>(active!=='Liked'||liked.includes(i))&&`${t.title} ${t.artist}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="app-mockup"><div className="window-bar"><div className="window-dots"><i/><i/><i/></div><span>JKBeat / Desktop preview</span><span className="preview-badge">DEMO</span></div><div className="app-body"><aside className="app-sidebar"><Logo/><div className="sidebar-label">YOUR MUSIC</div>{side.map((s,i)=><button key={s} className={active===s?'active':''} onClick={()=>{if(s.startsWith('Import'))toast(`${s} is a preview. Connect your account in the released app.`);else setActive(s);}}><Icon name={icons[i]}/><span>{s}</span></button>)}<div className="sidebar-bottom"><Icon name="graphic_eq"/> Made for your rhythm.</div></aside><div className="app-main"><div className="app-toolbar"><span>Good evening, music lover <span className="wave">✦</span></span><label className="search"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your sound" aria-label="Search demo tracks"/></label></div><div className="app-banner"><div><span className="eyebrow">YOUR NEXT OBSESSION</span><h3>A little louder.<br/>A little more you.</h3><button onClick={()=>{setTrack((track+1)%tracks.length);setPlaying(true);}}>Find your vibe <Icon name="arrow_forward"/></button></div><div className="banner-disc"/></div><div className="section-line"><h3>{active==='Library'?'Quick picks':active}</h3><span>{filtered.length} demo tracks</span></div><div className="quick-grid">{filtered.map(t=><button key={t.title} className={`quick-track ${tracks[track]===t?'selected':''}`} onClick={()=>{setTrack(tracks.indexOf(t));setPlaying(true);setProgress(0);}}><AlbumArt art={t.art}/><span><strong>{t.title}</strong><small>{t.artist}</small></span><Icon name={tracks[track]===t&&playing?'pause':'play_arrow'}/></button>)}{filtered.length===0&&<p>No tracks match your search.</p>}</div><div className="section-line"><h3>Keep listening</h3><span>Made for you</span></div><div className="listening-row">{tracks.map(t=><button className="listening-card" key={t.title} onClick={()=>{setTrack(tracks.indexOf(t));setPlaying(true);}}><AlbumArt art={t.art}/><strong>{t.title}</strong><small>{t.artist}</small></button>)}</div><div className="section-line"><h3>Explore</h3><span>{mood} radio</span></div><p className="sidebar-label">MOODS &amp; MOMENTS</p><div className="chips">{moods.map(m=><button key={m} aria-pressed={mood===m} className={m===mood?'active':''} onClick={()=>setMood(m)}>{m}</button>)}</div><p className="mood-message">{mood} picks: {tracks[moods.indexOf(mood)%tracks.length].title} and more from the JKBeat demo library.</p><details className="genres"><summary>Browse genres</summary><div className="chips">{genres.map(g=><button key={g} onClick={()=>toast(`${g} discovery is coming to the full app.`)}>{g}</button>)}</div></details></div></div><div className="mini-player"><span className="mini-time mini-time-left">1:24</span><div className="mini-progress"><span style={{ width: `${progress}%` }}/></div><button type="button" className="mini-play-button" aria-label={playing?'Pause demo playback':'Start demo playback'} onClick={()=>setPlaying(!playing)}><Icon name={playing?'pause':'play_arrow'} /></button><button type="button" className="mini-next-button" aria-label="Next track" onClick={()=>{setTrack((track+1)%tracks.length);setProgress(0);}}><Icon name="skip_next"/></button><button type="button" className="mini-volume-button" aria-label="Volume"><Icon name="volume_up"/></button><span className="mini-time mini-time-right">3:42</span></div></div>;
}
const features=[['music_note','A better way to listen','An advanced YouTube Music experience, shaped by Material Design 3.'],['palette','Modern & elegant','Expressive colors, thoughtful spacing, and a beautifully focused design.'],['tune','Make it your own','Customize your interface, your controls, and your everyday listening.'],['explore','Find your next favorite','Discover fresh sounds, explore moods, and follow your curiosity.'],['headphones','Every detail, amplified','High-quality audio playback designed for immersive listening.'],['playlist_add','Take your music along','Build playlists and keep your favorite tracks ready for offline listening.'],['sync','Your world of music','YouTube Music integration brings your favorites into one familiar place.'],['graphic_eq','More control. More feeling.','A 10-band equalizer, gestures, Chromecast, and Bluetooth support.'],['library_music','A library that gets you','Bring order to your favorites with smart filters and collections.'],['devices','Every screen. Same rhythm.','A tailored experience on Android, Windows, Linux, and macOS.'],['update','Always moving forward','Community-led updates make the experience better, release after release.'],['bolt','Less friction. More music.','Fast navigation and thoughtful controls keep you close to your sound.']];
export function FeatureCard({ item, index }: { item: string[]; index: number }) { return <Reveal className="feature-card"><div className={`feature-icon tint-${index%3}`}><Icon name={item[0]}/></div><h3>{item[1]}</h3><p>{item[2]}</p></Reveal>; }
function SectionHeading({ label,title,description }: { label:string;title:string;description?:string }) { return <div className="section-heading"><span className="eyebrow">{label}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>; }
export function TeamCard({ name,role,icon }: {name:string;role:string;icon:string}) { return <div className="team-card"><div className="avatar"><Icon name={icon}/></div><h3>{name} <Icon name="verified"/></h3><p>{role}</p></div>; }
export function InterfaceCarousel() {
 const [tab,setTab]=useState(0); const [eq,setEq]=useState([45,65,60,40,55,70,50,65,40,60]); const names=['Immersive Player','Smart Library','Explore & Discover','Equalizer & Settings']; const icons=['album','library_music','explore','graphic_eq'];
 const [audioEnabled,setAudioEnabled]=useState(false);
 function move(e:React.KeyboardEvent<HTMLButtonElement>,i:number){let next=i;if(e.key==='ArrowRight')next=(i+1)%4;else if(e.key==='ArrowLeft')next=(i+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;e.preventDefault();setTab(next);document.getElementById(`showcase-tab-${next}`)?.focus();}
 return <div className="showcase"><div role="tablist" aria-label="App interface screens" className="showcase-tabs">{names.map((n,i)=><button key={n} id={`showcase-tab-${i}`} role="tab" aria-selected={tab===i} aria-controls="showcase-panel" tabIndex={tab===i?0:-1} onKeyDown={e=>move(e,i)} onClick={()=>setTab(i)}><span>0{i+1}</span><Icon name={icons[i]}/><strong>{n}</strong><Icon name="arrow_outward"/></button>)}</div><div className="showcase-screen" role="tabpanel" id="showcase-panel" aria-labelledby={`showcase-tab-${tab}`} tabIndex={0}><div className="showcase-top"><Logo/><span>0{tab+1} / 04</span></div>{tab===0?<div className="immersive-view"><AlbumArt art="blue"/><div><span className="eyebrow">LOSE YOURSELF IN THE DETAILS</span><h3>Monsoon Lights</h3><p>Aria Sky · Blue Hour Sessions</p><div className="mini-player showcase-audio"><audio src="/audio/monsoon-lights.mp3" preload="auto" controls={audioEnabled} style={{ display: audioEnabled ? 'block' : 'none', width: '100%' }} /><button type="button" className="play-audio-toggle" onClick={()=>setAudioEnabled(v=>!v)}><Icon name={audioEnabled ? 'pause' : 'play_arrow'} rounded /></button>{!audioEnabled && <div className="showcase-audio-hint">Interactive visual preview · no audio</div>}</div></div></div>:tab===1?<div className="library-view"><h3>Everything you love.<br/>All in one place.</h3><div className="library-grid">{['Liked songs','Downloads','My Top 50','Local music'].map((n,i)=><div key={n}><Icon name={['favorite','download','trending_up','folder'][i]}/><strong>{n}</strong><span>{[24,18,50,12][i]} tracks · demo</span></div>)}</div></div>:tab===2?<div className="explore-view"><h3>There’s a sound for every mood.</h3><div className="mood-grid">{['Late-night focus','Weekend energy','Slow mornings','Into the unknown'].map((n,i)=><div key={n}><AlbumArt art={tracks[i+1].art}/><strong>{n}</strong></div>)}</div></div>:<div className="eq-view"><div className="section-line"><h3>Shape your sound.</h3><Button variant="outline" size="sm" onClick={()=>setEq(Array(10).fill(50))}>Reset</Button></div><p>10-band equalizer · interactive visual demo</p><div className="eq-sliders">{eq.map((v,i)=><label key={i}><input type="range" min="0" max="100" value={v} aria-label={`${['31','62','125','250','500','1k','2k','4k','8k','16k'][i]} Hz equalizer band`} onChange={e=>setEq(eq.map((x,j)=>j===i?Number(e.target.value):x))}/><span>{['31','62','125','250','500','1k','2k','4k','8k','16k'][i]}</span></label>)}</div></div>}</div></div>;
}
export function DownloadCard({ platform,icon,format,requirement }: {platform:keyof typeof siteConfig.downloads;icon:string;format:string;requirement:string}) { const toast=useContext(ToastContext); const isAndroid = platform === 'Android'; const handleDownload = () => {
  if (!isAndroid) {
    toast('Coming Soon!');
    return;
  }
  const link = document.createElement('a');
  link.href = APK_DOWNLOAD_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = 'JKBeat.apk';
  document.body.appendChild(link);
  link.click();
  link.remove();
};
return <div className="download-card"><div className="download-top"><div className="platform-icon"><Icon name={icon}/></div><span className="release-badge"><span className="status-dot"/> Stable Build v{siteConfig.version}</span></div><h3>{platform}</h3><p>{requirement}</p><Button className="download-button" onClick={handleDownload}>Download {format}<Icon name="download"/></Button></div>; }
export function Footer() { const toast=useContext(ToastContext);const groups=[['Product','Features','Downloads','Changelog'],['Community','GitHub','Discord','Contribute'],['Legal','License','Privacy','Terms'],['Contact','Get in touch','Twitter / X']];return <footer className="container"><div className="footer-main"><div><a href="#" aria-label="JKBeat home"><Logo large/></a><p>Your music. Your rules.<br/>Built together. Enjoyed everywhere.</p></div>{groups.map(group=><div className="footer-column" key={group[0]}><h3>{group[0]}</h3>{group.slice(1).map(n=>n==='Features'||n==='Downloads'?<a href={`#${n.toLowerCase()}`} key={n}>{n}</a>:<button key={n} onClick={()=>toast('Coming Soon!')}>{n}</button>)}</div>)}</div><div className="footer-bottom"><span>© 2025 JKBeat</span><p>JKBeat is an unofficial, open-source client and is not affiliated with YouTube or Google.</p><div className="footer-socials"><button aria-label="GitHub" onClick={()=>toast('Coming Soon!')}><GitHubIcon/></button><button aria-label="Discord" onClick={()=>toast('Coming Soon!')}><Icon name="forum"/></button><button aria-label="Twitter X" onClick={()=>toast('Coming Soon!')}>𝕏</button></div></div></footer>; }
export default function Page() {
 const [light,setLight]=useState(false); const [toast,setToast]=useState<ToastConfig | null>(null); const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{try{setLight(localStorage.getItem('jkbeat-theme')==='light');}catch{}return()=>{if(timer.current)clearTimeout(timer.current);};},[]);
 useEffect(()=>{document.documentElement.dataset.theme=light?'light':'dark';},[light]);
 const notify=(message:string, action?: { label:string; onClick: () => void })=>{const next = action ? { message, actionLabel: action.label, onAction: action.onClick } : { message }; setToast(next); if(timer.current)clearTimeout(timer.current); timer.current=setTimeout(()=>setToast(null),5000);};
 const toggle=()=>{setLight(!light);try{localStorage.setItem('jkbeat-theme',!light?'light':'dark');}catch{}};
 return <MotionConfig reducedMotion="user"><ToastContext.Provider value={notify}><a className="skip-link" href="#main">Skip to content</a><Navbar light={light} toggle={toggle}/><main id="main"><Hero/><section id="features" className="section container"><SectionHeading label="BUILT FOR THE WAY YOU LISTEN" title="All the good stuff. No compromises." description="Everything that makes JKBeat the ultimate music client."/><div className="feature-grid">{features.map((f,i)=><FeatureCard key={f[0]} item={f} index={i}/>)}</div></section><section id="community" className="section community-section"><div className="container"><Reveal className="community-intro"><div><span className="eyebrow">BY MUSIC LOVERS. FOR MUSIC LOVERS.</span><h2>Open Source<br/><span className="gradient-text">at its Heart.</span></h2><p>JKBeat is built by music lovers for music lovers. Contribute, customize, and help us build the best open-source music player.</p><ExternalButton label="Contribute on GitHub" icon="github" url={siteConfig.github} variant="default"/></div><div className="source-art" aria-hidden="true"><span>{'{ '}</span><Icon name="favorite"/><span>{' }'}</span><small>made with a little code &amp; a lot of love</small></div></Reveal><p className="release-note"><span className="status-dot"/> Latest Stable Version <strong>v{siteConfig.version}</strong><span>Showcase release label</span></p></div></section><section id="interface" className="section container"><SectionHeading label="DESIGNED TO DISAPPEAR INTO YOUR MUSIC" title="The Interface" description="A glimpse into the Material Design 3 experience across platforms."/><Reveal><InterfaceCarousel/></Reveal></section><section id="downloads" className="section container"><SectionHeading label="YOUR NEXT FAVORITE APP IS HERE" title="Good music goes everywhere." description="Download the latest official release of JKBeat for your platform."/><div className="download-grid"><DownloadCard platform="Android" icon="android" format="APK" requirement="Requires Android 6.0+"/><DownloadCard platform="Windows" icon="desktop_windows" format=".EXE" requirement="Requires Windows 10/11"/><DownloadCard platform="Linux" icon="terminal" format="AppImage / .DEB" requirement="Ubuntu, Debian, Fedora, Arch"/><DownloadCard platform="macOS" icon="laptop_mac" format=".DMG" requirement="macOS 11.0+ (Universal)"/></div><p className="demo-caption centered">Demo download buttons. Official release links will be added when available.</p></section><section className="container leaderboard"><div><span className="eyebrow">A COMMUNITY IN SYNC</span><h2>Every listen tells a story.</h2><p>Community leaderboard preview · illustrative data</p></div><div className="leaderboard-stats">{[['59:13','Total listening time'],['21','Unique songs'],['265h','Top listener'],['#4','Your rank']].map(([n,t])=><div key={t}><strong>{n}</strong><span>{t}</span></div>)}</div></section><section id="help" className="section container"><Reveal className="help-box"><div className="help-icon"><Icon name="support_agent"/></div><div><h2>Need Help?</h2><p>Submit a request or report an issue directly to the development team on GitHub.</p></div><RequestHelpButton /></Reveal></section></main><Footer/><div className="toast-region" role="status" aria-live="polite" aria-atomic="true">{toast&&<div className="toast"><Icon name="info"/><span>{toast.message}</span>{toast.actionLabel && toast.onAction ? <button onClick={() => { toast.onAction?.(); setToast(null); }}>{toast.actionLabel}</button> : null}<button aria-label="Dismiss notification" onClick={()=>setToast(null)}><Icon name="close"/></button></div>}</div></ToastContext.Provider></MotionConfig>;
}
