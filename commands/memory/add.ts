import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

const inputSchema = {
  args: {},
  remainder: {
    name: "text",
    description: "Memory text to add",
    required: true,
  },
} as const satisfies AgentCommandInputSchema;

function execute({
                         remainder,
                         agent,
                       }: AgentCommandInputType<typeof inputSchema>) {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);
  memoryService.addMemory(remainder, agent);
  return `Added new memory: ${remainder}\n${_listMemories(agent)}`;
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
