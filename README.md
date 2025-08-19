# @token-ring/memory

Memory and attention management for Token Ring. This package provides a Service interface and a simple in-memory
implementation to:

- Store short-lived “memories” that can be surfaced back to the assistant in future turns.
- Track lightweight “attention” items (e.g., goals or focus) grouped by type and rendered as succinct user messages.
- Expose chat commands and agent tools so users and agents can manage these lists during a session.

Current status: Includes an abstract base class (MemoryService), an in-memory implementation (EphemeralMemoryService),
chat commands (/memory, /attention), and tools (add-memory, add-focus, add-goal).

## Installation

This package is part of the Token Ring monorepo and is referenced as:

- Name: `@token-ring/memory`
- Version: `0.1.0`

It relies on these peer packages being present/registered in your app:

- `@token-ring/registry`
- `@token-ring/chat`

## What it does

- Provides a MemoryService interface for storing and retrieving messages that should influence future responses.
- Separately tracks “attention” items by type (e.g., Focus…, Goals…), yielding them as a compact, readable message.
- Ships with an EphemeralMemoryService that keeps everything in process memory (lost on restart), suitable for local/dev
  sessions.
- Integrates with ChatService to report actions and list items.
- Exposes tools and chat commands so both agents and users can manage memory/attention quickly.

## Exports

From `@token-ring/memory`:

- `MemoryService` (abstract base class)
- `EphemeralMemoryService` (concrete implementation)
- `chatCommands` namespace
- `chatCommands.memory` → `/memory` command
- `chatCommands.attention` → `/attention` command
- `tools` namespace
- `tools.addMemory`
- `tools.addFocus`
- `tools.addGoal`

## Core classes

### MemoryService (abstract)

Defines the contract for memory/attention providers.

Key methods to implement/override in subclasses:

- addMemory(memory: string): void
- clearMemory(): void
- spliceMemory(index: number, count?: number, ...items: string[]): void
- pushAttentionItem(type: string, item: string): void
- clearAttentionItems(type?: string): void
- spliceAttentionItems(type: string, index: number, count?: number, ...items: string[]): void

Async generators (consumed by other services to surface context back to the LLM):

- async *getMemories(registry): yields MemoryItemMessage
- async *getAttentionItems(registry): yields AttentionItemMessage

### EphemeralMemoryService

A minimal in-memory implementation backed by arrays and simple string formatting.

- Stores `memories: string[]`.
- Stores `attentionItems: Record<string, string[]>` keyed by type.
- Yields memories one by one as `{ role: "user", content: <memory> }`.
- Yields attention as a single compact message, grouping items by type:
- Example content:
- `Focus on these items`\n`- Item A`\n`- Item B`\n`These are the goals that have been set`\n`- Goal 1`

Limitations:

- Ephemeral: contents are not persisted and will be lost when the process stops.

## Chat commands

These are exported via `chatCommands` and integrate with ChatService.

### /memory

Manage general memory items.

- `/memory` → shows help
- `/memory list` → list all memory items
- `/memory add <text>` → add a new memory item
- `/memory clear` → clear all memory items
- `/memory remove <index>` → remove a memory item at index
- `/memory set <index> <text>` → update a memory item

### /attention

Manage attention items by type (e.g., Focus, Goals).

- `/attention` → shows help
- `/attention list` → list all attention items by type
- `/attention add <type> <text>` → add an item under a type
- `/attention clear [type]` → clear all items, or only a specific type
- `/attention remove <type> <index>` → remove an item in a type at index
- `/attention set <type> <index> <text>` → update an item in a type

## Tools

Designed for agent use, but callable directly as functions too.

- tools.addMemory
- Description: Add a general memory string that will be presented in future chats.
- Signature: `execute({ memory }, registry)`
- Parameters: `{ memory: string }`

- tools.addFocus
- Description: Push an item into a short “Focus on these items” attention list.
- Signature: `execute({ item }, registry)`
- Parameters: `{ item: string }`
- Behavior: keeps only the latest N items (currently trims to last 10 via splice semantics).

- tools.addGoal
- Description: Add a goal to the “These are the goals that have been set” attention list.
- Signature: `execute({ item }, registry)`
- Parameters: `{ item: string }`
- Behavior: trims to a recent window (currently last 20).

## Basic usage

Register a memory service (typically the ephemeral one) into your Registry alongside ChatService.

```ts
import {ServiceRegistry} from "@token-ring/registry";
import {ChatService} from "@token-ring/chat";
import {EphemeralMemoryService} from "@token-ring/memory";

const registry = new ServiceRegistry();
await registry.start();

await registry.services.addServices(
  new ChatService({personas: {/*...*/}}),
  new EphemeralMemoryService(),
);

// Now tools/commands that require MemoryService will work:
// - chatCommands.memory
// - chatCommands.attention
// - tools.addMemory / addFocus / addGoal
```

Consuming services can iterate the async generators to surface context back to the model:

```ts
for await (const msg of memoryService.getMemories(registry)) {
  // msg: { role: "user", content: string }
}
for await (const msg of memoryService.getAttentionItems(registry)) {
  // msg content is a concise, grouped list by type
}
```

## Notes and limitations

- EphemeralMemoryService stores everything in memory and is suitable for short-lived sessions.
- If you need persistence or advanced policies (e.g., aging, scoring, multi-session recall), implement your own
  MemoryService subclass and register it instead of EphemeralMemoryService.

## License

MIT
