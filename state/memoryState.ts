import {Agent} from "@tokenring-ai/agent";
import type {ResetWhat} from "@tokenring-ai/agent/AgentEvents";
import type {AgentStateSlice} from "@tokenring-ai/agent/types";
import {z} from "zod";

const serializationSchema = z.object({
  memories: z.array(z.string())
});

export class MemoryState implements AgentStateSlice<typeof serializationSchema> {
  name = "MemoryState";
  serializationSchema = serializationSchema;
  memories: string[] = [];

  constructor({memories = []}: { memories?: string[] } = {}) {
    this.memories = [...memories];
  }

  reset(what: ResetWhat[]): void {
    if (what.includes("chat") || what.includes("memory")) {
      this.memories = [];
    }
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
