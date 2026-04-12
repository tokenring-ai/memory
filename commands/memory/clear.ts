import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({
                   agent,
                 }: AgentCommandInputType<typeof inputSchema>): string {
  agent.requireServiceByType(ShortTermMemoryService).clearMemory(agent);
  return "Cleared all memory items";
}

export default {
  name: "memory clear",
  description: "Remove all memory items",
  inputSchema,
  execute,
  help: `Remove all memory items.

## Example

/memory clear`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
