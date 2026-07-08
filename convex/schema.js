import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  inquiries: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    email: v.string(),
    course: v.string(),
    message: v.string(),
    status: v.string(),
  }),

  certificates: defineTable({
    registrationNo: v.string(),
    name: v.string(),
    dob: v.string(),
    guardianName: v.string(),
    courseDurationDays: v.number(),
    batch: v.string(),
    trainedIn: v.string(),
  }).index("by_registrationNo", ["registrationNo"]),

  courses: defineTable({
    title: v.string(),
  }),

  // Singleton — at most one row. Falls back to the ADMIN_PASSWORD env var
  // in convex/auth.js until the first password change creates this row,
  // since env vars can't be updated from a mutation at runtime.
  adminAuth: defineTable({
    passwordHash: v.string(),
  }),
});
