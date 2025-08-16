import ChatService from "@token-ring/chat/ChatService";
import {Registry} from "@token-ring/registry";
import MemoryService from "../MemoryService.ts";

export const description =
  "/memory [list|add|clear|remove|set] [args...] - Manage memory items.";

export async function execute(remainder: string, registry: Registry) {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const memoryService = registry.requireFirstServiceByType(MemoryService);

  // Show help if no arguments provided
  if (!remainder?.trim()) {
    help().forEach(line => chatService.systemLine(line));
    return;
  }

  const parts = remainder.trim().split(/\s+/);
  const operation = parts[0];
  const args = parts.slice(1);

  switch (operation) {
    case "list": {
      await listMemories(memoryService, chatService, registry);
      return;
    }

    case "add": {
      const memoryText = args.join(" ");
      if (!memoryText) {
        chatService.errorLine("Please provide text for the memory item");
        return;
      }
      memoryService.addMemory(memoryText);
      chatService.systemLine(`Added new memory: ${memoryText}`);
      break;
    }

    case "clear": {
      memoryService.clearMemory();
      chatService.systemLine("Cleared all memory items");
      break;
    }

    case "remove": {
      const index = Number.parseInt(args[0]);
      if (Number.isNaN(index)) {
        chatService.errorLine("Please provide a valid index number");
        return;
      }
      memoryService.spliceMemory(index, 1);
      chatService.systemLine(`Removed memory item at index ${index}`);
      break;
    }

    case "set": {
      const index = Number.parseInt(args[0]);
      if (Number.isNaN(index)) {
        chatService.errorLine("Please provide a valid index number");
        return;
      }
      const newText = args.slice(1).join(" ");
      if (!newText) {
        chatService.errorLine("Please provide text for the memory item");
        return;
      }
      memoryService.spliceMemory(index, 1, newText)
      chatService.systemLine(`Updated memory item at index ${index}`);
      break;
    }

    default:
      chatService.errorLine("Unknown operation. ");
      // Intentionally not calling help() bound to this
      return;
  }

  // Show updated memories after operation
  await listMemories(memoryService, chatService, registry);
}

async function listMemories(memoryService: any, chatService: any, registry: Registry) {
  let index = 0;

  for await (const memory of memoryService.getMemories("", registry)) {
    if (index === 0) {
      chatService.systemLine("Memory items:");
    }
    const lines = String(memory.content ?? "").split("\n");
    chatService.systemLine(`[${index}] ${lines[0]}`);
    for (let i = 1; i < lines.length; i++) {
      chatService.systemLine(`[${index}]  ${lines[i]}`);
    }
    index++;
  }

  if (index === 0) {
    chatService.systemLine("No memory items stored");
  }
}

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