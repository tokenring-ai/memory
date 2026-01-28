import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

/**
 * Memory tool: stores memories for future reference in the session.
 */
const name = "memory_add";
const displayName = "Memory/addMemory";

async function execute(
  {memory}: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<string> {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);

  if (!memory) {
    throw new Error(`[${name}] Missing parameter: memory`);
  }

  memoryService.addMemory(memory, agent);

  agent.infoMessage(`[${name}] Added new memory`);
  return "Memory added";
}

const description =
  "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

const inputSchema = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});

export default {
  name, displayName, description, inputSchema, execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
