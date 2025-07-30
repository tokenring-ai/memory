import { Service } from "@token-ring/registry";

/**
 * Abstract base class for memory-related services.
 * Provides a foundation for managing memory and attention items.
 * Subclasses must implement the abstract methods.
 * @class
 */
export default class MemoryService extends Service {
	/** @type {string} The name of the service. */
	name = "MemoryService";
	/** @type {string} A description of the service. */
	description = "Provides Memory functionality";

	/**
	 * Adds a memory item to the service.
	 * @abstract
	 * @param {any} memory - The memory item to add.
	 * @throws {Error} When called on the abstract base class.
	 */
	addMemory(_memory) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Pushes an item to the attention list.
	 * @abstract
	 * @param {any} item - The item to add to the attention list.
	 * @throws {Error} When called on the abstract base class.
	 */
	pushAttentionItem(_item) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Clears all memory items.
	 * @abstract
	 * @throws {Error} When called on the abstract base class.
	 */
	clearMemory() {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Clears all attention items.
	 * @abstract
	 * @throws {Error} When called on the abstract base class.
	 */
	clearAttentionItems() {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Modifies the memory list by removing or replacing items.
	 * @abstract
	 * @param {number} index - The index at which to start changing the memory list.
	 * @param {number} count - The number of items to remove.
	 * @param {...any} items - The items to add to the memory list.
	 * @throws {Error} When called on the abstract base class.
	 */
	spliceMemory(_index, _count, ..._items) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Modifies the attention list by removing or replacing items.
	 * @abstract
	 * @param {number} index - The index at which to start changing the attention list.
	 * @param {number} count - The number of items to remove.
	 * @param {...any} items - The items to add to the attention list.
	 * @throws {Error} When called on the abstract base class.
	 */
	spliceAttentionItems(_index, _count, ..._items) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}
}
