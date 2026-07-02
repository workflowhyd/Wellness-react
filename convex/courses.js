import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAdmin } from "./lib/adminAuth";

export const list = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    await requireAdmin(token);
    const rows = await ctx.db.query("courses").order("asc").collect();
    return rows.map(({ _id, title }) => ({ id: _id, title }));
  },
});

export const add = mutation({
  args: { token: v.optional(v.string()), title: v.string() },
  handler: async (ctx, { token, title }) => {
    await requireAdmin(token);
    const trimmed = title.trim();
    if (!trimmed) throw new ConvexError("title is required");
    const id = await ctx.db.insert("courses", { title: trimmed });
    return { success: true, id };
  },
});

export const update = mutation({
  args: { token: v.optional(v.string()), id: v.id("courses"), title: v.string() },
  handler: async (ctx, { token, id, title }) => {
    await requireAdmin(token);
    const trimmed = title.trim();
    if (!trimmed) throw new ConvexError("title is required");
    await ctx.db.patch(id, { title: trimmed });
    return { success: true };
  },
});

export const remove = mutation({
  args: { token: v.optional(v.string()), id: v.id("courses") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(token);
    await ctx.db.delete(id);
    return { success: true };
  },
});
