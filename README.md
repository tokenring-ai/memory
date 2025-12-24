# @tokenring-ai/memory

## Overview

The `@tokenring-ai/memory` package provides short-term memory management for AI agents within the TokenRing framework. It enables agents to store and recall simple facts or information during a session, maintaining context across interactions without persistent storage. The package uses an agent state slice for memory storage and integrates with the TokenRing agent system via tools and chat commands.

### Key Features

- **Memory Storage**: Store and retrieve memories as strings in an ordered list
- **Context Integration**: Memories are automatically injected into agent context for all future interactions
- **Session Management**: Session-scoped storage—memories clear on chat or memory resets
- **Sub-agent Persistence**: Memories automatically persist to sub-agents
- **Multiple Interfaces**: Tools and chat commands for programmatic and interactive management
- **State Management**: Built-in state serialization/deserialization for persistence
- **Context Injection**: Automatic injection of memories into agent context via context handlers

This package is designed for use in AI agent applications, enhancing context awareness during conversations or tasks.

## Installation

This package is part of the TokenRing AI ecosystem. It's automatically installed with the main TokenRing project.

```bash
bun install @tokenring-ai/memory
```

## Package Structure

```
pkg/memory/
├── index.ts                 # Main entry point, exports ShortTermMemoryService
├── ShortTermMemoryService.ts # Service implementation providing memory management
├── state/
│   └── memoryState.ts       # Agent state slice for storing memories
├── tools/
│   └── addMemory.ts         # Tool to add a memory item to the agent's memory state
├── commands/
│   └── memory.ts            # Chat commands for managing memories
├── tools.ts                 # Exports agent tools
├── chatCommands.ts          # Exports chat commands
├── contextHandlers/
│   └── shortTermMemory.ts   # Context handler for injecting memories into agent context
├── plugin.ts                # Plugin for automatic service registration
├── package.json             # Package metadata and dependencies
└── README.md                # This documentation
```

## Core Components

### ShortTermMemoryService

The primary service class implementing memory management for agents.

**Properties:**
- `name: string` - Service name: "ShortTermMemoryService"
- `description: string` - "Provides Short Term Memory functionality"

**Key Methods:**
- `async attach(agent: Agent): Promise<void>` - Initializes the `MemoryState` on agent attachment
- `addMemory(memory: string, agent: Agent): void` - Adds a memory string to the agent's memory state
- `clearMemory(agent: Agent): void` - Clears all memories from the agent's state
- `spliceMemory(index: number, count: number, agent: Agent, ...items: string[]): void` - Modifies the memory array (remove/replace/insert)

### MemoryState

An agent state slice for storing memories with serialization support.

**Properties:**
- `name: string` - State slice name: "MemoryState"
- `memories: string[]` - Array of memory strings

**Key Methods:**
- `reset(what: ResetWhat[]): void` - Clears memories when chat or memory resets
- `transferStateFromParent(parent: Agent): void` - Transfers state from parent agent
- `serialize(): object` - Serializes memories for persistence
- `deserialize(data: any): void` - Deserializes memories from stored data
- `show(): string[]` - Returns formatted string representation of memories

Memories are stored as context items positioned after prior messages in the agent context.

### Context Handler

The `shortTermMemory` context handler automatically injects memories into agent context:

```typescript
export default async function * getContextItems(
  input: string, 
  chatConfig: ChatConfig, 
  params: {}, 
  agent: Agent
): AsyncGenerator<ContextItem>
```

This yields memories as `ContextItem` objects with role "user" and memory content.

## Tools

Agent tool for programmatic memory addition:

### memory/add

Adds a memory item via the memory service.

**Input Schema:**
```typescript
{
  memory: string  // The fact, idea, or info to remember
}
```

**Description:** "Add an item to the memory list. The item will be presented in future chats to help keep important information in the back of your mind."

**Example:**
```typescript
await agent.executeTool('memory/add', { 
  memory: 'User prefers detailed technical explanations' 
});
```

## Chat Commands

Slash command for interactive memory management:

### /memory [operation] [arguments]

**No arguments:** Shows help message

**Operations:**

- **list** - Shows all memory items with indices
- **add <text>** - Adds a new memory item
- **clear** - Clears all memory items  
- **remove <index>** - Removes memory item at specified index (0-based)
- **set <index> <text>** - Updates memory item at specified index

**Examples:**
```bash
/memory add Remember to check emails tomorrow
/memory list
/memory remove 0
/memory set 1 Updated meeting notes
/memory clear
```

## Global Scripting Functions

When `@tokenring-ai/scripting` is available, the memory package automatically registers native functions:

### addMemory(memory: string): string

Adds a memory to short-term storage.

```bash
/var $result = addMemory("Remember this important fact")
/call addMemory("User prefers dark mode")
```

**Returns:** `Added memory: <first 50 chars of memory>...`

### clearMemory(): string

Clears all memories.

```bash
/var $result = clearMemory()
/call clearMemory()
```

**Returns:** `Memory cleared`

**Usage Examples:**
```bash
# Store context during a conversation
/var $fact = "User is interested in AI research"
/call addMemory($fact)

# Clear when starting a new topic
/call clearMemory()

# Store multiple related facts
/call addMemory("Project deadline is December 15th")
/call addMemory("Key stakeholders: Alice, Bob, Charlie")
/call addMemory("Budget approved: $50,000")
```

