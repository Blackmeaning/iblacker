export type GenerateInput = {
  prompt: string;
  mode: string;
};

export type GenerateOutput = {
  plan: string[];
  output: string;
};