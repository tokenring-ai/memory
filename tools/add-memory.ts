import ChatService from "@token-ring/chat/ChatService";
import { z } from "zod";
import MemoryService from "../MemoryService.ts";
import { Registry } from "@token-ring/registry";

/**
 * Memory tool: stores memories for future reference in the session.
 */
export async function execute(
  { memory }: { memory?: string },
  registry: Registry
)  : Promise<string|{error: string}> {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);
  const toolName = "add-memory";

  if (!memory) {
    const errorMsg = "Missing memory parameter for the focus";
    chatService.errorLine(`[${toolName}] ${errorMsg}`);
    return { error: errorMsg };
  }

  memoryService.addMemory(memory);

  chatService.infoLine(`[${toolName}] Added new memory`);
  return "Memory added";
}

export const description =
  "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

export const parameters = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});
