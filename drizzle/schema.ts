import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  longtext,
  tinyint,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow with buyer/seller roles.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["buyer", "seller", "admin"]).default("buyer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Shop/Seller storefront table
 */
export const shops = mysqlTable("shops", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: longtext("description"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  bannerUrl: varchar("bannerUrl", { length: 512 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  country: varchar("country", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 512 }),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: int("totalReviews").default(0),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shop = typeof shops.$inferSelect;
export type InsertShop = typeof shops.$inferInsert;

/**
 * Product categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  iconUrl: varchar("iconUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Car parts listings
 */
export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  shopId: int("shopId").notNull(),
  categoryId: int("categoryId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  condition: mysqlEnum("condition", ["new", "used", "refurbished"]).notNull(),
  carMake: varchar("carMake", { length: 100 }),
  carModel: varchar("carModel", { length: 100 }),
  carYear: int("carYear"),
  stock: int("stock").default(0),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: int("totalReviews").default(0),
  status: mysqlEnum("status", ["active", "inactive", "sold"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

/**
 * Listing photos/images
 */
export const listingPhotos = mysqlTable("listingPhotos", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  photoUrl: varchar("photoUrl", { length: 512 }).notNull(),
  photoKey: varchar("photoKey", { length: 512 }).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ListingPhoto = typeof listingPhotos.$inferSelect;
export type InsertListingPhoto = typeof listingPhotos.$inferInsert;

/**
 * Shopping cart
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  listingId: int("listingId").notNull(),
  quantity: int("quantity").default(1),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]).default("pending"),
  paymentStatus: mysqlEnum("paymentStatus", [
    "pending",
    "processing",
    "completed",
    "failed",
    "refunded",
  ]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  shippingAddress: json("shippingAddress"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order line items
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  listingId: int("listingId").notNull(),
  shopId: int("shopId").notNull(),
  quantity: int("quantity").notNull(),
  priceAtPurchase: decimal("priceAtPurchase", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Reviews and ratings
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  buyerId: int("buyerId").notNull(),
  shopId: int("shopId").notNull(),
  listingId: int("listingId").notNull(),
  rating: tinyint("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }),
  comment: longtext("comment"),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "order_placed",
    "order_confirmed",
    "order_shipped",
    "order_delivered",
    "review_received",
    "new_message",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  relatedOrderId: int("relatedOrderId"),
  relatedShopId: int("relatedShopId"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Reported content (for admin moderation)
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  reportType: mysqlEnum("reportType", ["listing", "shop", "review"]).notNull(),
  reportedId: int("reportedId").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  description: longtext("description"),
  status: mysqlEnum("status", ["open", "investigating", "resolved", "dismissed"]).default("open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
