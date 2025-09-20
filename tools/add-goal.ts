import Agent from "@tokenring-ai/agent/Agent";
import {z} from "zod";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

/**
 * Goals tool: adds items to the goals list.
 */
export const name = "memory/add-goal";

export async function execute({item}: { item?: string }, agent: Agent): Promise<string> {
  const memoryService = agent.requireFirstServiceByType(ShortTermMemoryService);

  if (!item) {
    // Throw error with tool name prefix
    throw new Error(`[${name}] Missing item parameter for the goal`);
  }

  const type = "These are the goals that have been set";
  memoryService.pushAttentionItem(type, item, agent);
  // Keep only the last 20 items
  memoryService.spliceAttentionItems(type, -20, 0, agent);

  // Inform user of successful addition
  agent.infoLine(`[${name}] Added goal`);

  // Return a success message
  return "Added goal";
}

export const description =
  "Add a goal to the persistent chat memory, to guide future chats.";
export const inputSchema = z.object({
  item: z.string().describe("The goal to add to memory (max 10)"),
});
