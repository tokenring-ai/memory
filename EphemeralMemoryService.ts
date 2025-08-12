import MemoryService from "./MemoryService.ts";
import {Registry} from "@token-ring/registry";
import {AttentionItemMessage, MemoryItemMessage} from "@token-ring/registry/Service";

export default class EphemeralMemoryService extends MemoryService {
  name = "EphemeralMemoryService";
  description = "Provides EphemeralMemory functionality";

  memories: string[] = [];
  attentionItems: Record<string, string[]> = {};

  addMemory(memory: string): void {
    this.memories.push(memory);
  }
  clearMemory(): void {
    this.memories = [];
  }
  spliceMemory(index: number, count: number, ...items: string[]): void {
    this.memories.splice(index, count, ...items);
  }

  pushAttentionItem(type: string, item: string): void {
    (this.attentionItems[type] ??= []).push(item);
  }

  unshiftAttentionItem(type: string, item: string): void {
    (this.attentionItems[type] ??= []).unshift(item);
  }

  clearAttentionItems(type: string): void {
    delete this.attentionItems[type];
  }

  spliceAttentionItems(type: string, index: number, count: number, ...items: string[]): void {
    // @ts-ignore - allow undefined count to forward to Array.splice semantics
    (this.attentionItems[type] ??= []).splice(index, count, ...items);
  }

  /**
   * Asynchronously yields memories
   */
  async *getMemories(_registry: Registry): AsyncGenerator<MemoryItemMessage> {
    for (const memory of this.memories ?? []) {
      yield {
          role: "user",
          content: memory
      };
    }
  }

  /**
   * Asynchronously yields attention items
   */
  async *getAttentionItems(_registry: Registry): AsyncGenerator<AttentionItemMessage> {
    const message: string[] = [];
    for (const type in this.attentionItems) {
      const items = this.attentionItems[type];
      if (items.length > 0) {
        message.push(`${type}`);
        for (const item of items) {
          message.push(`- ${item}`);
        }
      }
    }

    if (message.length > 0) {
      yield { role: "user", content: message.join("\n") };
    }
  }
}
