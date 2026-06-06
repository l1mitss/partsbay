import { eq, and, or, like, gte, lte, desc, asc, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  shops,
  listings,
  listingPhotos,
  categories,
  cartItems,
  orders,
  orderItems,
  reviews,
  notifications,
  reports,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Shop queries
export async function getShopByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shops).where(eq(shops.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getShopById(shopId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shops).where(eq(shops.id, shopId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createShop(shopData: typeof shops.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(shops).values(shopData);
  return result;
}

export async function updateShop(shopId: number, updates: Partial<typeof shops.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(shops).set(updates).where(eq(shops.id, shopId));
}

// Category queries
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(asc(categories.name));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(categoryData: typeof categories.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(categories).values(categoryData);
}

// Listing queries
export async function getListingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getListingsByShopId(shopId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(listings)
    .where(eq(listings.shopId, shopId))
    .orderBy(desc(listings.createdAt));
}

export async function searchListings(filters: {
  keyword?: string;
  categoryId?: number;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(listings.status, "active")];

  if (filters.keyword) {
    conditions.push(
      or(
        like(listings.title, `%${filters.keyword}%`),
        like(listings.description, `%${filters.keyword}%`)
      ) as any
    );
  }

  if (filters.categoryId) {
    conditions.push(eq(listings.categoryId, filters.categoryId));
  }

  if (filters.carMake) {
    conditions.push(eq(listings.carMake, filters.carMake));
  }

  if (filters.carModel) {
    conditions.push(eq(listings.carModel, filters.carModel));
  }

  if (filters.carYear) {
    conditions.push(eq(listings.carYear, filters.carYear));
  }

  if (filters.minPrice !== undefined) {
    conditions.push(gte(listings.price, filters.minPrice.toString()));
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(lte(listings.price, filters.maxPrice.toString()));
  }

  if (filters.condition) {
    conditions.push(eq(listings.condition, filters.condition as any));
  }

  let baseQuery = db.select().from(listings).where(and(...conditions)).orderBy(desc(listings.createdAt));

  if (filters.limit && filters.offset) {
    return await baseQuery.limit(filters.limit).offset(filters.offset);
  } else if (filters.limit) {
    return await baseQuery.limit(filters.limit);
  } else if (filters.offset) {
    return await baseQuery.offset(filters.offset);
  }

  return await baseQuery;
}

export async function createListing(listingData: typeof listings.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(listings).values(listingData);
  return result;
}

export async function updateListing(
  listingId: number,
  updates: Partial<typeof listings.$inferInsert>
) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(listings).set(updates).where(eq(listings.id, listingId));
}

// Listing photos
export async function getListingPhotos(listingId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, listingId))
    .orderBy(asc(listingPhotos.displayOrder));
}

export async function addListingPhoto(photoData: typeof listingPhotos.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(listingPhotos).values(photoData);
}

export async function deleteListingPhoto(photoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(listingPhotos).where(eq(listingPhotos.id, photoId));
}

// Cart queries
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(
  userId: number,
  listingId: number,
  quantity: number = 1
) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.listingId, listingId)))
    .limit(1);

  if (existing && existing.length > 0 && existing[0]) {
    return await db
      .update(cartItems)
      .set({ quantity: (existing[0].quantity || 0) + quantity })
      .where(eq(cartItems.id, existing[0].id));
  }

  return await db.insert(cartItems).values({ userId, listingId, quantity: quantity || 1 });
}

export async function updateCartItem(cartItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId));
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Order queries
export async function createOrder(orderData: typeof orders.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(orders).values(orderData);
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrdersByBuyerId(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(orders)
    .where(eq(orders.buyerId, buyerId))
    .orderBy(desc(orders.createdAt));
}

export async function updateOrder(orderId: number, updates: Partial<typeof orders.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(orders).set(updates).where(eq(orders.id, orderId));
}

export async function createOrderItem(itemData: typeof orderItems.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(orderItems).values(itemData);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Review queries
export async function createReview(reviewData: typeof reviews.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(reviews).values(reviewData);
}

export async function getReviewsByShopId(shopId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.shopId, shopId))
    .orderBy(desc(reviews.createdAt));
}

export async function getReviewsByListingId(listingId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.listingId, listingId))
    .orderBy(desc(reviews.createdAt));
}

// Notification queries
export async function createNotification(notificationData: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(notifications).values(notificationData);
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

// Report queries
export async function createReport(reportData: typeof reports.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(reports).values(reportData);
}

export async function getReports(status?: string) {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.status, status as any))
      .orderBy(desc(reports.createdAt));
  }

  return await db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function updateReportStatus(reportId: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  return await db
    .update(reports)
    .set({ status: status as any })
    .where(eq(reports.id, reportId));
}
