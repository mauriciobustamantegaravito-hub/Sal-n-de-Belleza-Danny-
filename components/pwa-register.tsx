'use client';
import {useEffect} from 'react';
import {InstallPrompt} from './install-prompt';
import {PwaLaunchIntro} from './pwa-launch-intro';
export function PwaRegister(){useEffect(()=>{if('serviceWorker' in navigator)void navigator.serviceWorker.register('/sw.js').catch(()=>{})},[]);return <><InstallPrompt/><PwaLaunchIntro/></>}
