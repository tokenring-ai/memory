import Agent from "@tokenring-ai/agent/Agent";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

export const description =
  "/memory [list|add|clear|remove|set] [args...] - Manage memory items.";

export async function execute(remainder: string, agent: Agent) {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);

  // Show help if no arguments provided
  if (!remainder?.trim()) {
    help().forEach(line => agent.infoLine(line));
    return;
  }

  const parts = remainder.trim().split(/\s+/);
  const operation = parts[0];
  const args = parts.slice(1);

  switch (operation) {
    case "list": {
      await listMemories(memoryService, agent);
      return;
    }

    case "add": {
      const memoryText = args.join(" ");
      if (!memoryText) {
        agent.errorLine("Please provide text for the memory item");
        return;
      }
      memoryService.addMemory(memoryText, agent);
      agent.infoLine(`Added new memory: ${memoryText}`);
      break;
    }

    case "clear": {
      memoryService.clearMemory(agent);
      agent.infoLine("Cleared all memory items");
      break;
    }

    case "remove": {
      const index = Number.parseInt(args[0]);
      if (Number.isNaN(index)) {
        agent.errorLine("Please provide a valid index number");
        return;
      }
      memoryService.spliceMemory(index, 1, agent);
      agent.infoLine(`Removed memory item at index ${index}`);
      break;
    }

    case "set": {
      const index = Number.parseInt(args[0]);
      if (Number.isNaN(index)) {
        agent.errorLine("Please provide a valid index number");
        return;
      }
      const newText = args.slice(1).join(" ");
      if (!newText) {
        agent.errorLine("Please provide text for the memory item");
        return;
      }
      memoryService.spliceMemory(index, 1, agent, newText);
      agent.infoLine(`Updated memory item at index ${index}`);
      break;
    }

    default:
      agent.errorLine("Unknown operation. ");
      // Intentionally not calling help() bound to this
      return;
  }

  // Show updated memories after operation
  await listMemories(memoryService, agent);
}

async function listMemories(memoryService: any, agent: Agent) {
  let index = 0;

  for await (const memory of memoryService.getMemories("", agent)) {
    if (index === 0) {
      agent.infoLine("Memory items:");
    }
    const lines = String(memory.content ?? "").split("\n");
    agent.infoLine(`[${index}] ${lines[0]}`);
    for (let i = 1; i < lines.length; i++) {
      agent.infoLine(`[${index}]  ${lines[i]}`);
    }
    index++;
  }

  if (index === 0) {
    agent.infoLine("No memory items stored");
  }
}

// noinspection JSUnusedGlobalSymbols
export function help() {
  return [
    "/memory [list|add|clear|remove|set] [args...]",
    "  - No arguments: shows this help message",
    "  - list: shows all memory items",
    "  - add <text>: adds a new memory item",
    "  - clear: clears all memory items",
    "  - remove <index>: removes memory item at specified index",
    "  - set <index> <text>: updates memory item at specified index",
  ];
}