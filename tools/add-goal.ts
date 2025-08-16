import ChatService from "@token-ring/chat/ChatService";
import {Registry} from "@token-ring/registry";
import {z} from "zod";
import MemoryService from "../MemoryService.ts";

/**
 * Goals tool: adds items to the goals list.
 */
export async function execute({item}: { item?: string }, registry: Registry): Promise<string | { error: string }> {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);


  if (!item) {
    // Output error with tool name prefix
    chatService.errorLine(`[add-goal] Missing item parameter for the goal`);
    // Return standardized error object
    return {error: "Missing item parameter for the goal"} as { error: string };
  }

  const type = "These are the goals that have been set";
  memoryService.pushAttentionItem(type, item);
  // Keep only the last 20 items
  memoryService.spliceAttentionItems(type, -20);

  // Inform user of successful addition
  chatService.infoLine(`[add-goal] Added goal`);

  // Return a success message (can be a simple string or object as needed)
  return "Added goal";
}

export const description =
  "Add a goal to the persistent chat memory, to guide future chats.";
export const parameters = z.object({
  item: z.string().describe("The goal to add to memory (max 10)"),
});
