import Agent from "@tokenring-ai/agent/Agent";
import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

export default {
  name: "memory add",
  description: "Add a new memory item",
  help: `# /memory add\n\nAdd a new memory item.\n\n## Example\n\n/memory add Remember to buy groceries tomorrow`,
  execute: async (remainder: string, agent: Agent): Promise<string> => {
    const memoryText = remainder.trim();
    if (!memoryText) throw new CommandFailedError("Please provide text for the memory item");
    const memoryService = agent.requireServiceByType(ShortTermMemoryService);
    memoryService.addMemory(memoryText, agent);
    return `Added new memory: ${memoryText}\n${await _listMemories(memoryService, agent)}`;
  },
} satisfies TokenRingAgentCommand;
