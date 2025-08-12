import {Registry, Service} from "@token-ring/registry";
import {AttentionItemMessage, MemoryItemMessage} from "@token-ring/registry/Service";


/**
 * Abstract base class for memory-related services.
 * Provides a foundation for managing memory and attention items.
 * Subclasses must implement the abstract methods.
 */
export default class MemoryService extends Service {
    name = "MemoryService";
    description = "Provides Memory functionality";

    /** Adds a memory item to the service. */
    addMemory(_memory: string): void {
        throw new Error(
            `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
        );
    }

    /** Pushes an item to the attention list. */
    pushAttentionItem(_type: string, _item: string): void {
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
    spliceMemory(_index: number, _count?: number, ..._items: string[]): void {
        throw new Error(
            `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
        );
    }

    /** Modifies the attention list by removing or replacing items. */
    spliceAttentionItems(
        _type: string,
        _index: number,
        _count?: number,
        ..._items: string[]
    ): void {
        throw new Error(
            `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
        );
    }

    // Async generators to be optionally implemented by subclasses
    async *getMemories(_registry: Registry): AsyncGenerator<MemoryItemMessage> {
        throw new Error(
            `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
        );
    }

    async *getAttentionItems(_registry: Registry): AsyncGenerator<AttentionItemMessage> {
        throw new Error(
            `The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
        );
    }
}