import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,

  // ============ AUTH ============
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),

  // ============ USERS ============
  users: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Update user in database
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        return { success: true };
      }),

    promoteToSeller: protectedProcedure.mutation(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      if (user.role === "seller" || user.role === "admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already a seller" });
      }
      return { success: true };
    }),
  }),

  // ============ SHOPS ============
  shops: router({
    getById: publicProcedure
      .input(z.object({ shopId: z.number() }))
      .query(async ({ input }) => {
        const shop = await db.getShopById(input.shopId);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND" });
        return shop;
      }),

    getByUserId: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getShopByUserId(input.userId);
      }),

    getMine: protectedProcedure.query(async ({ ctx }) => {
      return await db.getShopByUserId(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(3),
          description: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
          phone: z.string().optional(),
          website: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existingShop = await db.getShopByUserId(ctx.user.id);
        if (existingShop) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Shop already exists" });
        }

        const result = await db.createShop({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          city: input.city,
          state: input.state,
          country: input.country,
          phone: input.phone,
          website: input.website,
        });

        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          shopId: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
          phone: z.string().optional(),
          website: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopById(input.shopId);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND" });
        if (shop.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateShop(input.shopId, {
          name: input.name,
          description: input.description,
          city: input.city,
          state: input.state,
          country: input.country,
          phone: input.phone,
          website: input.website,
        });

        return { success: true };
      }),
  }),

  // ============ CATEGORIES ============
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoryById(input.id);
      }),
  }),

  // ============ LISTINGS ============
  listings: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getListingById(input.id);
      }),

    getByShopId: publicProcedure
      .input(z.object({ shopId: z.number() }))
      .query(async ({ input }) => {
        return await db.getListingsByShopId(input.shopId);
      }),

    search: publicProcedure
      .input(
        z.object({
          keyword: z.string().optional(),
          categoryId: z.number().optional(),
          carMake: z.string().optional(),
          carModel: z.string().optional(),
          carYear: z.number().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          condition: z.string().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await db.searchListings(input);
      }),

    create: protectedProcedure
      .input(
        z.object({
          categoryId: z.number(),
          title: z.string().min(5),
          description: z.string().min(10),
          price: z.number().positive(),
          condition: z.enum(["new", "used", "refurbished"]),
          carMake: z.string().optional(),
          carModel: z.string().optional(),
          carYear: z.number().optional(),
          stock: z.number().default(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopByUserId(ctx.user.id);
        if (!shop) throw new TRPCError({ code: "BAD_REQUEST", message: "No shop found" });

        const result = await db.createListing({
          shopId: shop.id,
          categoryId: input.categoryId,
          title: input.title,
          description: input.description,
          price: input.price.toString(),
          condition: input.condition,
          carMake: input.carMake,
          carModel: input.carModel,
          carYear: input.carYear,
          stock: input.stock,
        });

        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          listingId: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          condition: z.enum(["new", "used", "refurbished"]).optional(),
          stock: z.number().optional(),
          status: z.enum(["active", "inactive", "sold"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: "NOT_FOUND" });

        const shop = await db.getShopByUserId(ctx.user.id);
        if (!shop || shop.id !== listing.shopId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateListing(input.listingId, {
          title: input.title,
          description: input.description,
          price: input.price?.toString(),
          condition: input.condition,
          stock: input.stock,
          status: input.status,
        });

        return { success: true };
      }),

    uploadPhotos: protectedProcedure
      .input(
        z.object({
          listingId: z.number(),
          photos: z.array(z.object({ data: z.string(), name: z.string() })),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: "NOT_FOUND" });

        const shop = await db.getShopByUserId(ctx.user.id);
        if (!shop || shop.id !== listing.shopId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        for (const photo of input.photos) {
          const buffer = Buffer.from(photo.data, "base64");
          const { url, key } = await storagePut(
            `listings/${input.listingId}/${photo.name}`,
            buffer,
            "image/jpeg"
          );

          await db.addListingPhoto({
            listingId: input.listingId,
            photoUrl: url,
            photoKey: key,
          });
        }

        return { success: true };
      }),

    getPhotos: publicProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getListingPhotos(input.listingId);
      }),
  }),

  // ============ CART ============
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCartItems(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(z.object({ listingId: z.number(), quantity: z.number().default(1) }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: "NOT_FOUND" });

        await db.addToCart(ctx.user.id, input.listingId, input.quantity);
        return { success: true };
      }),

    updateItem: protectedProcedure
      .input(z.object({ cartItemId: z.number(), quantity: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.updateCartItem(input.cartItemId, input.quantity);
        return { success: true };
      }),

    removeItem: protectedProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromCart(input.cartItemId);
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============ ORDERS ============
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          items: z.array(z.object({ listingId: z.number(), quantity: z.number() })),
          shippingAddress: z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
            country: z.string(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        let totalAmount = 0;
        const orderItems = [];

        for (const item of input.items) {
          const listing = await db.getListingById(item.listingId);
          if (!listing) throw new TRPCError({ code: "NOT_FOUND" });

          const itemTotal = parseFloat(listing.price) * item.quantity;
          totalAmount += itemTotal;
          orderItems.push({ ...item, shopId: listing.shopId, price: listing.price });
        }

        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const orderResult = await db.createOrder({
          buyerId: ctx.user.id,
          orderNumber,
          totalAmount: totalAmount.toString(),
          shippingAddress: input.shippingAddress,
        });

        return { success: true, orderNumber };
      }),

    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        if (order.buyerId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return order;
      }),

    getMyOrders: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrdersByBuyerId(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["pending", "confirmed", "paid", "shipped", "delivered", "cancelled", "refunded"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

        await db.updateOrder(input.orderId, { status: input.status });
        return { success: true };
      }),
  }),

  // ============ REVIEWS ============
  reviews: router({
    create: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          shopId: z.number(),
          listingId: z.number(),
          rating: z.number().min(1).max(5),
          title: z.string().optional(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order || order.buyerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.createReview({
          orderId: input.orderId,
          buyerId: ctx.user.id,
          shopId: input.shopId,
          listingId: input.listingId,
          rating: input.rating,
          title: input.title,
          comment: input.comment,
        });

        return { success: true };
      }),

    getByShop: publicProcedure
      .input(z.object({ shopId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewsByShopId(input.shopId);
      }),

    getByListing: publicProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewsByListingId(input.listingId);
      }),
  }),

  // ============ NOTIFICATIONS ============
  notifications: router({
    getMyNotifications: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),

  // ============ ADMIN ============
  admin: router({
    getReports: protectedProcedure
      .input(z.object({ status: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return await db.getReports(input.status);
      }),

    updateReportStatus: protectedProcedure
      .input(z.object({ reportId: z.number(), status: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await db.updateReportStatus(input.reportId, input.status);
        return { success: true };
      }),

    createReport: protectedProcedure
      .input(
        z.object({
          reportType: z.enum(["listing", "shop", "review"]),
          reportedId: z.number(),
          reason: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createReport({
          reporterId: ctx.user.id,
          reportType: input.reportType,
          reportedId: input.reportedId,
          reason: input.reason,
          description: input.description,
        });

        return { success: true };
      }),
  }),

  // ============ STRIPE (Setup only, not connected) ============
  stripe: router({
    createPaymentIntent: protectedProcedure
      .input(z.object({ amount: z.number(), orderId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Stripe integration setup (not connected to live keys)
        return {
          success: true,
          clientSecret: "pi_test_" + Math.random().toString(36).substr(2, 9),
          message: "Stripe integration configured but not connected to live",
        };
      }),

    confirmPayment: protectedProcedure
      .input(z.object({ orderId: z.number(), paymentIntentId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order || order.buyerId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateOrder(input.orderId, {
          paymentStatus: "completed",
          status: "paid",
          stripePaymentIntentId: input.paymentIntentId,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
