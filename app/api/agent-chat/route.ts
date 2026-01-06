import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const { input, tools, agents, conversationId,agentName } = await req.json();

  //map all tools
  const generateTools = tools.map((t: any) => {
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

  const createdAgents= agents.map((config:any)=>{
    return new Agent({name:config.name,instruction:config.instruction,tools:generateTools})
  })

  const finalAgent = Agent.create({
    name:agentName,
    instructions:"You determine which agent to ues based on the user query",
    handoffs:createdAgents,
  })

  const result = await run(finalAgent,input,{conversationId,stream:true})
  const stream = result.toTextStream({compatibleWithNodeStream:true})

  return new Response(stream)
}


export async function GET(req:NextRequest){
  const {id:conversationId} = await openai.conversation.create({})
  return NextResponse.json(conversationId)
}