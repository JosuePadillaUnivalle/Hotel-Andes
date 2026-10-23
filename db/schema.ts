import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(), code: text("code").notNull().unique(),
  owner: text("owner").notNull(), idempotencyKey: text("idempotency_key").notNull(),
  unitId: text("unit_id").notNull(), roomType: text("room_type").notNull(),
  checkIn: text("check_in").notNull(), checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull(), guestName: text("guest_name").notNull(),
  email: text("email").notNull(), nightlyRate: integer("nightly_rate").notNull(),
  total: integer("total").notNull(),
  status: text("status", { enum: ["confirmed", "cancelled"] }).notNull().default("confirmed"),
  createdAt: text("created_at").notNull(),
}, (t) => [
  uniqueIndex("reservations_owner_request").on(t.owner, t.idempotencyKey),
  index("reservations_availability").on(t.unitId, t.status, t.checkIn, t.checkOut),
  index("reservations_owner").on(t.owner),
]);
