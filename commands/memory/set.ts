import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import _listMemories from "./_listMemories.ts";

const inputSchema = {
  args: {
    "--index": {
      type: "number",
      description: "Index of memory item to update",
      required: true,
      minimum: 0,
    }
  },
  positionals: [
    {
      name: "text",
      description: "New text for the memory item",
      required: true,
      greedy: true,
    },
  ]
} as const satisfies AgentCommandInputSchema;

async function execute({positionals: { text }, args, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const index = args["--index"]
  if (!text) throw new CommandFailedError("Please provide text for the memory item");
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);
  memoryService.spliceMemory(index, 1, agent, text);
  return `Updated memory item at index ${index}\n${await _listMemories(memoryService, agent)}`;
}

export default {
  name: "memory set",
  description: "Update memory item at index",
  inputSchema,
  execute,
  help: `Update memory item at specific index.

## Example

/memory set 0 Updated meeting notes`
} satisfies TokenRingAgentCommand<typeof inputSchema>;
