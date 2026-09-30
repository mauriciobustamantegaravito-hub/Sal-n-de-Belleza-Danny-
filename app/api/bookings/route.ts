import {NextResponse} from 'next/server';
const configured=()=>process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export async function GET(request:Request){
 const date=new URL(request.url).searchParams.get('date');
 if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({error:'Fecha inválida.'},{status:400});
 if(!configured()) return NextResponse.json({booked:[],demo:true});
 const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_booked_slots`,{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,Authorization:`Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, 'content-type':'application/json'},body:JSON.stringify({p_date:date}),cache:'no-store'});
 if(!response.ok)return NextResponse.json({error:'No pudimos consultar los horarios.'},{status:502});
 const rows=await response.json() as {slot_time:string}[];
 return NextResponse.json({booked:rows.map(r=>r.slot_time)});
}
export async function POST(request:Request){
 let body:{service?:string;date?:string;time?:string;name?:string;phone?:string};
 try{body=await request.json()}catch{return NextResponse.json({error:'Solicitud inválida.'},{status:400})}
 const {service,date,time,name,phone}=body;
 if(!service||!date||!time||!name||!phone||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:00$/.test(time))return NextResponse.json({error:'Completa todos los datos de la cita.'},{status:400});
 if(!configured())return NextResponse.json({ok:true,demo:true});
 const startsAt=`${date}T${time}:00-05:00`;
 const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/create_public_booking`,{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,Authorization:`Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,'content-type':'application/json'},body:JSON.stringify({p_name:name.trim(),p_phone:phone.trim(),p_service_slug:service,p_starts_at:startsAt}),cache:'no-store'});
 if(!response.ok){const error=await response.json().catch(()=>null) as {message?:string}|null;return NextResponse.json({error:error?.message||'No pudimos guardar la cita. Prueba otro horario.'},{status:409})}
 return NextResponse.json({ok:true});
}
