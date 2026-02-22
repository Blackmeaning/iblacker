import { GenerateInput, GenerateOutput } from "./types";
import { generateWithOpenAI } from "./openai";

export async function generateAI(
  input: GenerateInput
): Promise<GenerateOutput> {
  // In future we can route by mode/provider here
  return generateWithOpenAI(input);
}