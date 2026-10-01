'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,Sparkles} from 'lucide-react';

export function PwaLaunchIntro(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  const standalone=matchMedia('(display-mode: standalone)').matches||('standalone' in navigator&&Boolean((navigator as Navigator&{standalone?:boolean}).standalone));
  if(!standalone)return;
  const close=()=>{setVisible(false);document.documentElement.classList.remove('pwa-intro-active')};
  setVisible(true);
  document.documentElement.classList.add('pwa-intro-active');
  const timer=window.setTimeout(close,3400);
  return()=>{window.clearTimeout(timer);document.documentElement.classList.remove('pwa-intro-active')};
 },[]);
 if(!visible)return null;
 return <div className="pwa-intro" role="status" aria-live="polite">
  <div className="intro-glow intro-glow-one"/><div className="intro-glow intro-glow-two"/>
  <div className="intro-spark-field" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
  <div className="intro-content">
   <div className="intro-jewel" aria-hidden="true">
    <span className="jewel-orbit jewel-orbit-one"/><span className="jewel-orbit jewel-orbit-two"/>
    <span className="jewel-shine shine-a">✦</span><span className="jewel-shine shine-b">✧</span>
    <svg viewBox="0 0 220 220" className="intro-gem">
     <defs><linearGradient id="gem-face" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff5fd"/><stop offset=".3" stopColor="#ff8fc9"/><stop offset=".62" stopColor="#bd4cff"/><stop offset="1" stopColor="#fff"/></linearGradient><linearGradient id="gem-side" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ec9bff"/><stop offset="1" stopColor="#ff4eaa"/></linearGradient><filter id="gem-glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
     <path d="M34 75 70 34h80l36 41-76 111z" fill="url(#gem-face)" stroke="#fff3ff" strokeWidth="3" filter="url(#gem-glow)"/>
     <path d="m34 75 48 5 28 106zM70 34l12 46 28-46zm80 0-40 46 40-5zm36 41-48 5-28 106z" fill="#fff" fillOpacity=".3" stroke="#fff5ff" strokeOpacity=".75" strokeWidth="2"/>
     <path d="m82 80 28-46 28 46-28 106z" fill="url(#gem-side)" fillOpacity=".56" stroke="#ffe5ff" strokeWidth="2"/>
    </svg>
    <span className="jewel-flare"/>
   </div>
   <span className="intro-kicker"><Sparkles size={13}/> TU MOMENTO DE BRILLAR <Sparkles size={13}/></span>
   <div className="intro-brand">DANNY</div>
   <div className="intro-subtitle">SALÓN DE BELLEZA</div>
   <p className="intro-tagline">Tu esencia. <em>Tu estilo.</em> Tu brillo.</p>
  </div>
  <div className="intro-bottom"><span className="intro-progress"><i/></span><button onClick={()=>{setVisible(false);document.documentElement.classList.remove('pwa-intro-active')}}>Entrar al salón <ArrowRight size={15}/></button></div>
 </div>
}
