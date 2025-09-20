import Agent from "@tokenring-ai/agent/Agent";
import {AttentionItemMessage, MemoryItemMessage, TokenRingService} from "@tokenring-ai/agent/types";
import {MemoryState} from "./state/memoryState.ts";

export default class ShortTermMemoryService implements TokenRingService {
  name = "ShortTermMemoryService";
  description = "Provides Short Term Memory functionality";

  async attach(agent: Agent): Promise<void> {
    agent.initializeState(MemoryState, {});
  }

  addMemory(memory: string, agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      state.memories.push(memory);
    });
  }

  clearMemory(agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      state.memories = [];
    });
  }

  spliceMemory(index: number, count: number, agent: Agent, ...items: string[]): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      state.memories.splice(index, count, ...items);
    });
  }

  pushAttentionItem(type: string, item: string, agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      (state.attentionItems[type] ??= []).push(item);
    });
  }

  unshiftAttentionItem(type: string, item: string, agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      (state.attentionItems[type] ??= []).unshift(item);
    });
  }

  clearAttentionItems(type: string, agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      delete state.attentionItems[type];
    });
  }

  spliceAttentionItems(type: string, index: number, count: number, agent: Agent, ...items: string[]): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      (state.attentionItems[type] ??= []).splice(index, count, ...items);
    });
  }

  /**
   * Asynchronously yields memories
   */
  async* getMemories(agent: Agent): AsyncGenerator<MemoryItemMessage> {
    const state = agent.getState(MemoryState);
    for (const memory of state.memories ?? []) {
      yield {
        role: "user",
        content: memory
      };
    }
  }

  /**
   * Asynchronously yields attention items
   */
  async* getAttentionItems(agent: Agent): AsyncGenerator<AttentionItemMessage> {
    const state = agent.getState(MemoryState);
    const message: string[] = [];
    for (const type in state.attentionItems) {
      const items = state.attentionItems[type];
      if (items.length > 0) {
        message.push(`${type}`);
        for (const item of items) {
          message.push(`- ${item}`);
        }
      }
    }

    if (message.length > 0) {
      yield {role: "user", content: message.join("\n")};
    }
  }
}
