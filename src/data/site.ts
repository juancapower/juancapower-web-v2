export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const path = (route = '') => `${base}/${route.replace(/^\/|\/$/g, '')}${route ? '/' : ''}`;
export const booking = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Cfa-gmREBDeKuFMB1kPZ1APs09ssHUnVAYXU1hEqtj62KyE6vQZtEok2A7YgWbNdkMDbb1suK';
export const speakerContact = 'https://wa.me/51963335717?text=' + encodeURIComponent('Hola JuanCa, quiero organizar una conferencia o taller. Evento y organización: __. Fecha: __. Lugar y modalidad: __. Audiencia: __. Tema y objetivo: __.');

export const communityContact = 'https://wa.me/51963335717?text=' + encodeURIComponent('Hola JuanCa, quiero información para participar en la Comunidad JuanCa Power.');
export const conversationsContact = 'https://wa.me/51963335717?text=' + encodeURIComponent('Hola JuanCa, quiero información para participar en Conversaciones que Despiertan y conocer sus próximos encuentros.');
