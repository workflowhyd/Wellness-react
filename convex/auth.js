import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { signAdminToken, verifyAdminToken } from "./lib/adminAuth";

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return new Uint8Array(buf);
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const expected = process.env.ADMIN_PASSWORD;
    const secret = process.env.JWT_SECRET;
    if (!expected || !secret) throw new Error("Missing ADMIN_PASSWORD or JWT_SECRET environment variable");

    const [given, wanted] = await Promise.all([sha256(password), sha256(expected)]);
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
