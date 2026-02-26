import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (typeof apiKey !== "string" || apiKey.length === 0) {
  throw new Error("Missing OPENAI_API_KEY");
}

export const openai = new OpenAI({ apiKey });
