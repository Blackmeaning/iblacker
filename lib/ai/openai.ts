import OpenAI from "openai";
import { GenerateInput, GenerateOutput } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateWithOpenAI(
  input: GenerateInput
): Promise<GenerateOutput> {
  const systemPrompt = `
You are IBlacker AI Planner.

Return a JSON object with:
{
  "plan": string[],
  "output": string
}

The plan must be 3-6 actionable steps.
The output must be clear and professional.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Mode: ${input.mode}\nPrompt: ${input.prompt}`,
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return JSON.parse(content);
}