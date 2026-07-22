import type Agent from "@tokenring-ai/agent/Agent";
import type { TokenRingToolDefinition, TokenRingToolResult } from "@tokenring-ai/chat/schema";
import { ToolCallError } from "@tokenring-ai/chat/util/tokenRingTool";
import { z } from "zod";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

/**
 * Memory tool: stores memories for future reference in the session.
 */
const name = "memory_add";
const displayName = "Memory/addMemory";

function execute({ memory }: z.output<typeof inputSchema>, agent: Agent): TokenRingToolResult {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);

  if (!memory) {
    throw new ToolCallError(name, `Missing parameter: memory`);
  }

  memoryService.addMemory(memory, agent);

  return {
    message: `**Memory** Added new memory`,
    result: "Memory added",
  };
}

const description = "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

const inputSchema = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});

export default {
  name,
  displayName,
  description,
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
