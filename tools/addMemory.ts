import Agent from "@tokenring-ai/agent/Agent";
import { z } from "zod";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

/**
 * Memory tool: stores memories for future reference in the session.
 */
export const name = "memory/add";

export async function execute(
	{ memory }: { memory?: string },
	agent: Agent,
): Promise<string> {
	const memoryService = agent.requireServiceByType(ShortTermMemoryService);

	if (!memory) {
		throw new Error(`[${name}] Missing parameter: memory`);
	}

	memoryService.addMemory(memory, agent);

	agent.infoLine(`[${name}] Added new memory`);
	return "Memory added";
}

export const description =
	"Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.";

export const inputSchema = z.object({
	memory: z.string().describe("The fact, idea, or info to remember."),
});
