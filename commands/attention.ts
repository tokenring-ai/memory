import ChatService from "@token-ring/chat/ChatService";
import {Registry} from "@token-ring/registry";
import MemoryService from "../MemoryService.ts";

export const description =
  "/attention [list|add|clear|remove|set] [args...] - Manage attention items.";

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
      await listAttentionItems(memoryService, chatService, registry);
      return;
    }

    case "add": {
      const type = args[0];
      const itemText = args.slice(1).join(" ");

      if (!type || !itemText) {
        chatService.errorLine(
          "Please provide both type and text for the attention item",
        );
        return;
      }

      memoryService.pushAttentionItem(type, itemText);
      chatService.systemLine(`Added new ${type} attention item: ${itemText}`);
      break;
    }

    case "clear": {
      const type = args[0];
      if (type) {
        memoryService.clearAttentionItems(type);
        chatService.systemLine(`Cleared all attention items of type: ${type}`);
      } else {
        // Clear all types
        for await (const item of memoryService.getAttentionItems(registry)) {
          const types = String(item.content).split("\n")[0]; // First line contains the type
          memoryService.clearAttentionItems(types);
        }
        chatService.systemLine("Cleared all attention items");
      }
      break;
    }

    case "remove": {
      const type = args[0];
      const index = Number.parseInt(args[1]);

      if (!type || Number.isNaN(index)) {
        chatService.errorLine(
          "Please provide both type and valid index number",
        );
        return;
      }

      memoryService.spliceAttentionItems(type, index, 1);
      chatService.systemLine(
        `Removed ${type} attention item at index ${index}`,
      );
      break;
    }

    case "set": {
      const type = args[0];
      const index = Number.parseInt(args[1]);
      const newText = args.slice(2).join(" ");

      if (!type || Number.isNaN(index) || !newText) {
        chatService.errorLine(
          "Please provide type, valid index number, and new text",
        );
        return;
      }

      memoryService.spliceAttentionItems(type, index, 1, newText);
      chatService.systemLine(
        `Updated ${type} attention item at index ${index}`,
      );
      break;
    }

    default:
      chatService.errorLine("Unknown operation. ");
      // Intentionally not calling help()
      return;
  }

  // Show updated attention items after operation
  await listAttentionItems(memoryService, chatService, registry);
}

async function listAttentionItems(memoryService: any, chatService: any, registry: Registry) {
  let hasItems = false;

  for await (const item of memoryService.getAttentionItems("", registry)) {
    hasItems = true;
    for (const line of String(item.content).split("\n")) {
      chatService.systemLine(line);
    }
  }

  if (!hasItems) {
    chatService.systemLine("No attention items stored");
  }
}

// noinspection JSUnusedGlobalSymbols
export function help() {
  return [
    "/attention [list|add|clear|remove|set] [args...]",
    "  - No arguments: shows this help message",
    "  - list: shows all attention items by type",
    "  - add <type> <text>: adds a new attention item of specified type",
    "  - clear [type]: clears all attention items (or just specified type)",
    "  - remove <type> <index>: removes attention item at specified index for given type",
    "  - set <type> <index> <text>: updates attention item at specified index for given type",
  ];
}
