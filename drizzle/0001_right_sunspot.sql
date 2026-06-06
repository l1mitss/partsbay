CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listingId` int NOT NULL,
	`quantity` int DEFAULT 1,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`iconUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `listingPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`photoUrl` varchar(512) NOT NULL,
	`photoKey` varchar(512) NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `listingPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`categoryId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`price` decimal(10,2) NOT NULL,
	`condition` enum('new','used','refurbished') NOT NULL,
	`carMake` varchar(100),
	`carModel` varchar(100),
	`carYear` int,
	`stock` int DEFAULT 0,
	`averageRating` decimal(3,2) DEFAULT '0',
	`totalReviews` int DEFAULT 0,
	`status` enum('active','inactive','sold') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('order_placed','order_confirmed','order_shipped','order_delivered','review_received','new_message') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`relatedOrderId` int,
	`relatedShopId` int,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`listingId` int NOT NULL,
	`shopId` int NOT NULL,
	`quantity` int NOT NULL,
	`priceAtPurchase` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','confirmed','paid','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
	`paymentStatus` enum('pending','processing','completed','failed','refunded') DEFAULT 'pending',
	`stripePaymentIntentId` varchar(255),
	`shippingAddress` json,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`reportType` enum('listing','shop','review') NOT NULL,
	`reportedId` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`description` longtext,
	`status` enum('open','investigating','resolved','dismissed') DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`buyerId` int NOT NULL,
	`shopId` int NOT NULL,
	`listingId` int NOT NULL,
	`rating` tinyint NOT NULL,
	`title` varchar(255),
	`comment` longtext,
	`isVerifiedPurchase` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`logoUrl` varchar(512),
	`bannerUrl` varchar(512),
	`city` varchar(255),
	`state` varchar(255),
	`country` varchar(255),
	`phone` varchar(20),
	`website` varchar(512),
	`averageRating` decimal(3,2) DEFAULT '0',
	`totalReviews` int DEFAULT 0,
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('buyer','seller','admin') NOT NULL DEFAULT 'buyer';