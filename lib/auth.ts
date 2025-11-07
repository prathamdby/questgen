import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  rateLimiting: {
    enabled: true,
    storage: "database",
    window: 60, // 60 seconds
    max: 100, // Default for all routes
    customRules: {
      "/api/papers/generate": {
        window: 60,
        max: 2, // 2 generations per minute
      },
      "/api/papers/regenerate": {
        window: 60,
        max: 2,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh daily
  },
});
