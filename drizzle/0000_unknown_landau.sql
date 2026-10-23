CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`owner` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`unit_id` text NOT NULL,
	`room_type` text NOT NULL,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`guests` integer NOT NULL,
	`guest_name` text NOT NULL,
	`email` text NOT NULL,
	`nightly_rate` integer NOT NULL,
	`total` integer NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_code_unique` ON `reservations` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_owner_request` ON `reservations` (`owner`,`idempotency_key`);--> statement-breakpoint
CREATE INDEX `reservations_availability` ON `reservations` (`unit_id`,`status`,`check_in`,`check_out`);--> statement-breakpoint
CREATE INDEX `reservations_owner` ON `reservations` (`owner`);