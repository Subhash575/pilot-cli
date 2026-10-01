import { tools } from "./tools/index.ts";
export type toolname = keyof typeof tools;

// executeTool fn take the argument:- 1. toolname, 2. args(This is send by the llm/model)
export const executeTool = async (name: string, args: any) => {
  const tool = tools[name as toolname];

  if (!tool) {
    return "Unknow tool, this doesn't exist";
  }

  const execute = tool.execute;

  if (!execute) {
    return "This is not a registerd tool";
  }

  // In the execute their is args if any and optional object.
  const result = await execute(args, {
    toolCallId: "",
    messages: [],
  });

  return String(result);
};
