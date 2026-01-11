import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    //if user already exist
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // if not then create new user
    if (user?.length == 0) {
      const userData: any = { name: args.name, email: args.email, token: 2 };
      const result = await ctx.db.insert("UserTable", userData);
      return userData;
    }

    return user[0];
  },
});

export const getUserById = query({
  args: {
    userId: v.id("UserTable"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
