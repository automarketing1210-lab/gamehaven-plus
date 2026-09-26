CREATE TABLE `portal_ad_banners` (
	`slot` varchar(20) NOT NULL,
	`imageUrl` text NOT NULL,
	`targetUrl` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portal_ad_banners_slot` PRIMARY KEY(`slot`)
);
