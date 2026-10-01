'use client';
import {useState} from 'react';
import {Check,Share2} from 'lucide-react';
export function ShareSalon(){
 const [copied,setCopied]=useState(false);
 async function share(){
  const data={title:'Salón de Belleza Danny',text:'Tu esencia, tu estilo, tu brillo. Conoce nuestros servicios y agenda tu cita.',url:window.location.origin};
  if(navigator.share){try{await navigator.share(data);return}catch(error){if(error instanceof DOMException&&error.name==='AbortError')return}}
  try{await navigator.clipboard.writeText(data.url);setCopied(true);window.setTimeout(()=>setCopied(false),2200)}catch{window.prompt('Copia el enlace del salón:',data.url)}
 }
 return <button className="share-site text-link" onClick={share}>{copied?<Check size={16}/>:<Share2 size={16}/>}<span>{copied?'Enlace copiado':'Compartir salón'}</span></button>
}
