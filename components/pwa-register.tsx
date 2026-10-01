'use client';
import {useEffect} from 'react';
import {InstallPrompt} from './install-prompt';
export function PwaRegister(){useEffect(()=>{if('serviceWorker' in navigator)void navigator.serviceWorker.register('/sw.js').catch(()=>{})},[]);return <InstallPrompt/>}
