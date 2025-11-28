import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

const description =
  "/memory - Manage memory items.";

async function execute(remainder: string, agent: Agent) {
  const memoryService = agent.requireServiceByType(ShortTermMemoryService);

  // Show help if no arguments provided
  if (!remainder?.trim()) {
    agent.chatOutput(help);
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
} as TokenRingAgentCommand