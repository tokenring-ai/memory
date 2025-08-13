import ChatService from "@token-ring/chat/ChatService";
import {z} from "zod";
import MemoryService from "../MemoryService.ts";
import {Registry} from "@token-ring/registry";

/**
 * Focus tool: adds items to the current focus list.
 */
export async function execute({ item }: { item?: string }, registry: Registry) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

  if (!item) {
      chatService.errorLine(`Missing item parameter for the focus`);
      return "Please provide an item to focus on";
  }

  const type = "Focus on these items";
  memoryService.pushAttentionItem(type, item);
  // keep last 10 (remove everything before the last 10)
  memoryService.spliceAttentionItems(type, -10);

  chatService.infoLine(`Added to focus`);
  return `Added to focus`;
}

export const description =
  "Add an item to focus on (max 5). The item will be presented in future chats to keep the focus on the current topic.";
export const parameters = z.object({
  item: z.string().describe("The item to add to the focus list."),
});
