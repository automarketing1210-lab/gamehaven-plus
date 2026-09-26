CREATE TABLE `portal_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(32) NOT NULL,
	`gameSlug` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portal_favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `portal_favorite_user_game_uq` UNIQUE(`username`,`gameSlug`)
);
--> statement-breakpoint
CREATE TABLE `portal_games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`titles` json NOT NULL,
	`category` varchar(32) NOT NULL,
	`tags` json NOT NULL,
	`descriptions` json NOT NULL,
	`controls` json NOT NULL,
	`imageUrl` text NOT NULL,
	`gameUrl` text,
	`rating` double NOT NULL,
	`plays` int NOT NULL,
	`year` int NOT NULL,
	`badge` varchar(16),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portal_games_id` PRIMARY KEY(`id`),
	CONSTRAINT `portal_games_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `portal_favorite_user_idx` ON `portal_favorites` (`username`);