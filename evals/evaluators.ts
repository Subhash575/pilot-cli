// Evaluator is essentially it like an assertion, It is like the test. It's the thing that turns the
// qualitative thing to a quantitative thing
import type { EvalTarget, SingleTurnResult } from "./types.ts";

/**
 * Evaluator: Precision/recall score for tool selection.
 * Returns a score between 0 and 1 based on correct selections.
 * For secondary prompts.
 */
export function toolSelectionScore(
  output: SingleTurnResult,
  target: EvalTarget,
): number {
  if (!target.expectedTools?.length) {
    return output.selectedAny ? 0.5 : 1;
  }

  const expected = new Set(target.expectedTools);
  const selected = new Set(output.toolNames);

  const hits = output.toolNames.filter((t) => expected.has(t)).length;
  const precision = selected.size > 0 ? hits / selected.size : 0;
  const recall = expected.size > 0 ? hits / expected.size : 0;

  // Simple F1-ish score
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}
