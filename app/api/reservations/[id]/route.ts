import { db, identity, json, publicReservation, sameOrigin } from "../../../../lib/server";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return json({ error: "Solicitud no permitida." }, 403);
  const { owner, cookie } = identity(request);
  const { id } = await params;
  try {
    const row = await db().prepare("UPDATE reservations SET status = 'cancelled' WHERE id = ? AND owner = ? RETURNING *").bind(id, owner).first<Record<string, unknown>>();
    if (!row) return json({ error: "No encontramos esa reserva en tu cuenta." }, 404, cookie);
    return json({ reservation: publicReservation(row) }, 200, cookie);
  } catch (err) {
    console.error("Cancel reservation failed", err);
    return json({ error: "No pudimos cancelar la reserva. Intenta de nuevo." }, 503, cookie);
  }
}
