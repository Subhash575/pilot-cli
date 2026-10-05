import { evaluate } from "@lmnr-ai/lmnr";
import { toolSelectionScore } from "./evaluators.ts";

import type { EvalData, EvalTarget } from "./types.ts";
import dataset from "./data/file-tools.json" with { type: "json" };
import { singleTurnExecutorWithMocks } from "./executors.ts";

const executor = async (data: EvalData) => {
  return singleTurnExecutorWithMocks(data);
};

evaluate({
  data: dataset as any,
  executor,
  evaluators: {
    selectionScore: (output: any, target: any) => {
      if (target?.category === "secondary") return 1;
      return toolSelectionScore(output, target);
    },
  },
  groupName: "file-tools-selection",
});
