import type Agent from "@tokenring-ai/agent/Agent";
import {beforeEach, describe, expect, it} from "vitest";
import ShortTermMemoryService from "../ShortTermMemoryService.ts";

describe("MemoryService", () => {
  let memoryService: ShortTermMemoryService;
  const agent = {} as Agent;

  beforeEach(() => {
    // Create a fresh instance for each test
    memoryService = new ShortTermMemoryService();
  });

  // Test 1: Initialize with empty memories
  it("should initialize with empty memories and attention items", () => {
    expect((memoryService as any).memories).toEqual([]);
    expect((memoryService as any).attentionItems).toEqual({});
  });

  // Test 2: Add and retrieve memories
  it("should add and retrieve memories correctly", async () => {
    const memory1 = "Memory 1";
    const memory2 = "Memory 2";

    (memoryService as any).addMemory(memory1, agent);
    (memoryService as any).addMemory(memory2, agent);

    expect((memoryService as any).memories).toHaveLength(2);
    expect((memoryService as any).memories[0]).toBe(memory1);
    expect((memoryService as any).memories[1]).toBe(memory2);

    // Test the generator function
    const memories: { role: string; content: string }[] = [];
    for await (const memory of (memoryService as any).getContextItems(agent)) {
      memories.push(memory);
    }

    expect(memories).toHaveLength(2);
    expect(memories[0]).toStrictEqual({role: "user", content: memory1});
    expect(memories[1]).toStrictEqual({role: "user", content: memory2});
  });

  // Test 3: Clear all memories
  it("should clear all memories", () => {
    // Add some memories first
    (memoryService as any).addMemory("Memory 1", agent);
    (memoryService as any).addMemory("Memory 2", agent);

    expect((memoryService as any).memories).toHaveLength(2);

    // Clear memories
    (memoryService as any).clearMemory(agent);

    expect((memoryService as any).memories).toEqual([]);
  });

  // Test 4: Splice memories correctly
  it("should splice memories correctly", () => {
    // Add some memories first
    const memory1 = "Memory 1";
    const memory2 = "Memory 2";
    const memory3 = "Memory 3";

    (memoryService as any).addMemory(memory1, agent);
    (memoryService as any).addMemory(memory2, agent);
    (memoryService as any).addMemory(memory3, agent);

    expect((memoryService as any).memories).toHaveLength(3);

    // Replace memory2 with a new memory
    const newMemory = "New Memory";
    (memoryService as any).spliceMemory(agent, 1, 1, newMemory);

    expect((memoryService as any).memories).toHaveLength(3);
    expect((memoryService as any).memories[0]).toBe(memory1);
    expect((memoryService as any).memories[1]).toBe(newMemory);
    expect((memoryService as any).memories[2]).toBe(memory3);

    // Remove the last memory
    (memoryService as any).spliceMemory(agent, 2, 1);

    expect((memoryService as any).memories).toHaveLength(2);
    expect((memoryService as any).memories[0]).toBe(memory1);
    expect((memoryService as any).memories[1]).toBe(newMemory);

    // Insert a memory between existing ones
    const insertedMemory = "Inserted Memory";
    (memoryService as any).spliceMemory(agent, 1, 0, insertedMemory);

    expect((memoryService as any).memories).toHaveLength(3);
    expect((memoryService as any).memories[0]).toBe(memory1);
    expect((memoryService as any).memories[1]).toBe(insertedMemory);
    expect((memoryService as any).memories[2]).toBe(newMemory);
  });

  // Test 5: Add and retrieve attention items
  it("should add and retrieve attention items correctly", async () => {
    // Test push method
    (memoryService as any).pushAttentionItem("important", "Important item 1");
    (memoryService as any).pushAttentionItem("important", "Important item 2");
    (memoryService as any).pushAttentionItem("note", "Note item");

    expect((memoryService as any).attentionItems).toHaveProperty("important");
    expect((memoryService as any).attentionItems).toHaveProperty("note");
    expect((memoryService as any).attentionItems.important).toHaveLength(2);
    expect((memoryService as any).attentionItems.note).toHaveLength(1);

    // Test unshift method
    (memoryService as any).unshiftAttentionItem(
      "important",
      "First important item",
    );

    expect((memoryService as any).attentionItems.important).toHaveLength(3);
    expect((memoryService as any).attentionItems.important[0]).toBe(
      "First important item",
    );

    // Test the generator function
    const messages: { role: string; content: string }[] = [];
    for await (const message of (memoryService as any).getAttentionItems(
      agent,
    )) {
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
    (memoryService as any).pushAttentionItem("important", "Important item 1");
    (memoryService as any).pushAttentionItem("important", "Important item 2");
    (memoryService as any).pushAttentionItem("note", "Note item");

    expect((memoryService as any).attentionItems).toHaveProperty("important");
    expect((memoryService as any).attentionItems).toHaveProperty("note");

    // Clear only important items
    (memoryService as any).clearAttentionItems("important");

    expect((memoryService as any).attentionItems).not.toHaveProperty(
      "important",
    );
    expect((memoryService as any).attentionItems).toHaveProperty("note");
    expect((memoryService as any).attentionItems.note).toHaveLength(1);
  });

  // Test 7: Splice attention items correctly
  it("should splice attention items correctly", () => {
    // Add some attention items first
    (memoryService as any).pushAttentionItem("important", "Item 1");
    (memoryService as any).pushAttentionItem("important", "Item 2");
    (memoryService as any).pushAttentionItem("important", "Item 3");

    expect((memoryService as any).attentionItems.important).toHaveLength(3);

    // Replace the second item
    (memoryService as any).spliceAttentionItems("important", 1, 1, "New Item");

    expect((memoryService as any).attentionItems.important).toHaveLength(3);
    expect((memoryService as any).attentionItems.important[0]).toBe("Item 1");
    expect((memoryService as any).attentionItems.important[1]).toBe("New Item");
    expect((memoryService as any).attentionItems.important[2]).toBe("Item 3");

    // Remove the last item
    (memoryService as any).spliceAttentionItems("important", 2, 1);

    expect((memoryService as any).attentionItems.important).toHaveLength(2);
    expect((memoryService as any).attentionItems.important[0]).toBe("Item 1");
    expect((memoryService as any).attentionItems.important[1]).toBe("New Item");

    // Insert an item
    (memoryService as any).spliceAttentionItems(
      "important",
      1,
      0,
      "Inserted Item",
    );

    expect((memoryService as any).attentionItems.important).toHaveLength(3);
    expect((memoryService as any).attentionItems.important[0]).toBe("Item 1");
    expect((memoryService as any).attentionItems.important[1]).toBe(
      "Inserted Item",
    );
    expect((memoryService as any).attentionItems.important[2]).toBe("New Item");

    // Test with non-existent type (should create the array)
    (memoryService as any).spliceAttentionItems(
      "newType",
      0,
      0,
      "First new type item",
    );

    expect((memoryService as any).attentionItems).toHaveProperty("newType");
    expect((memoryService as any).attentionItems.newType).toHaveLength(1);
    expect((memoryService as any).attentionItems.newType[0]).toBe(
      "First new type item",
    );
  });

  // Test 8: Format attention items output
  it("should format attention items output correctly", async () => {
    // Empty attention items should yield no messages
    let messages: { role: string; content: string }[] = [];
    for await (const message of (memoryService as any).getAttentionItems(
      agent,
    )) {
      messages.push(message);
    }
    expect(messages).toHaveLength(0);

    // Add some attention items
    (memoryService as any).pushAttentionItem("important", "Important item 1");
    (memoryService as any).pushAttentionItem("important", "Important item 2");
    (memoryService as any).pushAttentionItem("note", "Note item");

    // Get formatted messages
    messages = [];
    for await (const message of (memoryService as any).getAttentionItems(
      agent,
    )) {
      messages.push(message);
    }

    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({
      role: "user",
      content:
        "important\n- Important item 1\n- Important item 2\nnote\n- Note item",
    });

    // Clear all attention items
    (memoryService as any).clearAttentionItems("important");
    (memoryService as any).clearAttentionItems("note");

    // Should yield no messages again
    messages = [];
    for await (const message of (memoryService as any).getAttentionItems(
      agent,
    )) {
      messages.push(message);
    }
    expect(messages).toHaveLength(0);
  });
});
