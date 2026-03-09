# @tokenring-ai/memory

## Overview

The `@tokenring-ai/memory` package provides short-term memory management for AI agents within the TokenRing framework. It enables agents to store and recall simple facts or information during a session, maintaining context across interactions without persistent storage. This package uses an agent state slice for memory storage and integrates with the TokenRing agent system via tools, chat commands, context handlers, and scripting functions.

## Features

- **Memory Storage**: Store and retrieve memories as strings in an ordered list
- **Context Integration**: Memories are automatically injected into agent context for all future interactions
- **Session Management**: Session-scoped storage—memories clear on chat or memory resets
- **Sub-agent Persistence**: Memories can be transferred from parent agents to sub-agents
- **Multiple Interfaces**: Tools and chat commands for programmatic and interactive management
- **State Management**: Built-in state serialization/deserialization for persistence
- **Context Injection**: Automatic injection of memories into agent context via context handlers

## Installation

```bash
bun install @tokenring-ai/memory
```

## Core Components

### ShortTermMemoryService

The primary service class implementing memory management for agents.

```typescript
import ShortTermMemoryService from "@tokenring-ai/memory/ShortTermMemoryService";

const service = new ShortTermMemoryService();
```

**Properties:**
- `name: string = "ShortTermMemoryService"` — Service identifier
- `description: string = "Provides Short Term Memory functionality"` — Service description

**Methods:**
- `attach(agent: Agent): void` — Initializes the `MemoryState` on agent attachment
- `addMemory(memory: string, agent: Agent): void` — Adds a memory string to the agent's memory state
- `clearMemory(agent: Agent): void` — Clears all memories from the agent's state
- `spliceMemory(index: number, count: number, agent: Agent, ...items: string[]): void` — Modifies the memory array (remove/replace/insert)

### MemoryState

An agent state slice for storing memories with serialization support.

```typescript
import { MemoryState } from "@tokenring-ai/memory/state/memoryState";

const state = new MemoryState({ memories: [] });
```

**Properties:**
- `name: string = "MemoryState"` — State slice name
- `serializationSchema` — Zod schema for state serialization
- `memories: string[]` — Array of memory strings

**Methods:**
- `constructor({memories?: string[]})` — Creates a new memory state with optional initial memories
- `reset(): void` — Clears memories when state is reset
- `transferStateFromParent(parent: Agent): void` — Transfers state from parent agent
- `serialize(): z.output<typeof serializationSchema>` — Serializes memories for persistence
- `deserialize(data: z.output<typeof serializationSchema>): void` — Deserializes memories from stored data
- `show(): string[]` — Returns formatted string representation of memories with 1-based indexing

### Context Handler

The `short-term-memory` context handler automatically injects memories into agent context:

```typescript
import {type ContextHandlerOptions, ContextItem} from "@tokenring-ai/chat/schema";
import {MemoryState} from "@tokenring-ai/memory/state/memoryState";

export default async function* getContextItems(
  {agent}: ContextHandlerOptions
): AsyncGenerator<ContextItem>
```

This yields memories as `ContextItem` objects with role "user" and memory content, making them available to the agent in all future interactions.

## Usage Examples

### Basic Service Usage

```typescript
import Agent from '@tokenring-ai/agent/Agent';
import ShortTermMemoryService from '@tokenring-ai/memory/ShortTermMemoryService';

const agent = new Agent({ services: [new ShortTermMemoryService()] });
const memoryService = agent.requireServiceByType(ShortTermMemoryService);

// Add memory
memoryService.addMemory('User prefers coffee over tea', agent);

// Clear all memories
memoryService.clearMemory(agent);

// Manipulate memories
memoryService.spliceMemory(0, 1, agent, 'User prefers tea over coffee');
```

### Context Integration

When the agent processes a request, memories are automatically injected into the context:

```typescript
// Context structure after adding memories:
// [
//   ...previous conversation,
//   { role: "user", content: "User prefers coffee over tea" },
//   { role: "user", content: "Meeting scheduled for 2 PM tomorrow" }
// ]
```

### Tool Integration

