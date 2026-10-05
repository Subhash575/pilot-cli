import { generateText, stepCountIs, tool, type ToolSet } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import type {
  EvalData,
  //   SingleTurnResult,
  //   MultiTurnEvalData,
  //   MultiTurnResult,
} from "./types.ts";
import { buildMessages } from "./utils.ts";

const TOOL_DEFINITIONS: any = {
  readFile: {
    description:
      "Read the contents of a specific file. Use this whenever the user names a file path, even if you're unsure it exists.",
    parameters: z.object({
      path: z.string().describe("the path to the file that you want to read"),
    }),
  },
  writeFile: {
    description: "Write given content to the file at the given path",
    parameters: z.object({
      path: z
        .string()
        .describe("the path to the file that you want to write to"),
      content: z
        .string()
        .describe("the content you want to write to the file."),
    }),
  },
  listFiles: {
    description:
      "List the files in a directory. Only use this when the user asks what files exist or wants a directory's contents. Do NOT use it to look for a file whose path is already given.",
    parameters: z.object({
      path: z
        .string()
        .describe(
          "the path to the directory in which you want to list the files.",
        ),
    }),
  },
  deleteFile: {
    description: "Delete a file at the given path",
    parameters: z.object({
      path: z.string().describe("the path to the file that you want to delete"),
    }),
  },
  runCommand: {
    description: "Execute a shell command and return its output",
    parameters: z.object({
      command: z.string().describe("the shell command to execute"),
    }),
  },
};

export const singleTurnExecutorWithMocks = async (data: EvalData) => {
  const messages = buildMessages(data);

  const tools: ToolSet = {};
  // for this we can refer folder data/file-tools.json
  /*
"data": {
      "prompt": "Read the contents of package.json",
      "tools": ["readFile", "writeFile", "listFiles", "deleteFile"]
    },
*/
  for (const toolName of data.tools) {
    const def = TOOL_DEFINITIONS[toolName];
    if (!def) throw new Error(`Unknown tool in eval data: ${toolName}`);
    if (def) {
      tools[toolName] = tool({
        description: def.description,
        inputSchema: def.parameters,
      });
    }
  }

  const { toolCalls } = await generateText({
    model: google(data.config?.model ?? "gemini-3.1-flash-lite"),
    messages,
    tools,
    stopWhen: stepCountIs(1),
    temperature: data.config?.temperature ?? undefined,
  });

  const calls = toolCalls.map((tc) => ({
    toolName: tc.toolName,
    args: "args" in tc ? tc.args : {},
  }));

  /*
In short, args is the object containing the actual values passed for the tool’s defined parameters.
Parameter definition: path
Argument value: "package.json"
tc.args: { path: "package.json" }
For writeFile, the parameters are path and content, so the arguments could be:
{
  path: "notes.txt",
  content: "Hello world",
}
*/

  const toolNames = toolCalls.map((tc) => tc.toolName);

  return {
    toolCalls,
    toolNames,
    SelectedAny: toolNames.length > 0,
  };
};
