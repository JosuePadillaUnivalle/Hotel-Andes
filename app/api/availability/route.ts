import { ROOMS, validateSearch } from "../../../lib/rooms";
import { db, json } from "../../../lib/server";
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const s = { checkIn: q.get("checkIn") ?? "", checkOut: q.get("checkOut") ?? "", guests: Number(q.get("guests")) };
  const error = validateSearch(s);
  if (error) return json({ error }, 400);
  try {
    const result = await db().prepare("SELECT unit_id FROM reservations WHERE status = 'confirmed' AND check_in < ? AND check_out > ?").bind(s.checkOut, s.checkIn).all<{ unit_id: string }>();
    const occupied = new Set(result.results.map(r => r.unit_id));
    return json({ rooms: ROOMS.filter(r => r.capacity >= s.guests).map(r => ({ id: r.id, available: r.units.filter(u => !occupied.has(u)).length })), search: s });
  } catch (err) {
    console.error("Availability failed", err);
    return json({ error: "No pudimos consultar la disponibilidad. Intenta de nuevo en un momento." }, 503);
  }
}