```typescript
// Tools can be executed programmatically
await agent.executeTool('memory_add', {
  memory: 'Meeting scheduled for 2 PM tomorrow'
});
```

### Chat Command Usage

```bash
# Agent input simulation
/memory add Remember to review the quarterly report
/memory list
# Output:
# Memory items:
# [0] Remember to review the quarterly report
```

### State Persistence

```typescript
// Memories persist across state serialization
const state = agent.getState(MemoryState);
const serializedData = state.serialize();
// ... later ...
const restoredState = new MemoryState();
restoredState.deserialize(serializedData);
```

### Sub-agent Integration

```typescript
// Memories can be transferred to sub-agents
const parentAgent = new Agent({ services: [new ShortTermMemoryService()] });
parentAgent.addState(new MemoryState({ memories: ['Important fact'] }));

const subAgent = parentAgent.createSubAgent();
const subState = subAgent.getState(MemoryState);
subState.transferStateFromParent(parentAgent);
// Sub-agent now has access to parent's memories
```

### Scripting Functions

```typescript
// When scripting is available, global functions are registered
await scriptingService.eval('addMemory("Important fact")');
await scriptingService.eval('clearMemory()');
```

## Plugin Configuration

The package does not require any runtime configuration. The configuration schema is empty:

```typescript
import { z } from "zod";

const packageConfigSchema = z.object({});
```

## API Reference

### ShortTermMemoryService Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `attach(agent)` | Initialize memory state | `agent: Agent` | `void` |
| `addMemory(memory, agent)` | Add a memory string | `memory: string`, `agent: Agent` | `void` |
| `clearMemory(agent)` | Clear all memories | `agent: Agent` | `void` |
| `spliceMemory(index, count, agent, ...items)` | Modify memory array | `index: number`, `count: number`, `agent: Agent`, `...items: string[]` | `void` |

### MemoryState Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `constructor({memories})` | Create state slice | `{memories?: string[]}` | `MemoryState` |
| `reset()` | Reset memory state | None | `void` |
| `transferStateFromParent(parent)` | Transfer state from parent agent | `parent: Agent` | `void` |
| `serialize()` | Convert to serializable object | None | `z.output<typeof serializationSchema>` |
| `deserialize(data)` | Restore from serialized data | `data: z.output<typeof serializationSchema>` | `void` |
| `show()` | Human-readable state summary | None | `string[]` |

### Context Handler

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getContextItems({agent})` | Yield memories as context items | `{agent: Agent}` | `AsyncGenerator<ContextItem>` |

## Tools

### memory_add

Adds a memory item via the memory service.

**Tool Definition:**

```typescript
{
  name: "memory_add",
  displayName: "Memory/addMemory",
  description: "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind.",
  inputSchema: z.object({
    memory: z.string().describe("The fact, idea, or info to remember.")
  }),
  execute: (params, agent) => Promise<string>
}
```

**Input Schema:**

```typescript
import { z } from "zod";

const inputSchema = z.object({
  memory: z.string().describe("The fact, idea, or info to remember."),
});
```

**Description:** "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind."

**Example:**

```typescript
await agent.executeTool('memory_add', {
  memory: 'User prefers detailed technical explanations'
});
```

## Chat Commands

**Location:** `commands/memory/`

| Command | File | Description |
|---------|------|-------------|
| `/memory list` | `commands/memory/list.ts` | Display all stored memory items |
| `/memory add <text>` | `commands/memory/add.ts` | Add a new memory item |
| `/memory clear` | `commands/memory/clear.ts` | Remove all memory items |
| `/memory remove <index>` | `commands/memory/remove.ts` | Remove memory item at index |
| `/memory set <index> <text>` | `commands/memory/set.ts` | Update memory item at index |

## Scripting Functions

The package registers global scripting functions when the ScriptingService is available:

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `addMemory(memory)` | Add a memory string | `memory: string` | `string` confirmation |
| `clearMemory()` | Clear all memories | None | `string` confirmation |

**Example:**

```typescript
await scriptingService.eval('addMemory("User preference: dark mode")');
await scriptingService.eval('clearMemory()');
```

## Error Handling

The package provides comprehensive error handling:

- **Invalid Parameters**: Clear validation errors for invalid input
- **State Errors**: Proper handling of invalid memory operations
- **Context Injection Errors**: Graceful handling of missing context handlers
- **Service Errors**: Descriptive errors for missing dependencies
- **Index Errors**: Validation for invalid memory indices in remove/set operations
- **Command Errors**: Uses `CommandFailedError` for chat command failures

### Error Types

| Error Type | Description | When Thrown |
|------------|-------------|-------------|
| `Error` | Missing parameter error | When `memory_add` tool receives empty memory |
| `CommandFailedError` | Command execution failure | When memory command receives invalid operation or parameters |

### Error Examples

```typescript
// Tool error - missing memory parameter
try {
  await agent.executeTool('memory_add', { memory: '' });
} catch (error) {
  console.error(error.message); // "[memory_add] Missing parameter: memory"
}

