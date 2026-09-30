const nailDetails = [
 ['Diseño y técnica', 'Cuéntale a Danny qué estilo te gustaría y qué técnica tienes en mente: manicure, uñas semipermanentes, acrílico, poligel, press-on o dipping.'],
 ['Tarifas de uñas', 'Los servicios de uñas tienen precios fijos. Consulta la tarifa del diseño que elegiste al reservar.'],
 ['Tu cita', 'Puedes traer una foto de referencia para conversar sobre tu diseño.'],
] as const;
const hairDetails = [
 ['Cuéntale sobre tu cabello', 'Para cotizar, comparte el largo y la cantidad de cabello, además del resultado que buscas.'],
 ['Tu estilo', 'Puedes enviar una referencia del acabado que tienes en mente.'],
 ['Tu cita', 'El valor de keratinas y peinados depende del largo y la cantidad de cabello.'],
] as const;
const standardDetails = [
 ['Tu idea', 'Cuéntale a Danny qué resultado buscas. Puedes enviar una foto de referencia.'],
 ['Consulta', 'Pregunta por las opciones disponibles y cualquier detalle que quieras tener en cuenta.'],
 ['Tu cita', 'Elige una fecha y hora disponibles para enviar tu solicitud.'],
] as const;
export const services = [
 {slug:'manicure',name:'Manicure',category:'UÑAS',line:'Arte en cada detalle.',intro:'Manos cuidadas, color y diseños con personalidad. Encuentra tu estilo entre acabados clásicos y técnicas de nail art.',image:'nails',duration:60,details:nailDetails},
 {slug:'pedicure',name:'Pedicure',category:'UÑAS',line:'Un momento para ti.',intro:'Cuidado y color para completar tu estilo. Consulta las opciones de pedicure disponibles con Danny.',image:'nails',duration:60,details:standardDetails},
 {slug:'unas-acrilicas-poligel',name:'Acrílico, poligel y más',category:'UÑAS',line:'Tu diseño, a tu manera.',intro:'Acrílico, poligel, press-on, dipping y uñas semipermanentes. Cuéntale a Danny cuál técnica o diseño quieres explorar.',image:'nails',duration:60,details:nailDetails},
 {slug:'cejas-pestanas',name:'Cejas y pestañas',category:'MIRADA',line:'Detalles que expresan.',intro:'Diseño y depilación de cejas, cejas perfectas y pestañas punto a punto para realzar tu mirada.',image:'beauty',duration:60,details:standardDetails},
 {slug:'keratina',name:'Keratina',category:'CABELLO',line:'Suavidad y movimiento.',intro:'Consulta por keratina para tu cabello. El valor se cotiza de acuerdo con la cantidad y el largo del cabello.',image:'beauty',duration:60,details:hairDetails},
 {slug:'alisados',name:'Alisados',category:'CABELLO',line:'Un acabado a tu estilo.',intro:'Pregunta por las opciones de alisado disponibles y conversa con Danny sobre el resultado que buscas.',image:'beauty',duration:60,details:hairDetails},
 {slug:'peinados-trenzas',name:'Peinados y trenzas',category:'PEINADOS',line:'Listas para tu ocasión.',intro:'Peinados y trenzas para distintas ocasiones, también para niñas. El valor se confirma según el largo, la cantidad de cabello y el estilo.',image:'beauty',duration:60,details:hairDetails},
 {slug:'corte-dama',name:'Corte dama',category:'CABELLO',line:'Un cambio muy tuyo.',intro:'Renueva la forma y el movimiento de tu cabello. Cuéntale a Danny qué corte estás imaginando.',image:'beauty',duration:60,details:standardDetails},
 {slug:'cuidado-capilar',name:'Cuidado capilar',category:'CABELLO',line:'Dale cuidado a tu cabello.',intro:'Consulta por repolarización y los productos de cuidado capilar disponibles en el salón.',image:'beauty',duration:60,details:standardDetails},
 {slug:'limpieza-facial',name:'Limpieza facial',category:'CUIDADO FACIAL',line:'Un espacio para cuidarte.',intro:'Pregunta por la limpieza facial y los detalles del servicio directamente con Danny.',image:'beauty',duration:60,details:standardDetails},
 {slug:'depilacion',name:'Depilación',category:'CUIDADO PERSONAL',line:'Atención en los detalles.',intro:'Diseño y depilación de cejas, además de depilación con cera. Consulta las opciones disponibles.',image:'beauty',duration:60,details:standardDetails},
] as const;
export const contact = { phoneDisplay:'350 530 9936', whatsapp:'573505309936', address:'Calle 76 Sur n.º 16P-43', city:'Bogotá, Colombia', mapsQuery:'Calle 76 Sur 16P-43, Bogotá, Colombia' };
