import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

export default {
  name: "memory set",
  description: "/memory set <index> <text> - Update memory item at index",
  help: `# /memory set\n\nUpdate memory item at specific index.\n\n## Example\n\n/memory set 0 Updated meeting notes`,
  execute: async (remainder: string, agent: Agent): Promise<string> => {
    const parts = remainder.trim().split(/\s+/);
    const index = Number.parseInt(parts[0]);
    if (Number.isNaN(index)) throw new CommandFailedError("Please provide a valid index number");
    const newText = parts.slice(1).join(" ");
    if (!newText) throw new CommandFailedError("Please provide text for the memory item");
    const memoryService = agent.requireServiceByType(ShortTermMemoryService);
    memoryService.spliceMemory(index, 1, agent, newText);
    return `Updated memory item at index ${index}\n${await _listMemories(memoryService, agent)}`;
  },
} satisfies TokenRingAgentCommand;