// Command error - invalid operation
try {
  await agent.executeCommand('memory invalid_op');
} catch (error) {
  console.error(error.message); // "Unknown operation."
}

// Command error - missing text
try {
  await agent.executeCommand('memory add');
} catch (error) {
  console.error(error.message); // "Please provide text for the memory item"
}
```

## Integration

### TokenRing Plugin Integration

The package automatically integrates with TokenRing applications:

```typescript
import memoryPlugin from "@tokenring-ai/memory/plugin";

app.installPlugin(memoryPlugin);
```

**Automatic Registration:**
- `ShortTermMemoryService` added to application services
- `memory_add` tool registered with `ChatService`
- `memory` command registered with `AgentCommandService`
- Global scripting functions (`addMemory`, `clearMemory`) registered with `ScriptingService`
- Context handlers registered for automatic memory injection

### Agent Integration

```typescript
// Service automatically available through agent
const memoryService = agent.requireServiceByType(ShortTermMemoryService);

// Add memory
memoryService.addMemory('Important fact', agent);

// Clear all memories
memoryService.clearMemory(agent);

// Modify memory at specific index
memoryService.spliceMemory(0, 1, agent, 'Updated fact');
```

## Development

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
```

### Package Structure

```
pkg/memory/
├── index.ts                              # Main entry point, exports ShortTermMemoryService
├── ShortTermMemoryService.ts             # Service implementation providing memory management
├── state/
│   └── memoryState.ts                    # Agent state slice for storing memories
├── contextHandlers/
│   └── shortTermMemory.ts                # Context handler for injecting memories into agent context
├── tools/
│   └── addMemory.ts                      # Tool to add a memory item to the agent's memory state
├── commands/
│   ├── memory.ts                         # /memory command index
│   └── memory/
│       ├── list.ts                       # /memory list
│       ├── add.ts                        # /memory add
│       ├── clear.ts                      # /memory clear
│       ├── remove.ts                     # /memory remove
│       ├── set.ts                        # /memory set
│       └── _listMemories.ts              # shared list helper
├── tools.ts                              # Exports agent tools
├── commands.ts                           # Exports chat commands
├── contextHandlers.ts                    # Exports context handlers
├── plugin.ts                             # Plugin for automatic service registration
├── package.json                          # Package metadata and dependencies
├── vitest.config.ts                      # Vitest configuration
└── README.md                             # This documentation
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tokenring-ai/app` | 0.2.0 | Base application framework |
| `@tokenring-ai/chat` | 0.2.0 | Chat service and tool definitions |
| `@tokenring-ai/agent` | 0.2.0 | Agent framework and state management |
| `@tokenring-ai/utility` | 0.2.0 | Shared utilities and helpers |
| `@tokenring-ai/scripting` | 0.2.0 | Scripting service for global functions |
| `zod` | ^4.3.6 | Schema validation and serialization |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vitest` | ^4.0.18 | Testing framework |
| `typescript` | ^5.9.3 | TypeScript compiler |

### Contribution Guidelines

- Follow established coding patterns
- Write unit tests for new functionality
- Update documentation for new features
- Ensure all changes work with TokenRing agent framework

## License

MIT License - see [LICENSE](./LICENSE) file for details.
