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

/**
 * Target expectations for single-turn evaluations
 */
export interface EvalTarget {
  /** Tools that MUST be selected (golden prompts) */
  expectedTools?: string[];
  /** Tools that MUST NOT be selected (negative prompts) */
  forbiddenTools?: string[];
  /** Category for grouping and filtering */
  category: "golden" | "secondary" | "negative";
}

export interface SingleTurnResult {
  /** Raw tool calls from the LLM */
  toolCalls: Array<{ toolName: string; args: unknown }>;
  /** Just the tool names for easy comparison */
  toolNames: string[];
  /** Whether any tool was selected */
  selectedAny: boolean;
}
