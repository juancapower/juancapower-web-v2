export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const path = (route = '') => `${base}/${route.replace(/^\/|\/$/g, '')}${route ? '/' : ''}`;
export const booking = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Cfa-gmREBDeKuFMB1kPZ1APs09ssHUnVAYXU1hEqtj62KyE6vQZtEok2A7YgWbNdkMDbb1suK';
export const speakerContact = 'https://wa.me/51963335717?text=Hola%20JuanCa%2C%20quiero%20coordinar%20una%20conferencia%20o%20taller.';
