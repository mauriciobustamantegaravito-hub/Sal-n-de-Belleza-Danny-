'use client';
import {useEffect,useState} from 'react';
import {Check,ChevronDown,Download,Share} from 'lucide-react';

type InstallChoice='accepted'|'dismissed';
interface InstallPromptEvent extends Event {
 prompt:()=>Promise<void>;
 userChoice:Promise<{outcome:InstallChoice;platform:string}>;
}
const DISMISSED_KEY='danny-install-prompt-dismissed-until-v2';
const SEVEN_DAYS=7*24*60*60*1000;

export function InstallPrompt(){
 const [installEvent,setInstallEvent]=useState<InstallPromptEvent|null>(null);
 const [visible,setVisible]=useState(false);
 const [ios,setIos]=useState(false);
 const [instructions,setInstructions]=useState(false);

 useEffect(()=>{
  const standalone=matchMedia('(display-mode: standalone)').matches||('standalone' in navigator&&Boolean((navigator as Navigator&{standalone?:boolean}).standalone));
  const mobile=matchMedia('(max-width: 768px)').matches||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isiOS=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(standalone||!mobile||location.pathname==='/panel')return;
  const dismissed=Number(localStorage.getItem(DISMISSED_KEY)||0);
  if(dismissed>Date.now())return;
  setIos(isiOS);
  const timer=setTimeout(()=>setVisible(true),5000);
  const onBeforeInstall=(event:Event)=>{event.preventDefault();setInstallEvent(event as InstallPromptEvent)};
  const onInstalled=()=>{setVisible(false);setInstallEvent(null)};
  window.addEventListener('beforeinstallprompt',onBeforeInstall);
  window.addEventListener('appinstalled',onInstalled);
  return()=>{clearTimeout(timer);window.removeEventListener('beforeinstallprompt',onBeforeInstall);window.removeEventListener('appinstalled',onInstalled)};
 },[]);

 function dismiss(){localStorage.setItem(DISMISSED_KEY,String(Date.now()+SEVEN_DAYS));setVisible(false)}
 async function install(){
  if(!installEvent)return;
  await installEvent.prompt();
  const choice=await installEvent.userChoice;
  setInstallEvent(null);
  if(choice.outcome==='accepted')setVisible(false);
  else dismiss();
 }

 if(!visible)return null;
 return <aside className="install-prompt" aria-label="Instala la aplicación Salón Danny">
  <button className="install-close" onClick={dismiss} aria-label="Cerrar aviso">×</button>
  <span className="install-mark"><Download size={19}/></span>
  <div className="install-copy"><strong>Instala la app de Danny</strong><p>Ten el salón a mano y agenda más fácil desde tu celular.</p>
   {installEvent?<button className="install-action" onClick={install}>Instalar app <Download size={15}/></button>:
   <button className="install-action" onClick={()=>setInstructions(!instructions)} aria-expanded={instructions}>{instructions?'Cerrar instrucciones':'Cómo instalar'} <ChevronDown size={15}/></button>}
   {instructions&&(ios?<ol className="install-steps"><li><Share size={14}/> Toca <b>Compartir</b> en Safari.</li><li><Check size={14}/> Elige <b>Añadir a pantalla de inicio</b>.</li></ol>:<ol className="install-steps"><li>Abre el menú <b>⋮</b> del navegador.</li><li>Elige <b>Instalar aplicación</b> o <b>Añadir a pantalla de inicio</b>.</li></ol>)}
  </div>
 </aside>
}
