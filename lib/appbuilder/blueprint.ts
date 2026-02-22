import { generateAI } from "@/lib/ai/router";

export async function generateBlueprint(prompt: string) {
  const result = await generateAI({
    prompt: `
You are an expert SaaS architect.

Generate a JSON blueprint for a full Next.js SaaS app.

Return this structure:
{
  "name": string,
  "description": string,
  "features": string[],
  "pages": string[],
  "apiEndpoints": string[],
  "databaseModels": string[]
}

User idea:
${prompt}
`,
    mode: "App Builder",
  });

  return result;
}