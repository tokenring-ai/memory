import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import {CommandFailedError} from "@tokenring-ai/agent/AgentError";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

const description =
  "/memory - Manage memory items.";

async function execute(remainder: string, agent: Agent): Promise<string> {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);

  if (!remainder?.trim()) {
    return help;
  }

  const parts = remainder.trim().split(/\s+/);
  const operation = parts[0];
  const args = parts.slice(1);

  switch (operation) {
    case "list": {
      return await listMemories(memoryService, agent);
    }

    case "add": {
      const memoryText = args.join(" ");
      if (!memoryText) {
        throw new CommandFailedError("Please provide text for the memory item");
      }
      memoryService.addMemory(memoryText, agent);
      const updated = await listMemories(memoryService, agent);
      return `Added new memory: ${memoryText}\n${updated}`;
    }

    case "clear": {
      memoryService.clearMemory(agent);
      return "Cleared all memory items";
    }

    case "remove": {
      const index = Number.parseInt(args[0]);
      if (Number.isNaN(index)) {
        throw new CommandFailedError("Please provide a valid index number");
      }
      memoryService.spliceMemory(index, 1, agent);
      const updated = await listMemories(memoryService, agent);
      return `Removed memory item at index ${index}\n${updated}`;
    }

    case "set": {
      const index = Number.parseInt(args[0]);
      if (Number.isNaN(index)) {
        throw new CommandFailedError("Please provide a valid index number");
      }
      const newText = args.slice(1).join(" ");
      if (!newText) {
        throw new CommandFailedError("Please provide text for the memory item");
      }
      memoryService.spliceMemory(index, 1, agent, newText);
      const updated = await listMemories(memoryService, agent);
      return `Updated memory item at index ${index}\n${updated}`;
    }

    default:
      throw new CommandFailedError("Unknown operation.");
  }
}

async function listMemories(memoryService: any, agent: Agent): Promise<string> {
  let index = 0;
  const lines: string[] = [];

  for await (const memory of memoryService.getMemories("", agent)) {
    if (index === 0) {
      lines.push("Memory items:");
    }
    const memoryLines = String(memory.content ?? "").split("\n");
    lines.push(`[${index}] ${memoryLines[0]}`);
    for (let i = 1; i < memoryLines.length; i++) {
      lines.push(`[${index}]  ${memoryLines[i]}`);
    }
    index++;
  }

  if (index === 0) {
    lines.push("No memory items stored");
  }

  return lines.join("\n");
}

const help: string = `# MEMORY MANAGEMENT COMMAND

## Usage

/memory [operation] [arguments...]

## Operations

### list

Display all stored memory items

**Example:**
/memory list

### add <text>

Add a new memory item

**Examples:**
/memory add Remember to buy groceries tomorrow
/memory add Meeting notes: Discuss project timeline

### clear

Remove all memory items

**Example:**
/memory clear

### remove <index>

Remove memory item at specific index

**Examples:**
/memory remove 0
/memory remove 3

### set <index> <text>

Update memory item at specific index

**Examples:**
/memory set 0 Updated meeting notes
/memory set 2 Remember to buy groceries tomorrow

## General Usage

- Use /memory without arguments to show this help message
- Memory items are displayed with their index number in brackets
- Index numbers start from 0 (first item is [0])
- Use the list command to see current memory items and their indices

## Tips

- Use descriptive text for better memory organization
- Regularly review and clean up memory items
- Use the list command before removing or updating items`;

export default {
  description,
  execute,
  help,
} satisfies TokenRingAgentCommand
