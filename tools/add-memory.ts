import ChatService from "@token-ring/chat/ChatService";
import {Registry} from "@token-ring/registry";
import {z} from "zod";
import MemoryService from "../MemoryService.ts";

/**
 * Memory tool: stores memories for future reference in the session.
 */
export const name = "memory/add-memory";

export async function execute(
  {memory}: { memory?: string },
  registry: Registry
): Promise<string> {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

  if (!memory) {
    throw new Error(`[${name}] Missing memory parameter for the focus`);
  }

  memoryService.addMemory(memory);

  chatService.infoLine(`[${name}] Added new memory`);
  return "Memory added";
}

export const description =
  "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

export const inputSchema = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});
