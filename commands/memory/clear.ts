import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";

export default {
  name: "memory clear",
  description: "/memory clear - Remove all memory items",
  help: `# /memory clear\n\nRemove all memory items.\n\n## Example\n\n/memory clear`,
  execute: async (_remainder: string, agent: Agent): Promise<string> => {
    agent.requireServiceByType(ShortTermMemoryService).clearMemory(agent);
    return "Cleared all memory items";
  },
} satisfies TokenRingAgentCommand;
