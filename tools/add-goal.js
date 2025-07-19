import MemoryService from "../MemoryService.js";
import ChatService from "@token-ring/chat/ChatService";
import { z } from "zod";

/**
 * Goals tool: adds items to the goals list.
 * @param {object} args   Tool arguments: { item: string }
 * @param {TokenRingRegistry} registry - The package registry
 */
export default execute;
export async function execute({ item }, registry) {
 const chatService = registry.requireFirstServiceByType(ChatService);
 const memoryService = registry.requireFirstServiceByType(MemoryService);


 const type = "These are the goals that have been set";
 memoryService.pushAttentionItem(type, item);
 memoryService.spliceAttentionItems(type, -20);

  chatService.infoLine((`Added goal`));

 return `Added goal`;
}

export const description = "Add a goal to the persistent chat memory, to guide future chats.";
export const parameters = z.object({
  item: z.string().describe("The goal to add to memory (max 10)")
});
