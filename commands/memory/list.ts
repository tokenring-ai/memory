import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

export default {
  name: "memory list",
  description: "Display all stored memory items",
  help: `# /memory list\n\nDisplay all stored memory items.\n\n## Example\n\n/memory list`,
  execute: async (_remainder: string, agent: Agent): Promise<string> =>
    _listMemories(agent.requireServiceByType(ShortTermMemoryService), agent),
} satisfies TokenRingAgentCommand;
