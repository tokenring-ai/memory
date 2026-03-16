import Agent from "@tokenring-ai/agent/Agent";
import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

export default {
  name: "memory remove",
  description: "Remove memory item at index",
  help: `# /memory remove\n\nRemove memory item at specific index.\n\n## Example\n\n/memory remove 0`,
  execute: async (remainder: string, agent: Agent): Promise<string> => {
    const index = Number.parseInt(remainder.trim());
    if (Number.isNaN(index)) throw new CommandFailedError("Please provide a valid index number");
    const memoryService = agent.requireServiceByType(ShortTermMemoryService);
    memoryService.spliceMemory(index, 1, agent);
    return `Removed memory item at index ${index}\n${await _listMemories(memoryService, agent)}`;
  },
} satisfies TokenRingAgentCommand;
