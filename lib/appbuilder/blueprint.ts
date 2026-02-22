import { generateAI } from "@/lib/ai/router";

export async function generateBlueprint(prompt: string, modules: string[]) {
  const result = await generateAI({
    mode: "App Builder",
    prompt: `
Return STRICT JSON only with this shape:
{
  "name": string,
  "description": string,
  "features": string[],
  "pages": string[],
  "apiEndpoints": string[],
  "databaseModels": string[],
  "modules": string[]
}

Requested modules (must reflect in "modules"):
${JSON.stringify(modules)}

User idea:
${prompt}
`,
  });

  return result;
}