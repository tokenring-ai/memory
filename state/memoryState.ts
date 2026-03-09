import {Agent} from "@tokenring-ai/agent";
import {AgentStateSlice} from "@tokenring-ai/agent/types";
import {z} from "zod";

const serializationSchema = z.object({
  memories: z.array(z.string())
});

export class MemoryState extends AgentStateSlice<typeof serializationSchema> {
  memories: string[] = [];

  constructor({memories = []}: { memories?: string[] } = {}) {
    super("MemoryState", serializationSchema);
    this.memories = [...memories];
  }

  reset(): void {
          this.memories = [];
  }

  transferStateFromParent(parent: Agent): void {
    const parentState = parent.getState(MemoryState);
    this.deserialize(parentState.serialize());
  }


  serialize(): z.output<typeof serializationSchema> {
    return {
      memories: this.memories,
    };
  }

  deserialize(data: z.output<typeof serializationSchema>): void {
    this.memories = data.memories ? [...data.memories] : [];
  }

  show(): string[] {
    return [
      `Memories: ${this.memories.length}`,
      ...this.memories.map((m, i) => `  [${i + 1}] ${m}`)
    ];
  }
}
