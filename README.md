# Memory Package Documentation

## Overview

The `@tokenring-ai/memory` package provides memory management functionality for AI agents within the TokenRing framework. It handles short-term, ephemeral storage of memories (simple facts or information) and attention items (categorized lists like goals or focus areas). This allows agents to maintain context across interactions without persistent storage. The package includes an abstract base class for extensibility and a concrete in-memory implementation. It integrates with the TokenRing agent system via tools for adding items and chat commands for manual management.

Key features:
- Store and retrieve memories as strings.
- Manage categorized attention items (e.g., goals, focus).
- Async generators for yielding memories and attention in agent contexts.
- Tools and chat commands for interaction.

This package is designed for use in AI agent applications, enhancing context awareness during conversations or tasks.

## Installation/Setup

This package is part of the TokenRing AI ecosystem. To use it:

1. Ensure you have Node.js (v18+) installed.
2. Install via npm (assuming it's published) or add as a local dependency:
   ```
   npm install @tokenring-ai/memory
   ```
   Or, if building from source:
   ```
   npm install @tokenring-ai/agent@0.1.0 @tokenring-ai/utility@0.1.0
   # Then link or build the memory package
   ```

3. Import and instantiate in your agent setup:
   ```typescript
   import { EphemeralMemoryService } from '@tokenring-ai/memory';
   const memoryService = new EphemeralMemoryService();
   // Register with agent
   ```

No additional configuration is required for the ephemeral implementation. For persistent storage, extend `MemoryService`.

## Package Structure

The package is organized as follows:

- **index.ts**: Main entry point, exports package info, tools, chat commands, and core classes.
- **MemoryService.ts**: Abstract base class defining the memory API.
- **EphemeralMemoryService.ts**: Concrete implementation using in-memory arrays.
- **tools.ts**: Exports agent tools (add-memory, add-goal, add-focus).
  - **tools/add-memory.ts**: Tool to add a memory item.
  - **tools/add-goal.ts**: Tool to add a goal to attention (limits to last 20).
  - **tools/add-focus.ts**: Tool to add a focus item to attention (limits to last 10).
- **chatCommands.ts**: Exports chat commands (/memory, /attention).
  - **commands/memory.ts**: Commands for managing memories (list, add, clear, remove, set).
  - **commands/attention.ts**: Commands for managing attention items (list, add, clear, remove, set).
- **package.json**: Package metadata and exports.
- **test/**: Unit tests (e.g., EphemeralMemoryService.test.ts).
- **LICENSE**: MIT license.

## Core Components

### MemoryService (Abstract Base Class)

Defines the interface for memory services. Extend this for custom implementations.

- **Properties**:
  - `name: string` - Service name (e.g., "MemoryService").
  - `description: string` - Service description.

- **Key Methods**:
  - `addMemory(memory: string): void` - Adds a memory string to the list.
  - `clearMemory(): void` - Clears all memories.
  - `spliceMemory(index: number, count?: number, ...items: string[]): void` - Modifies the memory array (remove/replace/insert).
  - `pushAttentionItem(type: string, item: string): void` - Adds an item to a typed attention list.
  - `clearAttentionItems(type?: string): void` - Clears attention items (all or by type).
  - `spliceAttentionItems(type: string, index: number, count?: number, ...items: string[]): void` - Modifies a typed attention list.
  - `async *getMemories(agent: Agent): AsyncGenerator<MemoryItemMessage>` - Yields memories as chat messages.
  - `async *getAttentionItems(agent: Agent): AsyncGenerator<AttentionItemMessage>` - Yields formatted attention items as chat messages.

All methods throw errors if called directly on the abstract class.

### EphemeralMemoryService (Concrete Implementation)

In-memory storage for memories and attention. Extends `MemoryService`.

- **Internal State**:
  - `memories: string[]` - Array of memory strings.
  - `attentionItems: Record<string, string[]>` - Map of type to array of items.

- **Implemented Methods**:
  - Inherits and implements all from `MemoryService`.
  - `getMemories`: Yields each memory as `{ role: "user", content: memory }`.
  - `getAttentionItems`: Formats attention by type (e.g., "Goals\n- item1\n- item2") and yields as a single message if items exist.
  - Additional: `unshiftAttentionItem(type: string, item: string): void` - Adds to the front of the list.

Interactions: Memories are flat; attention is categorical. Tools and commands use these methods to update state, which is then yielded in agent contexts for context injection.

### Tools

Agent tools for programmatic addition:
- `memory/add-memory`: Adds to `memories` via `addMemory`. Input: `{ memory: string }`.
- `memory/add-goal`: Adds to attention type "These are the goals that have been set", limits to last 20 via `spliceAttentionItems`. Input: `{ item: string }`.
- `memory/add-focus`: Adds to attention type "Focus on these items", limits to last 10. Input: `{ item: string }`.

### Chat Commands

Slash commands for interactive management:
- `/memory [op] [args]`: Ops: `list` (shows indexed memories), `add <text>`, `clear`, `remove <index>`, `set <index> <text>`.
- `/attention [op] [args]`: Similar, but with `<type>` support: `add <type> <text>`, `clear [type]`, `remove <type> <index>`, `set <type> <index> <text>`.

These use `agent.infoLine`/`errorLine` for output and list items via generators.

## Global Scripting Functions

When `@tokenring-ai/scripting` is available, the memory package registers native functions:

- **addMemory(memory)**: Adds a memory to short-term storage.
  ```bash
  /var $result = addMemory("Remember this important fact")
  /call addMemory("User prefers dark mode")
  ```

- **clearMemory()**: Clears all memories.
  ```bash
  /var $result = clearMemory()
  /call clearMemory()
  ```

These functions integrate with the scripting system:

```bash
# Store context during a conversation
/var $fact = "User is interested in AI research"
/call addMemory($fact)

# Clear when starting a new topic
/call clearMemory()
```

## Usage Examples

1. **Basic Instantiation and Usage**:
   ```typescript
   import Agent from '@tokenring-ai/agent';
   import { EphemeralMemoryService } from '@tokenring-ai/memory';

   const agent = new Agent({ services: [new EphemeralMemoryService()] });
   const memoryService = agent.getFirstServiceByType(EphemeralMemoryService);

   // Add memory
   memoryService.addMemory('I like coffee.');

   // Add attention
   memoryService.pushAttentionItem('goals', 'Finish documentation');

   // Yield in context
   for await (const mem of memoryService.getMemories(agent)) {
     console.log(mem.content); // "I like coffee."
   }
   ```

2. **Using Tools in Agent**:
   ```typescript
   // Assuming agent is configured with tools from '@tokenring-ai/memory'
   await agent.executeTool('memory/add-memory', { memory: 'Remember this fact.' });
   // Tool adds to memory service internally.
   ```

3. **Chat Command Simulation** (via agent input):
   ```
   /memory add Remember to check emails
   // Agent outputs: Added new memory: Remember to check emails
   // Then lists updated memories.
   ```

## Configuration Options

- No runtime configs or env vars in the ephemeral implementation.
- Limits in tools: Goals (20 items), Focus (10 items) enforced via `splice`.
- For custom limits or persistence, extend `EphemeralMemoryService` and override methods.

## API Reference

- **Classes**:
  - `MemoryService` (abstract): See Core Components.
  - `EphemeralMemoryService extends MemoryService`: In-memory impl.

- **Exports**:
  - `packageInfo: TokenRingPackage` - Package metadata.
  - Tools: `{ addMemory: { name, execute, description, inputSchema } }`, similarly for goal/focus.
  - Commands: `{ memory: { description, execute, help } }`, similarly for attention.

- **Types**: Relies on `@tokenring-ai/agent/types` (e.g., `MemoryItemMessage`, `AttentionItemMessage` as `{ role: string, content: string }`).

## Dependencies

- `@tokenring-ai/agent@0.1.0`: Core agent framework, types, and service integration.
- `@tokenring-ai/utility@0.1.0`: Utilities (not directly used in core, but declared).
- `zod`: For tool input schemas (internal to tools).

## Contributing/Notes

- **Testing**: Run tests with `npm test` (focuses on EphemeralMemoryService).
- **Building**: TypeScript module; compiles to JS if needed.
- **Limitations**: Ephemeral only—no persistence across sessions. No vector search or embeddings; plain text storage. Attention formatting is basic (bulleted lists).
- **Extending**: Implement custom backends (e.g., database) by extending `MemoryService`.
- License: MIT. Contributions welcome via PRs to the TokenRing repo.

For issues or features, refer to the main TokenRing project.