import ChatService from "@token-ring/chat/ChatService";
import { z } from "zod";
import MemoryService from "../MemoryService.ts";

/**
 * Goals tool: adds items to the goals list.
 */
export default execute;
export async function execute({ item }: { item: string }, registry: any) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

  const type = "These are the goals that have been set";
  memoryService.pushAttentionItem(type, item);
  // keep last 20 (remove everything before the last 20)
  memoryService.spliceAttentionItems(type, -20 as any);

  chatService.infoLine(`Added goal`);

  return `Added goal`;
}

export const description =
  "Add a goal to the persistent chat memory, to guide future chats.";
export const parameters = z.object({
  item: z.string().describe("The goal to add to memory (max 10)"),
});
