import MemoryService from "./MemoryService.ts";

export default class EphemeralMemoryService extends MemoryService {
  name = "EphemeralMemoryService";
  description = "Provides EphemeralMemory functionality";

  memories: any[] = [];
  attentionItems: Record<string, any[]> = {};

  addMemory(memory: any): void {
    this.memories.push(memory);
  }
  clearMemory(): void {
    this.memories = [];
  }
  spliceMemory(index: number, count?: number, ...items: any[]): void {
    // @ts-ignore - allow undefined count to forward to Array.splice semantics
    this.memories.splice(index, count as any, ...items);
  }

  pushAttentionItem(type: string, item: any): void {
    (this.attentionItems[type] ??= []).push(item);
  }

  unshiftAttentionItem(type: string, item: any): void {
    (this.attentionItems[type] ??= []).unshift(item);
  }

  clearAttentionItems(type: string): void {
    delete this.attentionItems[type];
  }

  spliceAttentionItems(type: string, index: number, count?: number, ...items: any[]): void {
    // @ts-ignore - allow undefined count to forward to Array.splice semantics
    (this.attentionItems[type] ??= []).splice(index, count as any, ...items);
  }

  /**
   * Asynchronously yields memories
   */
  async *getMemories(_registry?: any): AsyncGenerator<any> {
    for (const memory of this.memories ?? []) {
      yield memory;
    }
  }

  /**
   * Asynchronously yields attention items
   */
  async *getAttentionItems(_registry?: any): AsyncGenerator<{ role: string; content: string }> {
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
