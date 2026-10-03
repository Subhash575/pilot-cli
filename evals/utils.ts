import { SYSTEM_PROMPT } from "../src/agent/system/prompt.ts";
import type { EvalData } from "./types.ts";
import { type ModelMessage } from "ai";

/**
 * Build message array from eval data
 */
export const buildMessages = (
  data: EvalData | { prompt?: string; systemPrompt?: string },
): ModelMessage[] => {
  const systemPrompt = data.systemPrompt ?? SYSTEM_PROMPT;
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: data.prompt! },
  ];
};
