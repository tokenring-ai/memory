import type { Agent } from "@tokenring-ai/agent";
import { AgentStateSlice } from "@tokenring-ai/agent/types";
import deepClone from "@tokenring-ai/utility/object/deepClone";
import markdownList from "@tokenring-ai/utility/string/markdownList";
import { z } from "zod";

const serializationSchema = z.object({
  memories: z.array(z.string()),
});

export class MemoryState extends AgentStateSlice<typeof serializationSchema> {
  memories: string[] = [];

  constructor({ memories = [] }: { memories?: string[] } = {}) {
    super("MemoryState", serializationSchema);
    this.memories = deepClone(memories);
  }

  reset(): void {
    this.memories = [];
  }

  transferStateFromParent(parent: Agent): void {
    const parentState = parent.getState(MemoryState);
    this.memories = [...parentState.memories];
  }

  serialize(): z.output<typeof serializationSchema> {
    return {
      memories: this.memories,
    };
  }

  deserialize(data: z.output<typeof serializationSchema>): void {
    this.memories = data.memories ? [...data.memories] : [];
  }

  show(): string {
    return `Memories: ${this.memories.length}
${markdownList(this.memories.map((m, i) => `[${i + 1}] ${m}`))}`;
  }
}
