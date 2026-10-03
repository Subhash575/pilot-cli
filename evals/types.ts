/*
 * Input data for single-turn tool selection evaluations.
 * Tests whether the LLM selects the correct tools without executing them.
 */
export interface EvalData {
  /** The user prompt to test */
  prompt: string;
  /** Optional system prompt override (uses default if not provided) */
  systemPrompt?: string;
  /** Tool names to make available for this evaluation */
  tools: string[];
  /** Configuration for the LLM call */
  config?: {
    model?: string;
    temperature?: number;
  };
}
