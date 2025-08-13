import ChatService from "@token-ring/chat/ChatService";
import {z} from "zod";
import MemoryService from "../MemoryService.ts";
import {Registry} from "@token-ring/registry";

/**
 * Goals tool: adds items to the goals list.
 */
export async function execute({ item }: { item?: string }, registry: Registry) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);


    if (!item) {
        chatService.errorLine(`Missing item parameter for the goal`);
        return "Please provide an item parameter for the goal";
    }

  const type = "These are the goals that have been set";
  memoryService.pushAttentionItem(type, item);
  // keep last 20 (remove everything before the last 20)
  memoryService.spliceAttentionItems(type, -20);

  chatService.infoLine(`Added goal`);

  return `Added goal`;
}

export const description =
  "Add a goal to the persistent chat memory, to guide future chats.";
export const parameters = z.object({
  item: z.string().describe("The goal to add to memory (max 10)"),
});
