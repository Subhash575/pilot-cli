import { generateText, type ModelMessage } from "ai";
import { google } from "@ai-sdk/google";
import { tools } from "./tools/index.ts";
import { executeTool } from "./executeTools.ts";
import { SYSTEM_PROMPT } from "./system/prompt.ts";
import { Laminar } from "@lmnr-ai/lmnr";
import { getTracer } from "@lmnr-ai/lmnr";

/*
A system prompt is the base instructions for an LLM that primes it with its background and instructions. For example, it might contain instructions like "You are a helpful AI system. You provide clear, accurate and concise responses." This sets the context and behavior for how the LLM should respond to user queries.
*/

import type { AgentCallbacks } from "../types.ts";

const MODEL_NAME = "gemini-3.1-flash-lite";

Laminar.initialize({
  projectApiKey: process.env.LMNR_PROJECT_API_KEY,
});

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<any> {
  const { text, toolCalls } = await generateText({
    model: google(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
    tools,
    // setting up laminer:-
    experimental_telemetry: {
      isEnabled: true,
      tracer: getTracer(),
    },
  });

  // console.log(text, toolCalls);
  console.log("done");
  console.log(text);

  //Here toolCalls is array of object.
  async function toolExecution() {
    for (let i = 0; i < toolCalls.length; i++) {
      const tc = toolCalls[i];
      const res = await executeTool(tc.toolName, tc.input);
      console.log(res);
    }
  }
  toolExecution();

  // for (const tc of toolCalls) {
  //   try {
  //     const res = await executeTool(tc.toolName, tc.input);
  //     console.log(res);
  //   } catch (err) {
  //     console.error(`Tool ${tc.toolName} failed:`, err);
  //   }
  // }
}

// Q1:-
// runAgent("Hello, can you hear me?");

// Q2:-
// runAgent("Who won the 2026 world cup?");

// Q3:-
// runAgent("What is current time right now?");
// runAgent("Hello");
async function main() {
  await runAgent("Hello");
  await Laminar.shutdown();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// When we run this then we get the array of object where object is tools. (Here we don't getting
// any text.)

/*

 [
  {
    type: 'tool-call',
    toolCallId: 'call_960846',
    toolName: 'dateTime', --> `toolName` is given by us.
    input: {},
    providerExecuted: undefined,
    providerMetadata: { google: [Object] }
  }
]
--> Here Id is important bcs, It gets generated on the server from the provider. We have to
use that `ID` to identify the result for this tool when we added it back to the LLM
--> Input is the blank object bcs we said the date time tool has no input so it doesn't have one.


Note: When using 
async/await, a for loop would be better than forEach since the forEach
doesn't await promises returned from the callback.
*/

/*
The generateText function is used to generate text responses from a language model. You provide it with a model, a prompt (user message), and optionally a system prompt, and it returns generated text based on those inputs.
*/

/*
What is the purpose of the AI SDK's provider adapter modules like @ai-sdk/openai, @ai-sdk/google etc?
The provider adapter modules allow you to switch out different model providers (like OpenAI, Anthropic, etc.) while using the same SDK interface. This provides flexibility to change LLM providers without having to rewrite your code.

*/

/*
What is the core concept of how LLMs work at their most basic level?
At its core, an LLM is simple: you give it some text (input), and it generates some text (output) in response. The complexity comes in building sophisticated agents that can hold conversations, perform tasks, and produce consistently good results.
*/
