import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAdmin } from "./lib/adminAuth";

const studentFields = {
  registrationNo: v.string(),
  name: v.string(),
  dob: v.string(),
  guardianName: v.string(),
  courseDurationDays: v.number(),
  batch: v.string(),
  trainedIn: v.string(),
};

function validateStudent({ registrationNo, name, dob, guardianName, courseDurationDays, batch, trainedIn }) {
  if (
    !registrationNo.trim() ||
    !name.trim() ||
    !dob.trim() ||
    !guardianName.trim() ||
    !batch.trim() ||
    !trainedIn.trim()
  ) {
    throw new ConvexError("All fields are required");
  }
  if (!Number.isFinite(courseDurationDays) || courseDurationDays <= 0) {
    throw new ConvexError("Course duration must be a positive number");
  }
  return {
    registrationNo: registrationNo.trim(),
    name: name.trim(),
    dob: dob.trim(),
    guardianName: guardianName.trim(),
    courseDurationDays,
    batch: batch.trim(),
    trainedIn: trainedIn.trim(),
  };
}

export const getByRegistrationNo = query({
  args: { registrationNo: v.string() },
  handler: async (ctx, { registrationNo }) => {
    const row = await ctx.db
      .query("certificates")
      .withIndex("by_registrationNo", (q) => q.eq("registrationNo", registrationNo))
      .unique();
    if (!row) return null;
    const { _id, _creationTime, ...rest } = row;
    return rest;
  },
});

export const listForDropdown = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("certificates").order("asc").collect();
    return rows.map(({ registrationNo, name }) => ({ registrationNo, name }));
  },
});

export const list = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    await requireAdmin(token);
    const rows = await ctx.db.query("certificates").order("asc").collect();
    return rows.map(({ _id, _creationTime, ...rest }) => ({ id: _id, ...rest }));
  },
});

export const add = mutation({
  args: { token: v.optional(v.string()), ...studentFields },
  handler: async (ctx, { token, ...fields }) => {
    await requireAdmin(token);
    const clean = validateStudent(fields);
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_registrationNo", (q) => q.eq("registrationNo", clean.registrationNo))
      .unique();
    if (existing) throw new ConvexError("A student with this Registration No already exists");
    const id = await ctx.db.insert("certificates", clean);
    return { success: true, id };
  },
});

export const update = mutation({
  args: { token: v.optional(v.string()), id: v.id("certificates"), ...studentFields },
  handler: async (ctx, { token, id, ...fields }) => {
    await requireAdmin(token);
    const clean = validateStudent(fields);
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_registrationNo", (q) => q.eq("registrationNo", clean.registrationNo))
      .unique();
    if (existing && existing._id !== id) {
      throw new ConvexError("A student with this Registration No already exists");
    }
    await ctx.db.patch(id, clean);
    return { success: true };
  },
});

export const remove = mutation({
  args: { token: v.optional(v.string()), id: v.id("certificates") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(token);
    await ctx.db.delete(id);
    return { success: true };
  },
});
