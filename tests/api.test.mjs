import assert from "node:assert/strict";
import { ROOMS, todayISO, addDays } from "../lib/rooms.ts";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname)) throw new Error("Estas pruebas solo se ejecutan contra una base local.");
const cookie = "andes_guest=" + crypto.randomUUID();
const otherCookie = "andes_guest=" + crypto.randomUUID();
const checkIn = addDays(todayISO(), 200);
const checkOut = addDays(checkIn, 3);
const payload = { checkIn, checkOut, guests: 4, guestName: "Prueba de Calidad", email: "prueba@example.test", roomType: "familiar", idempotencyKey: crypto.randomUUID(), total: 1, nightlyRate: 1 };
const created = [];
async function request(path, method = "GET", data, who = cookie, origin = base) {
  const r = await fetch(base + path, { method, headers: { cookie: who, origin, "Content-Type": "application/json" }, body: data === undefined ? undefined : JSON.stringify(data) });
  const raw = await r.text();
  let parsed;
  try { parsed = JSON.parse(raw); } catch { parsed = { error: raw }; }
  return { status: r.status, data: parsed };
}
async function reserve(data, who = cookie) {
  const result = await request("/api/reservations", "POST", data, who);
  if (result.status === 201) created.push({ id: result.data.reservation.id, who });
  return result;
}
try {
  assert.equal((await request("/api/reservations", "POST", null)).status, 400);
  assert.equal((await request("/api/reservations", "POST", { ...payload, checkOut: checkIn })).status, 400);
  assert.equal((await request("/api/reservations", "POST", { ...payload, email: "incorrecto" })).status, 400);
  assert.equal((await request("/api/reservations", "POST", { ...payload, roomType: "andina" })).status, 400);
  assert.equal((await request("/api/reservations", "POST", payload, cookie, "https://unrelated.invalid")).status, 403);
  console.log("PASS: validación de fechas, correo, capacidad y origen");
  const first = await reserve(payload);
  assert.equal(first.status, 201, JSON.stringify(first.data));
  const firstId = first.data.reservation.id;
  assert.equal(first.data.reservation.total, ROOMS[2].rate * 3);
  assert.equal(first.data.reservation.nightlyRate, ROOMS[2].rate);
  const duplicate = await request("/api/reservations", "POST", payload);
  assert.equal(duplicate.status, 200); assert.equal(duplicate.data.reservation.id, first.data.reservation.id);
  console.log("PASS: creación, precio calculado en servidor e idempotencia");
  const sameDates = await reserve({ ...payload, idempotencyKey: crypto.randomUUID() });
  assert.equal(sameDates.status, 409);
  assert.equal(sameDates.data.code, "ROOM_RESERVED");
  const overlaps = await reserve({ ...payload, checkIn: addDays(checkIn, 1), checkOut: addDays(checkOut, 1), idempotencyKey: crypto.randomUUID() }, otherCookie);
  assert.equal(overlaps.status, 409, "También se rechaza el cruce parcial de otro visitante");
  const otherRoom = await reserve({ ...payload, roomType: "andina", guests: 2, idempotencyKey: crypto.randomUUID() }, otherCookie);
  assert.equal(otherRoom.status, 201, "Otra habitación sigue disponible en las mismas fechas");
  const parallel = await Promise.all(Array.from({ length: 12 }, (_, i) => reserve({
    ...payload, checkIn: addDays(checkOut, 7), checkOut: addDays(checkOut, 9), idempotencyKey: crypto.randomUUID(),
  }, i % 2 === 0 ? cookie : otherCookie)));
  assert.equal(parallel.filter(r => r.status === 201).length, 1, "Solo una solicitud puede tomar la habitación");
  assert.equal(parallel.filter(r => r.status === 409).length, 11);
  const availability = await request(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=4`);
  assert.equal(availability.data.rooms[0].available, 0);
  console.log("PASS: 12 solicitudes concurrentes respetan la capacidad sin sobreventa");
  const own = await request("/api/reservations"); assert(own.data.reservations.some(r => r.id === firstId));
  const another = await request("/api/reservations", "GET", undefined, otherCookie); assert(!another.data.reservations.some(r => r.id === firstId));
  assert.equal((await request(`/api/reservations/${firstId}`, "PATCH", undefined, otherCookie)).status, 404);
  console.log("PASS: aislamiento de reservas entre visitantes");
  const adjacent = await reserve({ ...payload, checkIn: checkOut, checkOut: addDays(checkOut, 1), idempotencyKey: crypto.randomUUID() });
  assert.equal(adjacent.status, 201);
  console.log("PASS: salida y llegada contiguas no se superponen");
  assert.equal((await request(`/api/reservations/${firstId}`, "PATCH")).status, 200);
  const released = await request(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=4`);
  assert.equal(released.data.rooms[0].available, 1);
  const rebooked = await reserve({ ...payload, idempotencyKey: crypto.randomUUID() }, otherCookie);
  assert.equal(rebooked.status, 201);
  console.log("PASS: cancelar libera la habitación y permite volver a reservar");
} finally {
  for (const { id, who } of created) await request(`/api/reservations/${id}`, "PATCH", undefined, who);
}
