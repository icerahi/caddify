import { v } from "convex/values";
import { query } from "./_generated/server";

export const GetConversationById = query({
  args: {
    userId: v.id("UserTable"),
    agentId: v.id("AgentTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("ConversationTable")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("agentId"), args.agentId)
        )
      )
      .collect();

    return result[0];
  },
});
