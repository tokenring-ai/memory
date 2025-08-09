import ChatService from "@token-ring/chat/ChatService";
import { z } from "zod";
import MemoryService from "../MemoryService.ts";

/**
 * Memory tool: stores memories for future reference in the session.
 */
export default execute;
export async function execute({ memory }: { memory: string }, registry: any) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

  memoryService.addMemory({
    role: "system",
    content: `You have a memory:\n ${memory}`,
  });

  chatService.infoLine(`Added new memory`);
  return `Memory added`;
}

export const description =
  "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

export const parameters = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});
