import type {ResetWhat} from "@tokenring-ai/agent/AgentEvents";
import type {AgentStateSlice} from "@tokenring-ai/agent/types";

export class MemoryState implements AgentStateSlice {
  name = "MemoryState";
  memories: string[] = [];
  persistToSubAgents = true;

  constructor({memories = []}: { memories?: string[] } = {}) {
    this.memories = [...memories];
  }

  reset(what: ResetWhat[]): void {
    if (what.includes("chat") || what.includes("memory")) {
      this.memories = [];
    }
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
