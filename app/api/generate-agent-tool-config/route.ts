import { model } from "@/config/genAiModel";
import { NextRequest, NextResponse } from "next/server";

const PROMPT = `
From the provided workflow/flow description, generate a complete AI agent instruction configuration.

Output MUST be a valid JSON object ONLY.
Do NOT include explanations, markdown, or extra text.

The JSON structure MUST strictly follow this schema and include all required details:

{
  "systemPrompt": "",
  "primaryAgentName": "",
  "agents": [
    {
      "id": "agent-unique-id",
      "output": "description of expected output",
      "tools": ["tool-id"],
      "instruction": "clear, step-by-step agent instructions"
    }
  ],
  "tools": [
    {
      "id": "tool-id",
      "name": "",
      "description": "",
      "method": "GET or POST",
      "url": "",
      "includeApiKey": true,
      "apiKey": "",
      "parameters": {
        "parameterName": "dataType"
      }
    }
  ]
}

Rules:
- All agent instructions must be complete and actionable.
- Tool IDs referenced by agents MUST exist in the tools array.
- Use realistic parameter names and data types.
- Include all required tools and agents implied by the workflow.
- Return valid JSON only.
`;

export async function POST(req: NextRequest) {
  const { jsonConfig } = await req.json();

  const result = await model.generateContent(
    JSON.stringify(jsonConfig) + PROMPT
  );
  const response = await result.response;
  const outputText = response.text();

  let parsedJson;
  try {
    parsedJson = JSON.parse(
      outputText.replace("```json", "").replace("```", "")
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to parse JSON from AI response", details: err },
      { status: 500 }
    );
  }

  return NextResponse.json(parsedJson);
}
