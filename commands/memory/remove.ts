import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

const inputSchema = {
  args: {
    "index": {
      type: "number",
      description: "Index of memory item to remove",
      required: true,
      minimum: 0,
    },
  },
} as const satisfies AgentCommandInputSchema;

function execute({
                   args,
                   agent,
                 }: AgentCommandInputType<typeof inputSchema>): string {
  const index = args.index;

  const memoryService = agent.requireServiceByType(ShortTermMemoryService);
  memoryService.spliceMemory(index, 1, agent);
  return `Removed memory item at index ${index}\n${_listMemories(agent)}`;
}

export default {
  name: "memory remove",
  description: "Remove memory item at index",
  inputSchema,
  execute,
  help: `Remove memory item at specific index.

## Example

/memory remove 0`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
