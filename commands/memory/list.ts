import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

async function execute({agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  return _listMemories(agent.requireServiceByType(ShortTermMemoryService), agent);
}

export default {
  name: "memory list",
  description: "Display all stored memory items",
  inputSchema,
  execute,
  help: `Display all stored memory items.

## Example

/memory list`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
