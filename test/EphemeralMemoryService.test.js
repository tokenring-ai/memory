import { beforeEach, describe, expect, it } from "vitest";
import EphemeralMemoryService from "../EphemeralMemoryService.ts";

describe("EphemeralMemoryService", () => {
	let memoryService;

	beforeEach(() => {
		// Create a fresh instance for each test
		memoryService = new EphemeralMemoryService();
	});

	// Test 1: Initialize with empty memories
	it("should initialize with empty memories and attention items", () => {
		expect(memoryService.memories).toEqual([]);
		expect(memoryService.attentionItems).toEqual({});
	});

	// Test 2: Add and retrieve memories
	it("should add and retrieve memories correctly", async () => {
		const memory1 = "Memory 1";
		const memory2 = "Memory 2";

		memoryService.addMemory(memory1);
		memoryService.addMemory(memory2);

		expect(memoryService.memories).toHaveLength(2);
		expect(memoryService.memories[0]).toBe(memory1);
		expect(memoryService.memories[1]).toBe(memory2);

		// Test the generator function
		const memories = [];
		for await (const memory of memoryService.getMemories()) {
			memories.push(memory);
		}

		expect(memories).toHaveLength(2);
		expect(memories[0]).toStrictEqual({ role: "user", content: memory1 });
		expect(memories[1]).toStrictEqual({ role: "user", content: memory2 });
	});

	// Test 3: Clear all memories
	it("should clear all memories", () => {
		// Add some memories first
		memoryService.addMemory({ text: "Memory 1" });
		memoryService.addMemory({ text: "Memory 2" });

		expect(memoryService.memories).toHaveLength(2);

		// Clear memories
		memoryService.clearMemory();

		expect(memoryService.memories).toEqual([]);
	});

	// Test 4: Splice memories correctly
	it("should splice memories correctly", () => {
		// Add some memories first
		const memory1 = { text: "Memory 1" };
		const memory2 = { text: "Memory 2" };
		const memory3 = { text: "Memory 3" };

		memoryService.addMemory(memory1);
		memoryService.addMemory(memory2);
		memoryService.addMemory(memory3);

		expect(memoryService.memories).toHaveLength(3);

		// Replace memory2 with a new memory
		const newMemory = { text: "New Memory" };
		memoryService.spliceMemory(1, 1, newMemory);

		expect(memoryService.memories).toHaveLength(3);
		expect(memoryService.memories[0]).toBe(memory1);
		expect(memoryService.memories[1]).toBe(newMemory);
		expect(memoryService.memories[2]).toBe(memory3);

		// Remove the last memory
		memoryService.spliceMemory(2, 1);

		expect(memoryService.memories).toHaveLength(2);
		expect(memoryService.memories[0]).toBe(memory1);
		expect(memoryService.memories[1]).toBe(newMemory);

		// Insert a memory between existing ones
		const insertedMemory = { text: "Inserted Memory" };
		memoryService.spliceMemory(1, 0, insertedMemory);

		expect(memoryService.memories).toHaveLength(3);
		expect(memoryService.memories[0]).toBe(memory1);
		expect(memoryService.memories[1]).toBe(insertedMemory);
		expect(memoryService.memories[2]).toBe(newMemory);
	});

	// Test 5: Add and retrieve attention items
	it("should add and retrieve attention items correctly", async () => {
		// Test push method
		memoryService.pushAttentionItem("important", "Important item 1");
		memoryService.pushAttentionItem("important", "Important item 2");
		memoryService.pushAttentionItem("note", "Note item");

		expect(memoryService.attentionItems).toHaveProperty("important");
		expect(memoryService.attentionItems).toHaveProperty("note");
		expect(memoryService.attentionItems.important).toHaveLength(2);
		expect(memoryService.attentionItems.note).toHaveLength(1);

		// Test unshift method
		memoryService.unshiftAttentionItem("important", "First important item");

		expect(memoryService.attentionItems.important).toHaveLength(3);
		expect(memoryService.attentionItems.important[0]).toBe(
			"First important item",
		);

		// Test the generator function
		const messages = [];
		for await (const message of memoryService.getAttentionItems()) {
			messages.push(message);
		}

		expect(messages).toHaveLength(1); // One formatted message with all items
		expect(messages[0].role).toBe("user");
		expect(messages[0].content).toContain("important");
		expect(messages[0].content).toContain("- First important item");
		expect(messages[0].content).toContain("- Important item 1");
		expect(messages[0].content).toContain("- Important item 2");
		expect(messages[0].content).toContain("note");
		expect(messages[0].content).toContain("- Note item");
	});

	// Test 6: Clear specific attention items
	it("should clear specific attention items", () => {
		// Add some attention items first
		memoryService.pushAttentionItem("important", "Important item 1");
		memoryService.pushAttentionItem("important", "Important item 2");
		memoryService.pushAttentionItem("note", "Note item");

		expect(memoryService.attentionItems).toHaveProperty("important");
		expect(memoryService.attentionItems).toHaveProperty("note");

		// Clear only important items
		memoryService.clearAttentionItems("important");

		expect(memoryService.attentionItems).not.toHaveProperty("important");
		expect(memoryService.attentionItems).toHaveProperty("note");
		expect(memoryService.attentionItems.note).toHaveLength(1);
	});

	// Test 7: Splice attention items correctly
	it("should splice attention items correctly", () => {
		// Add some attention items first
		memoryService.pushAttentionItem("important", "Item 1");
		memoryService.pushAttentionItem("important", "Item 2");
		memoryService.pushAttentionItem("important", "Item 3");

		expect(memoryService.attentionItems.important).toHaveLength(3);

		// Replace the second item
		memoryService.spliceAttentionItems("important", 1, 1, "New Item");

		expect(memoryService.attentionItems.important).toHaveLength(3);
		expect(memoryService.attentionItems.important[0]).toBe("Item 1");
		expect(memoryService.attentionItems.important[1]).toBe("New Item");
		expect(memoryService.attentionItems.important[2]).toBe("Item 3");

		// Remove the last item
		memoryService.spliceAttentionItems("important", 2, 1);

		expect(memoryService.attentionItems.important).toHaveLength(2);
		expect(memoryService.attentionItems.important[0]).toBe("Item 1");
		expect(memoryService.attentionItems.important[1]).toBe("New Item");

		// Insert an item
		memoryService.spliceAttentionItems("important", 1, 0, "Inserted Item");

		expect(memoryService.attentionItems.important).toHaveLength(3);
		expect(memoryService.attentionItems.important[0]).toBe("Item 1");
		expect(memoryService.attentionItems.important[1]).toBe("Inserted Item");
		expect(memoryService.attentionItems.important[2]).toBe("New Item");

		// Test with non-existent type (should create the array)
		memoryService.spliceAttentionItems("newType", 0, 0, "First new type item");

		expect(memoryService.attentionItems).toHaveProperty("newType");
		expect(memoryService.attentionItems.newType).toHaveLength(1);
		expect(memoryService.attentionItems.newType[0]).toBe("First new type item");
	});

	// Test 8: Format attention items output
	it("should format attention items output correctly", async () => {
		// Empty attention items should yield no messages
		let messages = [];
		for await (const message of memoryService.getAttentionItems()) {
			messages.push(message);
		}
		expect(messages).toHaveLength(0);

		// Add some attention items
		memoryService.pushAttentionItem("important", "Important item 1");
		memoryService.pushAttentionItem("important", "Important item 2");
		memoryService.pushAttentionItem("note", "Note item");

		// Get formatted messages
		messages = [];
		for await (const message of memoryService.getAttentionItems()) {
			messages.push(message);
		}

		expect(messages).toHaveLength(1);
		expect(messages[0]).toEqual({
			role: "user",
			content:
				"important\n- Important item 1\n- Important item 2\nnote\n- Note item",
		});

		// Clear all attention items
		memoryService.clearAttentionItems("important");
		memoryService.clearAttentionItems("note");

		// Should yield no messages again
		messages = [];
		for await (const message of memoryService.getAttentionItems()) {
			messages.push(message);
		}
		expect(messages).toHaveLength(0);
	});
});
