# Memory Package Documentation

## Overview

The `@tokenring-ai/memory` package provides short-term memory management for AI agents within the TokenRing framework. It enables agents to store and recall simple facts or information during a session, maintaining context across interactions without persistent storage. The package uses an agent state slice for memory storage and integrates with the TokenRing agent system via tools and chat commands.

Key features:
- Store and retrieve memories as strings.
- Memories are injected into agent context for all future interactions.
- Session-scoped storage—memories clear on chat reset.
- Persist memories to sub-agents automatically.
- Tools and chat commands for programmatic and interactive management.

This package is designed for use in AI agent applications, enhancing context awareness during conversations or tasks.

## Installation/Setup

This package is part of the TokenRing AI ecosystem. It's automatically installed with the main TokenRing project.

To use it in your agent:

```typescript
import { ShortTermMemoryService } from '@tokenring-ai/memory';

// Services are typically registered via package installation
const agent = new Agent({ services: [new ShortTermMemoryService()] });
```

The package is automatically installed and registered when the TokenRing application initializes. No additional configuration is required.

## Package Structure

The package is organized as follows:

- **index.ts**: Main entry point, exports package info, tools, chat commands, and core classes.
- **ShortTermMemoryService.ts**: Service implementation providing memory management and state initialization.
- **state/memoryState.ts**: Agent state slice for storing memories with serialization/deserialization support.
- **tools.ts**: Exports agent tools (memory/add).
  - **tools/addMemory.ts**: Tool to add a memory item to the agent's memory state.
- **chatCommands.ts**: Exports chat commands (/memory).
  - **commands/memory.ts**: Commands for managing memories (list, add, clear, remove, set).
- **package.json**: Package metadata and exports.
- **test/**: Unit tests.
- **LICENSE**: MIT license.

## Core Components

### ShortTermMemoryService

The primary service class implementing memory management for agents.

- **Properties**:
  - `name: string` - Service name: "ShortTermMemoryService".
  - `description: string` - "Provides Short Term Memory functionality".

- **Key Methods**:
  - `async attach(agent: Agent): Promise<void>` - Initializes the `MemoryState` on agent attachment.
  - `addMemory(memory: string, agent: Agent): void` - Adds a memory string to the agent's memory state.
  - `clearMemory(agent: Agent): void` - Clears all memories from the agent's state.
  - `spliceMemory(index: number, count: number, agent: Agent, ...items: string[]): void` - Modifies the memory array (remove/replace/insert).
  - `async *getContextItems(agent: Agent): AsyncGenerator<ContextItem>` - Yields memories as context items to be injected into agent context.

### MemoryState

An agent state slice for storing memories with serialization support.

- **Properties**:
  - `name: string` - State slice name: "MemoryState".
  - `memories: string[]` - Array of memory strings.
  - `persistToSubAgents: boolean` - Set to `true`; memories persist to sub-agents automatically.

- **Key Methods**:
  - `reset(what: ResetWhat[]): void` - Clears memories when chat resets.
  - `serialize(): object` - Serializes memories for persistence.
  - `deserialize(data: any): void` - Deserializes memories from stored data.

Memories are stored as context items positioned after prior messages in the agent context.

### Tools

Agent tools for programmatic addition:
- `memory/add`: Adds a memory item via `addMemory`. Input: `{ memory: string }`. Description: "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind."

### Chat Commands

Slash commands for interactive management:
- `/memory [op] [args]` - Memory management command.
  - No arguments: Shows help.
  - `list` - Shows all memory items with indices.
  - `add <text>` - Adds a new memory item.
  - `clear` - Clears all memory items.
  - `remove <index>` - Removes a memory item at the specified index.
  - `set <index> <text>` - Updates a memory item at the specified index.

Output is provided via `agent.infoLine()` and `agent.errorLine()` methods.

## Global Scripting Functions

When `@tokenring-ai/scripting` is available, the memory package automatically registers native functions:

- **addMemory(memory: string): string** - Adds a memory to short-term storage.
  ```bash
  /var $result = addMemory("Remember this important fact")
  /call addMemory("User prefers dark mode")
  ```
  Returns: `"Added memory: <first 50 chars of memory>..."`

- **clearMemory(): string** - Clears all memories.
  ```bash
  /var $result = clearMemory()
  /call clearMemory()
  ```
  Returns: `"Memory cleared"`

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
   import { ShortTermMemoryService } from '@tokenring-ai/memory';

   const agent = new Agent({ services: [new ShortTermMemoryService()] });
   const memoryService = agent.requireServiceByType(ShortTermMemoryService);

   // Add memory
   memoryService.addMemory('I like coffee.', agent);

   // Retrieve context items
   for await (const contextItem of memoryService.getContextItems(agent)) {
     console.log(contextItem.content); // "I like coffee."
   }
   ```

2. **Using Tools in Agent**:
   ```typescript
   // Assuming agent is configured with tools from '@tokenring-ai/memory'
   await agent.executeTool('memory/add', { memory: 'Remember this fact.' });
   // Tool adds to memory service internally.
   ```

3. **Chat Command Simulation** (via agent input):
   ```
   /memory add Remember to check emails
   // Agent outputs: Added new memory: Remember to check emails
   // Then lists updated memories.
   ```

4. **Using Scripting Functions**:
   ```bash
   /call addMemory("User prefers detailed explanations")
   /var $count = 5
   /call addMemory(`Need to process ${$count} items`)
   ```

## Configuration Options

- No runtime configuration or environment variables.
- Memories are session-scoped and reset when the chat resets (unless conversation context is preserved).
- Memories automatically persist to sub-agents via the `persistToSubAgents` flag.
- No item limits; all memories are retained until explicitly cleared or the session resets.

## API Reference

- **Classes**:
  - `ShortTermMemoryService extends TokenRingService`: See Core Components.
  - `MemoryState extends AgentStateSlice`: Agent state slice for memory storage.

- **Exports**:
  - `packageInfo: TokenRingPackage` - Package metadata and installation handler.
  - `ShortTermMemoryService` - Service class.
  - Tools: `{ addMemory: { name, execute, description, inputSchema } }` - Tool for adding memories.
  - Commands: `{ memory: { description, execute, help } }` - Chat command handler.

- **Types**: Relies on `@tokenring-ai/agent/types` (e.g., `ContextItem`, `TokenRingService`, `AgentStateSlice`).

## Dependencies

- `@tokenring-ai/agent@0.1.0`: Core agent framework, types, and service integration.
- `@tokenring-ai/utility@0.1.0`: Utilities package.
- `@tokenring-ai/scripting` (optional): For global scripting function registration (e.g., `addMemory()`, `clearMemory()`). Automatically integrated when available.

## Contributing/Notes

- **Testing**: Run tests with `bun run test` from the project root. Tests are located in `pkg/memory/test/`.
- **Building**: TypeScript module; builds as part of the main project via `bun run build`.
- **Limitations**: Session-scoped only—no persistence across application restarts. No vector search or embeddings; plain text storage. Memories are simple strings with no rich formatting support.
- **Extending**: Create a custom service by extending `TokenRingService` and implementing the required methods.
- **License**: MIT. Contributions welcome via PRs to the TokenRing repository.

For issues or features, refer to the main TokenRing project repository.