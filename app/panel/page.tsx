import Link from 'next/link';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {AdminLogin,AdminDashboard} from '@/components/admin-panel';
export const metadata={title:'Panel de citas'};
export const dynamic='force-dynamic';
export default async function PanelPage(){
 const supabase=await createSupabaseServerClient();
 if(!supabase)return <main className="admin-page"><section className="admin-card"><Link className="brand" href="/">Danny<span>SALÓN DE BELLEZA</span></Link><p className="eyebrow rose">PANEL PRIVADO</p><h1>Agenda de citas</h1><p className="admin-intro">Para activar el panel, configura Supabase siguiendo los pasos de <code>README.md</code> y aplica la migración de base de datos.</p><Link className="button outline" href="/">Volver al sitio</Link></section></main>;
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return <AdminLogin/>;
 const {data:admin}=await supabase.from('salon_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(!admin)return <main className="admin-page"><section className="admin-card"><p className="eyebrow rose">ACCESO RESTRINGIDO</p><h1>Este usuario no tiene acceso al panel.</h1><p className="admin-intro">Añade el ID de esta cuenta a <code>salon_admins</code> en Supabase.</p><AdminLogin signOut/></section></main>;
 const {data:appointments,error}=await supabase.from('salon_appointments').select('id,customer_name,customer_phone,starts_at,ends_at,status,salon_services(name)').order('starts_at',{ascending:true});
 return <AdminDashboard email={user.email||'Cuenta de Dani'} initialRows={error?[]:(appointments||[]) as never[]}/>;
}
