// Most agents or LLM don't know what the current time is or date unless the provider themselves
// are injecting that into the inference call when you hit it on their server maybe they do,
// maybe they don't so it best sometimes just to have a tool that an agent can lean on to get
// the current date.

/*
A tool contains the description and the schema of the input that the tool expects. This enables the language model to generate the input.
The tool can also contain an optional execute function for the actual execution function of the tool.
*/

import { tool } from "ai";
import { z } from "zod";
// zod is runtime schema

// Here tool generally take three argument:- `description`, `inputSchema` and
// `execute`(optionally).
// (imp pt):- Not every tool have execute function

export const dateTime = tool({
  description:
    "Return current time and date. Use this tool before any time related task",
  inputSchema: z.object({}),
  execute: async () => {
    return new Date().toISOString();
  },
});

// Here we take everything in string because we give prompt to "ai" in string.
