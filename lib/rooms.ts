export const ROOMS = [
  { id: "andina", name: "Habitación Andina", category: "ESENCIAL Y ACOGEDORA", description: "Madera cálida, tejidos locales y todo lo que necesitas para desconectar.", image: "/images/room.webp", capacity: 2, size: 28, rate: 520, bed: "1 cama queen", units: ["A101", "A102", "A103"], amenities: ["Desayuno incluido", "Baño privado", "Wi-Fi", "Calefacción", "Vista al jardín"], featured: false },
  { id: "panoramica", name: "Suite Panorámica", category: "UNA VISTA PARA QUEDARSE", description: "Despierta frente a las montañas y disfruta tu propio rincón de tranquilidad.", image: "/images/suite.webp", capacity: 2, size: 42, rate: 680, bed: "1 cama king", units: ["P201", "P202"], amenities: ["Desayuno incluido", "Ventanal panorámico", "Sala de estar", "Wi-Fi", "Calefacción"], featured: true },
  { id: "familiar", name: "Refugio Familiar", category: "MEJOR CUANDO SE COMPARTE", description: "Más espacio para compartir el viaje, con la comodidad de sentirse en casa.", image: "/images/family.webp", capacity: 4, size: 48, rate: 840, bed: "1 cama queen + 2 individuales", units: ["F301", "F302"], amenities: ["Desayuno incluido", "Baño privado", "Wi-Fi", "Calefacción", "Espacio familiar"], featured: false },
] as const;
export type Room = (typeof ROOMS)[number];
export type Search = { checkIn: string; checkOut: string; guests: number };
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
export function addDays(day: string, count: number) {
  const d = new Date(day + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + count);
  return d.toISOString().slice(0, 10);
}
function validDate(v: unknown): v is string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T12:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}
export function nights(a: string, b: string) {
  return Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 86400000);
}
export function validateSearch(s: Partial<Search>, now = todayISO()): string | null {
  if (!validDate(s.checkIn) || !validDate(s.checkOut)) return "Elige una fecha de llegada y una de salida válidas.";
  if (s.checkIn < now) return "La llegada no puede ser anterior a hoy.";
  if (s.checkOut <= s.checkIn) return "La salida debe ser posterior a la llegada.";
  if (nights(s.checkIn, s.checkOut) > 30) return "Puedes reservar hasta 30 noches por estancia.";
  if (s.checkIn > addDays(now, 365)) return "Puedes reservar con hasta un año de anticipación.";
  if (!Number.isInteger(s.guests) || (s.guests ?? 0) < 1 || (s.guests ?? 0) > 4) return "Selecciona entre 1 y 4 huéspedes.";
  return null;
}
export const money = (value: number) => new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB", maximumFractionDigits: 0 }).format(value);
export const dateLabel = (day: string) => new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(day + "T12:00:00Z"));
