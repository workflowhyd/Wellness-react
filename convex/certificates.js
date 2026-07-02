import { query } from "./_generated/server";
import { v } from "convex/values";

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
