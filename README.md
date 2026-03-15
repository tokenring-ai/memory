# @tokenring-ai/memory

## Overview

The `@tokenring-ai/memory` package provides short-term memory management for AI agents within the TokenRing framework. It enables agents to store and recall simple facts or information during a session, maintaining context across interactions without persistent storage. This package uses an agent state slice for memory storage and integrates with the TokenRing agent system via tools, chat commands, context handlers, and scripting functions.

## Installation

```bash
bun install @tokenring-ai/memory
```

## Features

- **Memory Storage**: Store and retrieve memories as strings in an ordered list
- **Context Integration**: Memories are automatically injected into agent context for all future interactions
- **Session Management**: Session-scoped storage—memories clear on chat or memory resets
- **Sub-agent Persistence**: Memories can be transferred from parent agents to sub-agents
- **Multiple Interfaces**: Tools and chat commands for programmatic and interactive management
- **State Management**: Built-in state serialization/deserialization for persistence
- **Context Injection**: Automatic injection of memories into agent context via context handlers
- **Scripting Support**: Native functions available in scripting context

## Core Components/API

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
- `constructor({memories = []}: { memories?: string[] } = {})` — Creates a new memory state with optional initial memories
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

### Using Chat Commands

```typescript
// Add a memory
await agent.executeCommand('/memory add Remember to review the report');

// List all memories
const result = await agent.executeCommand('/memory list');
console.log(result);

// Remove a memory by index
await agent.executeCommand('/memory remove 0');

// Update a memory
await agent.executeCommand('/memory set 0 Updated meeting notes');

// Clear all memories
await agent.executeCommand('/memory clear');
```

### Using Tools

```typescript
// Execute memory_add tool programmatically
await agent.executeTool('memory_add', {
  memory: 'Meeting scheduled for 2 PM tomorrow'
});
```

### Using Scripting Functions

```typescript
import { ScriptingService } from '@tokenring-ai/scripting';

// When scripting is available, global functions are registered
await scriptingService.eval('addMemory("Important fact")');
await scriptingService.eval('clearMemory()');
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

## Configuration

The package does not require any runtime configuration. The configuration schema is empty:

```typescript
import { z } from "zod";

const packageConfigSchema = z.object({});
```

## Dependencies

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
| `typescript` | 5.9.3 | TypeScript compiler |

## Integration

### TokenRing Plugin Integration

The package automatically integrates with TokenRing applications:

```typescript
import memoryPlugin from "@tokenring-ai/memory/plugin";

app.installPlugin(memoryPlugin);
```

**Automatic Registration:**
- `ShortTermMemoryService` added to application services
- `addMemory` tool registered with `ChatService`
- `memory` commands registered with `AgentCommandService`
- Global scripting functions (`addMemory`, `clearMemory`) registered with `ScriptingService`
- Context handlers registered for automatic memory injection

### Agent Integration

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

### Tool Integration

```typescript
// Tools can be executed programmatically
await agent.executeTool('memory_add', {
  memory: 'Meeting scheduled for 2 PM tomorrow'
});
```

### State Management Integration

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

## Chat Commands

The package provides the following slash-prefixed commands:

| Command | Description | Example |
|---------|-------------|---------|
| `/memory list` | Display all stored memory items | `/memory list` |
| `/memory add <text>` | Add a new memory item | `/memory add Remember to review the report` |
| `/memory clear` | Remove all memory items | `/memory clear` |
| `/memory remove <index>` | Remove memory item at index | `/memory remove 0` |
| `/memory set <index> <text>` | Update memory item at index | `/memory set 0 Updated notes` |

### Command Details

#### `/memory list`

Display all stored memory items.

**Help:**
```
# /memory list

Display all stored memory items.

## Example

/memory list
```

**Output Format:**
```
Memory items:
[0] First memory item
[1] Second memory item
```

#### `/memory add <text>`

Add a new memory item.

**Help:**
```
# /memory add

Add a new memory item.

## Example

/memory add Remember to buy groceries tomorrow
```

**Output:**
```
Added new memory: Remember to buy groceries tomorrow
Memory items:
[0] Remember to buy groceries tomorrow
```

#### `/memory clear`

Remove all memory items.

**Help:**
```
# /memory clear

Remove all memory items.

## Example

/memory clear
```

**Output:**
```
Cleared all memory items
```

#### `/memory remove <index>`

Remove memory item at specific index.

**Help:**
```
# /memory remove

Remove memory item at specific index.

## Example

/memory remove 0
```

**Output:**
```
Removed memory item at index 0
Memory items:
[0] Remaining memory item
```

#### `/memory set <index> <text>`

Update memory item at specific index.

**Help:**
```
# /memory set

Update memory item at specific index.

## Example

/memory set 0 Updated meeting notes
```

**Output:**
```
Updated memory item at index 0
Memory items:
[0] Updated meeting notes
```

## Best Practices

1. **Use Descriptive Memories**: Store clear, concise facts that will be useful in future interactions
2. **Regular Cleanup**: Use `/memory clear` or `/memory remove` to maintain relevant memories
3. **Context Awareness**: Remember that memories are injected into every agent interaction
4. **Session Scope**: Be aware that memories are session-scoped and will be lost on reset
5. **Sub-agent Transfer**: Use `transferStateFromParent` when creating sub-agents that need context

## Testing and Development

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
│       └── _listMemories.ts              # Shared list helper
├── tools.ts                              # Exports agent tools
├── commands.ts                           # Exports chat commands
├── contextHandlers.ts                    # Exports context handlers
├── plugin.ts                             # Plugin for automatic service registration
├── package.json                          # Package metadata and dependencies
├── vitest.config.ts                      # Vitest configuration
└── README.md                             # This documentation
```

## Related Components

- `@tokenring-ai/agent` - Core agent framework
- `@tokenring-ai/chat` - Chat service and tool definitions
- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/scripting` - Scripting service for global functions

## License

MIT License - see [LICENSE](./LICENSE) file for details.
