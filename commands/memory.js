import ChatService from "@token-ring/chat/ChatService";
import MemoryService from "../MemoryService.js";

/**
 * Usage:
 *   /memory              - shows all memory items
 *   /memory add <text>   - adds a new memory item
 *   /memory clear        - clears all memory items
 *   /memory remove <index> - removes memory item at specified index
 *   /memory set <index> <text> - updates memory item at specified index
 */

export const description = "/memory [add|clear|remove|set] [args...] - Manage memory items.";

export async function execute(remainder, registry) {
 const chatService = registry.requireFirstServiceByType(ChatService);
 const memoryService = registry.requireFirstServiceByType(MemoryService);

 // Show current memories if no arguments provided
 if (!remainder?.trim()) {
  await listMemories(memoryService, chatService, registry);
  return;
 }

 const parts = remainder.trim().split(/\s+/);
 const operation = parts[0];
 const args = parts.slice(1);

 switch (operation) {
  case "add": {
   const memoryText = args.join(" ");
   if (!memoryText) {
    chatService.errorLine("Please provide text for the memory item");
    return;
   }
   memoryService.addMemory({role: 'system', content: memoryText});
   chatService.systemLine(`Added new memory: ${memoryText}`);
   break;
  }

  case "clear": {
   memoryService.clearMemory();
   chatService.systemLine("Cleared all memory items");
   break;
  }

  case "remove": {
   const index = parseInt(args[0]);
   if (isNaN(index)) {
    chatService.errorLine("Please provide a valid index number");
    return;
   }
   memoryService.spliceMemory(index, 1);
   chatService.systemLine(`Removed memory item at index ${index}`);
   break;
  }

  case "set": {
   const index = parseInt(args[0]);
   if (isNaN(index)) {
    chatService.errorLine("Please provide a valid index number");
    return;
   }
   const newText = args.slice(1).join(" ");
   if (!newText) {
    chatService.errorLine("Please provide text for the memory item");
    return;
   }
   memoryService.spliceMemory(index, 1, {role: 'system', content: newText});
   chatService.systemLine(`Updated memory item at index ${index}`);
   break;
  }

  default:
   chatService.errorLine("Unknown operation. ");
   this.help(chatService);
   return;
 }

 // Show updated memories after operation
 await listMemories(memoryService, chatService, registry);
}

async function listMemories(memoryService, chatService, registry) {
 let index = 0;

 for await (const memory of memoryService.getMemories("", registry)) {
  if (index === 0) {
   chatService.systemLine("Memory items:");
  }
  const lines = memory.content.split('\n');
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
  "/memory [add|clear|remove|set] [args...]",
  "  - With no arguments: shows all memory items",
  "  - add <text>: adds a new memory item",
  "  - clear: clears all memory items",
  "  - remove <index>: removes memory item at specified index",
  "  - set <index> <text>: updates memory item at specified index"
 ]
}
