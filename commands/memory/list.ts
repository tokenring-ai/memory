import type { AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand } from "@tokenring-ai/agent/types";
import _listMemories from "./_listMemories.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({ agent }: AgentCommandInputType<typeof inputSchema>): string {
  return _listMemories(agent);
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
