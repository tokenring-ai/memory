import {AgentStateSlice} from "@tokenring-ai/agent/Agent";
import {ResetWhat} from "@tokenring-ai/agent/AgentEvents";

export class MemoryState implements AgentStateSlice {
  name = "MemoryState";
  memories: string[] = [];
  persistToSubAgents = true;

  constructor({memories = []}: { memories?: string[] } = {}) {
    this.memories = [...memories];
  }

  reset(what: ResetWhat[]): void {
    if (what.includes('chat')) {
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
}