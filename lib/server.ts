import { env } from "cloudflare:workers";
export function db() {
  if (!env.DB) throw new Error("Database binding unavailable");
  return env.DB;
}
export function identity(request: Request) {
  const user = request.headers.get("oai-authenticated-user-id");
  if (user) return { owner: "user:" + user, cookie: null };
  const match = /(?:^|;\s*)andes_guest=([a-f0-9-]{36})(?:;|$)/.exec(request.headers.get("cookie") ?? "");
  const id = match?.[1] ?? crypto.randomUUID();
  return { owner: "guest:" + id, cookie: match ? null : `andes_guest=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}` };
}
export function json(data: unknown, status = 200, cookie: string | null = null) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...(cookie ? { "Set-Cookie": cookie } : {}) } });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
export function publicReservation(row: Record<string, unknown>) {
  return { id: row.id, code: row.code, roomType: row.room_type, checkIn: row.check_in, checkOut: row.check_out, guests: row.guests, guestName: row.guest_name, email: row.email, nightlyRate: row.nightly_rate, total: row.total, status: row.status, createdAt: row.created_at };
}
