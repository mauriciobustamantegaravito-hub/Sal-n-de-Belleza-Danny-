import {services} from '@/lib/salon';
import {Salon} from '@/components/salon';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return services.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=services.find(s=>s.slug===slug);return {title:s?.name||'Servicio',description:s?.intro}}
export default async function Service({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=services.find(s=>s.slug===slug);if(!s)notFound();return <Salon service={s}/>}
