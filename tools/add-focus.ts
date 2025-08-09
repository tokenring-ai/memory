import ChatService from "@token-ring/chat/ChatService";
import { z } from "zod";
import MemoryService from "../MemoryService.ts";

/**
 * Focus tool: adds items to the current focus list.
 */
export default execute;
export async function execute({ item }: { item: string }, registry: any) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

  const type = "Focus on these items";
  memoryService.pushAttentionItem(type, item);
  // keep last 10 (remove everything before the last 10)
  memoryService.spliceAttentionItems(type, -10 as any);

  chatService.infoLine(`Added to focus`);
  return `Added to focus`;
}

export const description =
  "Add an item to focus on (max 5). The item will be presented in future chats to keep the focus on the current topic.";
export const parameters = z.object({
  item: z.string().describe("The item to add to the focus list."),
});
