import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import {
  signAdminToken,
  verifyAdminToken,
  requireAdmin,
  sha256,
  constantTimeEqual,
  bytesToHex,
  hexToBytes,
} from "./lib/adminAuth";

// Falls back to the ADMIN_PASSWORD env var until the first password change
// creates a row here — Convex functions can't update deployment env vars at
// runtime, so an in-app "change password" feature needs the password to live
// in the database instead.
async function getExpectedHash(ctx) {
  const row = await ctx.db.query("adminAuth").first();
  if (row) return hexToBytes(row.passwordHash);
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Missing ADMIN_PASSWORD environment variable");
  return sha256(expected);
}

export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Missing JWT_SECRET environment variable");

    const [given, wanted] = await Promise.all([sha256(password), getExpectedHash(ctx)]);
    if (!constantTimeEqual(given, wanted)) {
      throw new ConvexError("Invalid password");
    }

    const token = await signAdminToken(secret);
    return { token };
  },
});

export const checkSession = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    const secret = process.env.JWT_SECRET;
    if (!secret || !token) return { authenticated: false };
    const authenticated = await verifyAdminToken(token, secret);
    return { authenticated };
  },
});

export const changePassword = mutation({
  args: { token: v.optional(v.string()), oldPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, { token, oldPassword, newPassword }) => {
    await requireAdmin(token);

    if (newPassword.trim().length < 6) {
      throw new ConvexError("New password must be at least 6 characters");
    }

    const [given, wanted] = await Promise.all([sha256(oldPassword), getExpectedHash(ctx)]);
    if (!constantTimeEqual(given, wanted)) {
      throw new ConvexError("Current password is incorrect");
    }

    const passwordHash = bytesToHex(await sha256(newPassword));
    const existing = await ctx.db.query("adminAuth").first();
    if (existing) {
      await ctx.db.patch(existing._id, { passwordHash });
    } else {
      await ctx.db.insert("adminAuth", { passwordHash });
    }

    return { success: true };
  },
});
