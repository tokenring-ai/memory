import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

const inputSchema = {
  args: {},
  positionals: [{
    name: "text",
    description: "Memory text to add",
    required: true,
    greedy: true,
  }],
  allowAttachments: false,
} as const satisfies AgentCommandInputSchema;

async function execute({positionals: { text }, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);
  memoryService.addMemory(text, agent);
  return `Added new memory: ${text}\n${await _listMemories(memoryService, agent)}`;
}

export default {
  name: "memory add",
  description: "Add a new memory item",
  inputSchema,
  execute,
  help: `Add a new memory item.

## Example

/memory add Remember to buy groceries tomorrow`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
