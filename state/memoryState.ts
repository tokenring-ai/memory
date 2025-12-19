import {Agent} from "@tokenring-ai/agent";
import type {ResetWhat} from "@tokenring-ai/agent/AgentEvents";
import type {AgentStateSlice} from "@tokenring-ai/agent/types";

export class MemoryState implements AgentStateSlice {
  name = "MemoryState";
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
    this.deserialize(parent.getState(MemoryState).serialize());
  }


  serialize(): object {
    return {
      memories: this.memories,
    };
  }

  deserialize(data: any): void {
    this.memories = data.memories ? [...data.memories] : [];
  }

  show(): string[] {
    return [
      `Memories: ${this.memories.length}`,
      ...this.memories.map((m, i) => `  [${i + 1}] ${m}`)
    ];
  }
}
