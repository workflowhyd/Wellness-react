import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAdmin } from "./lib/adminAuth";

export const submit = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    email: v.string(),
    course: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const firstName = args.firstName.trim();
    const phone = args.phone.trim();
    if (!firstName || !phone) {
      throw new ConvexError("First name and phone number are required");
    }
    const id = await ctx.db.insert("inquiries", {
      firstName,
      lastName: args.lastName.trim(),
      phone,
      email: args.email.trim(),
      course: args.course.trim(),
      message: args.message.trim(),
      status: "Pending",
    });
    return { success: true, id };
  },
});

export const list = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    await requireAdmin(token);
    const rows = await ctx.db.query("inquiries").order("desc").take(200);
    return rows.map(({ _id, _creationTime, ...rest }) => ({
      id: _id,
      createdAt: _creationTime,
      ...rest,
    }));
  },
});