## Plugin Integration

The package automatically integrates with TokenRing applications via its plugin:

```typescript
export default {
  name: "@tokenring-ai/memory",
  version: "0.2.0",
  install(app: TokenRingApp) {
    // Registers services, tools, commands, and scripting functions
  }
}
```

**Automatic Registration:**
- ShortTermMemoryService added to application services
- `memory/add` tool registered with chat service
- `/memory` command registered with agent command service  
- Global scripting functions (`addMemory`, `clearMemory`) registered when scripting is available
- Context handlers registered for memory injection

## Usage Examples

### 1. Basic Service Usage

```typescript
import Agent from '@tokenring-ai/agent/Agent';
import { ShortTermMemoryService } from '@tokenring-ai/memory';

const agent = new Agent({ services: [new ShortTermMemoryService()] });
const memoryService = agent.requireServiceByType(ShortTermMemoryService);

// Add memory
memoryService.addMemory('User prefers coffee over tea', agent);

// Clear all memories
memoryService.clearMemory(agent);

// Manipulate memories
memoryService.spliceMemory(0, 1, agent, 'User prefers tea over coffee');
```

### 2. Context Integration

Memories are automatically available in agent context:

```typescript
// When agent processes a request, memories are automatically injected
// Context structure:
// [
//   ...previous conversation,
//   { role: "user", content: "User prefers coffee over tea" }
// ]
```

### 3. Tool Integration

```typescript
// Tools can be executed programmatically
await agent.executeTool('memory/add', { 
  memory: 'Meeting scheduled for 2 PM tomorrow' 
});
```

### 4. Chat Command Simulation

```bash
# Agent input simulation
/memory add Remember to review the quarterly report
/memory list
# Output: 
# Memory items:
# [0] Remember to review the quarterly report
```

### 5. State Persistence

```typescript
// Memories persist across state serialization
const checkpoint = agent.createCheckpoint();
// ... later ...
agent.restoreFromCheckpoint(checkpoint);
// Memories are restored
```

### 6. Sub-agent Integration

```typescript
// Memories automatically transfer to sub-agents
const subAgent = agent.createSubAgent();
// Sub-agent has access to parent's memories
```

## Configuration Options

- **No runtime configuration** or environment variables required
- **Session-scoped**: Memories reset when chat or memory resets
- **Sub-agent persistence**: Memories automatically persist to sub-agents
- **No item limits**: All memories are retained until explicitly cleared or session resets
- **Serialization support**: Memories can be serialized/deserialized for persistence
- **Context injection**: Memories automatically injected into agent context via context handlers

## API Reference

### Classes

- **ShortTermMemoryService**: Core memory service implementation
  - `attach(agent: Agent)`: Initialize memory state
  - `addMemory(memory: string, agent: Agent)`: Add memory
  - `clearMemory(agent: Agent)`: Clear all memories
  - `spliceMemory(index: number, count: number, agent: Agent, ...items: string[])`: Modify memories

- **MemoryState**: Agent state slice for memory storage
  - `memories: string[]`: Array of stored memories
  - `reset(what: ResetWhat[])`: Reset on chat/memory clear
  - `serialize()`: Convert to serializable object
  - `deserialize(data)`: Restore from serialized data
  - `show()`: Human-readable string representation

### Context Handlers

- **shortTermMemory**: Async generator that yields memories as context items
  - Parameters: `input`, `chatConfig`, `params`, `agent`
  - Yields: `ContextItem[]` with memories

### Tools

- **memory/add**: Tool for adding memories via chat system
  - Input: `{ memory: string }`
  - Validates memory parameter
  - Adds via memory service

### Commands

- **/memory**: Interactive memory management
  - Subcommands: list, add, clear, remove, set
  - Help integration
  - Error handling

### Plugin Functions

- **addMemory(memory: string)**: Global scripting function
- **clearMemory()**: Global scripting function

## Dependencies

- **@tokenring-ai/app@0.2.0**: Application framework and service management
- **@tokenring-ai/chat@0.2.0**: Chat service and tool integration
- **@tokenring-ai/agent@0.2.0**: Core agent framework and state management
- **@tokenring-ai/scripting@0.2.0**: Optional scripting system integration
- **zod**: Schema validation for tools

## Development

### Testing

Run tests with `bun test` from the project root. Tests cover:
- Memory service initialization
- Memory addition and retrieval
- Memory clearing
- Memory manipulation via splice
- Context handler functionality
- Plugin integration

### Building

TypeScript module; builds as part of the main project via `bun run build` from the project root.

### Package Version

Current version: 0.2.0

## Limitations

- **Session-scoped only**: No persistence across application restarts
- **Simple text storage**: No vector search or embeddings; plain text storage only
- **No rich formatting**: Memories are simple strings with no formatting support
- **No categorization**: All memories stored in single ordered list
- **No attention items**: Basic memory functionality only (no attention item categorization)

## License

MIT. Contributions welcome via PRs to the TokenRing repository.

## Issues and Support

For issues or features, refer to the main TokenRing project repository.