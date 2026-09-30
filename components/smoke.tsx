'use client';
import {useEffect,useRef} from 'react';
/* Low-resolution, domain-warped noise: a Canvas fallback that does not require WebGL. */
export function Smoke({paused}:{paused:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
 const c=ref.current;if(!c)return;const ctx=c.getContext('2d',{alpha:false});if(!ctx)return;
 const size=128,noise=new Float32Array(size*size);let seed=3127;for(let i=0;i<noise.length;i++){seed=(seed*16807)%2147483647;noise[i]=seed/2147483647}
 function n(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y);let fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const a=noise[((iy&127)*128)+(ix&127)],b=noise[((iy&127)*128)+((ix+1)&127)],d=noise[(((iy+1)&127)*128)+(ix&127)],e=noise[(((iy+1)&127)*128)+((ix+1)&127)];return (a+(b-a)*fx)*(1-fy)+(d+(e-d)*fx)*fy}
 function fbm(x:number,y:number){return n(x,y)*.55+n(x*2.03+13,y*2.03)*.28+n(x*4.07,y*4.07+7)*.17}
 let frame=0,last=0,t=18;function resize(){c!.width=innerWidth<700?160:240;c!.height=Math.round(c!.width*innerHeight/innerWidth)}resize();
 function paint(now:number){if(now-last>65||paused){if(!document.hidden){if(!paused)t+=Math.min((now-last)/1000,.09);const w=c!.width,h=c!.height,img=ctx!.createImageData(w,h),aspect=w/h;for(let y=0;y<h;y++){for(let x=0;x<w;x++){const u=x/w,v=y/h;const px=u*aspect*3.8,py=v*3.8-t*.19;const q=fbm(px+t*.10,py),r=fbm(px+8-q,py+q*2);const density=fbm(px+q*3.7,py+r*3.4);const curl=Math.pow(Math.max(0,(density-.28)*1.8),1.65);const veil=.45+.55*Math.abs(u-.45);const a=Math.min(1,curl*veil*1.6);const i=(y*w+x)*4;img.data[i]=8+a*240;img.data[i+1]=5+a*a*85;img.data[i+2]=10+a*157;img.data[i+3]=255} }ctx!.putImageData(img,0,0)}last=now}if(!paused)frame=requestAnimationFrame(paint)}paint(100);window.addEventListener('resize',resize);return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize)};
 },[paused]);return <canvas ref={ref} className="smoke-canvas" aria-hidden="true"/>;
}
