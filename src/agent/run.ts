import { generateText, type ModelMessage } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./system/prompt.ts";
/*
A system prompt is the base instructions for an LLM that primes it with its background and instructions. For example, it might contain instructions like "You are a helpful AI system. You provide clear, accurate and concise responses." This sets the context and behavior for how the LLM should respond to user queries.
*/

import type { AgentCallbacks } from "../types.ts";

const MODEL_NAME = "gemini-3.1-flash-lite";

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<any> {
  const { text } = await generateText({
    model: google(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
  });

  console.log(text);
}

// Q1:-
// runAgent("Hello, can you hear me?");

// Q2:-
runAgent("Who won the 2026 world cup?");

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
