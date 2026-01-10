import { openai } from "@/config/genAiModel";
import { api } from "@/convex/_generated/api";
import { Agent, run, tool } from "@openai/agents";
import { fetchQuery } from "convex/nextjs";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const { userId, agentId, userInput } = await req.json();

  const agentDetails = await fetchQuery(api.agent.GetAgentById, {
    agentId: agentId,
  });

  console.log(agentDetails);

  let conversationId = null;
  //check if conversation Id exist or not
  const conversationDetails = await fetchQuery(
    api.conversation.GetConversationById,
    {
      userId,
      agentId,
    }
  );
  conversationId = conversationDetails?.conversationId;
  if (!conversationDetails.conversationId) {
    const { id } = await openai.conversations.create({});
    conversationId = id;
  }

  //map all tools
  const generateTools = agentDetails?.agentToolConfig?.tools.map((t: any) => {
    //dynamic build zod object for parameters
    const paramSchema = z.object(
      Object.fromEntries(
        Object.entries(t.parameters).map(([keyof, type]) => {
          if (type === "string") return [keyof, z.string()];
          if (type === "number") return [keyof, z.number()];
          return [keyof, z.any()];
        })
      )
    );

    return tool({
      name: t.name,
      description: t.description,
      parameters: paramSchema,
      async execute(params: Record<string, any>) {
        //replace placeholders in URL
        let url = t.url;
        for (const key in params) {
          url = url.replace(`{{${key}}}`, encodeURIComponent(params[key]));
        }
        if (t.includeApiKey && t.apiKey) {
          url += url.includes("?") ? `&key=${t.apiKey}` : `?key=${t.apiKey}`;
        }

        //make api request
        const response = await fetch(url);
        const data = await response.json();
        //console.log(data)
        //return raw data (or transform if needed)
        return data;
      },
    });
  });

  const createdAgents = agentDetails?.agentToolConfig?.agents.map(
    (config: any) => {
      return new Agent({
        name: config?.name,
        instructions: config?.instruction,
        tools: generateTools,
        model: "gpt-4.1-nano",
      });
    }
  );

  const finalAgent = Agent.create({
    name: agentDetails?.name,
    instructions: "You determine which agent to ues based on the user query",
    handoffs: createdAgents,
  });

  const result = await run(finalAgent, userInput, {
    conversationId,
    stream: true,
  });
  const stream = result.toTextStream({ compatibleWithNodeStreams: true });

  //@ts-ignore
  return new Response(stream);
}
