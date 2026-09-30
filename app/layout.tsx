import type { Metadata } from 'next';
import './globals.css';
import {PwaRegister} from '@/components/pwa-register';
export const metadata: Metadata = { title: {default:'Danny | Salón de Belleza',template:'%s | Salón de Belleza Danny'},description:'Un espacio para expresar tu estilo. Uñas, keratina, peinados, cejas y pestañas en Salón de Belleza Danny.',icons:{icon:'/favicon.svg'},manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'Salón Danny'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}<PwaRegister/></body></html>}
