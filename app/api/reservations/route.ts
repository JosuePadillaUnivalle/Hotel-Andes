import { ROOMS, nights, validateSearch } from "../../../lib/rooms";
import { db, identity, json, publicReservation, sameOrigin } from "../../../lib/server";
export async function GET(request: Request) {
  const { owner, cookie } = identity(request);
  try {
    const rows = await db().prepare("SELECT * FROM reservations WHERE owner = ? ORDER BY created_at DESC LIMIT 100").bind(owner).all();
    return json({ reservations: rows.results.map(publicReservation) }, 200, cookie);
  } catch (err) {
    console.error("Reservations failed", err);
    return json({ error: "No pudimos cargar tus reservas. Intenta de nuevo." }, 503, cookie);
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Solicitud no permitida." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Formato de solicitud inválido." }, 415);
  const { owner, cookie } = identity(request);
  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return json({ error: "No pudimos leer la solicitud." }, 400, cookie); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "Formato de solicitud inválido." }, 400, cookie);
  const s = { checkIn: input.checkIn as string, checkOut: input.checkOut as string, guests: input.guests as number };
  const error = validateSearch(s);
  if (error) return json({ error }, 400, cookie);
  const room = ROOMS.find(r => r.id === input.roomType);
  if (!room || s.guests > room.capacity) return json({ error: "La habitación no tiene capacidad para estos huéspedes." }, 400, cookie);
  const guestName = typeof input.guestName === "string" ? input.guestName.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const key = input.idempotencyKey;
  if (guestName.length < 3 || guestName.length > 80) return json({ error: "Escribe tu nombre completo, entre 3 y 80 caracteres." }, 400, cookie);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Escribe un correo electrónico válido." }, 400, cookie);
  if (typeof key !== "string" || !/^[a-f0-9-]{36}$/i.test(key)) return json({ error: "Solicitud inválida. Vuelve a abrir la reserva." }, 400, cookie);
  const database = db();
  const previous = () => database.prepare("SELECT * FROM reservations WHERE owner = ? AND idempotency_key = ?").bind(owner, key).first<Record<string, unknown>>();
  const respondPrevious = (r: Record<string, unknown>) => {
    if (r.room_type !== room.id || r.check_in !== s.checkIn || r.check_out !== s.checkOut || r.guests !== s.guests || r.email !== email || r.guest_name !== guestName) return json({ error: "Esta solicitud ya corresponde a otra reserva. Abre una nueva." }, 409, cookie);
    return json({ reservation: publicReservation(r) }, 200, cookie);
  };
  try {
    const existing = await previous();
    if (existing) return respondPrevious(existing);
    const id = crypto.randomUUID();
    const code = "AND-" + id.slice(0, 8).toUpperCase();
    const total = room.rate * nights(s.checkIn, s.checkOut);
    const candidates = room.units.map((_, i) => i === 0 ? "SELECT ? AS unit_id" : "SELECT ?").join(" UNION ALL ");
    // Atomic D1 statement prevents concurrent overlapping claims of one unit.
    const row = await database.prepare(`INSERT INTO reservations (id,code,owner,idempotency_key,unit_id,room_type,check_in,check_out,guests,guest_name,email,nightly_rate,total,status,created_at)
      SELECT ?,?,?,?,c.unit_id,?,?,?,?,?,?,?,?, 'confirmed',? FROM (${candidates}) c
      WHERE NOT EXISTS (SELECT 1 FROM reservations r WHERE r.unit_id=c.unit_id AND r.status='confirmed' AND r.check_in < ? AND r.check_out > ?)
      LIMIT 1 RETURNING *`).bind(id, code, owner, key, room.id, s.checkIn, s.checkOut, s.guests, guestName, email, room.rate, total, new Date().toISOString(), ...room.units, s.checkOut, s.checkIn).first<Record<string, unknown>>();
    if (!row) return json({ error: "La última habitación acaba de reservarse. Busca otras fechas o elige otra habitación." }, 409, cookie);
    return json({ reservation: publicReservation(row) }, 201, cookie);
  } catch (err) {
    try { const existing = await previous(); if (existing) return respondPrevious(existing); } catch { /* Preserve original failure. */ }
    console.error("Create reservation failed", err);
    return json({ error: "No pudimos confirmar la reserva. Puedes reintentar sin crear una reserva duplicada." }, 503, cookie);
  }
}
