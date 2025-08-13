import ChatService from "@token-ring/chat/ChatService";
import {z} from "zod";
import MemoryService from "../MemoryService.ts";
import {Registry} from "@token-ring/registry";

/**
 * Memory tool: stores memories for future reference in the session.
 */
export async function execute({ memory }: { memory?: string }, registry: Registry) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

    if (!memory) {
        chatService.errorLine(`Missing memory parameter for the focus`);
        return "Please provide a memory parameter"
    }

  memoryService.addMemory(memory);

  chatService.infoLine(`Added new memory`);
  return `Memory added`;
}

export const description =
  "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

export const parameters = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});
