import { Service } from "@token-ring/registry";

/**
 * Abstract base class for memory-related services.
 * Provides a foundation for managing memory and attention items.
 * Subclasses must implement the abstract methods.
 */
export default class MemoryService extends Service {
  name = "MemoryService";
  description = "Provides Memory functionality";

  /** Adds a memory item to the service. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addMemory(_memory: any): void {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /** Pushes an item to the attention list. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pushAttentionItem(_type: string, _item: any): void {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /** Clears all memory items. */
  clearMemory(): void {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /** Clears all attention items. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearAttentionItems(_type?: string): void {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /** Modifies the memory list by removing or replacing items. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spliceMemory(_index: number, _count?: number, ..._items: any[]): void {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /** Modifies the attention list by removing or replacing items. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spliceAttentionItems(
    _type: string,
    _index: number,
    _count?: number,
    ..._items: any[]
  ): void {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  // Async generators to be optionally implemented by subclasses
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async *getMemories(_registry?: any): AsyncGenerator<any> {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async *getAttentionItems(_registry?: any): AsyncGenerator<any> {
    throw new Error(
      `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }
}
