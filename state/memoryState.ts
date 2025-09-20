import {AgentStateSlice} from "@tokenring-ai/agent/Agent";
import {ResetWhat} from "@tokenring-ai/agent/AgentEvents";

export class MemoryState implements AgentStateSlice {
  name = "MemoryState";
  memories: string[] = [];
  attentionItems: Record<string, string[]> = {};

  constructor({memories = [], attentionItems = {}}: {memories?: string[], attentionItems?: Record<string, string[]>} = {}) {
    this.memories = [...memories];
    this.attentionItems = {...attentionItems};
  }

  reset(what: ResetWhat[]): void {
    if (what.includes('chat')) {
      this.memories = [];
      this.attentionItems = {};
    }
  }

  serialize(): object {
    return {
      memories: this.memories,
      attentionItems: this.attentionItems,
    };
  }

  deserialize(data: any): void {
    this.memories = data.memories ? [...data.memories] : [];
    this.attentionItems = data.attentionItems ? {...data.attentionItems} : {};
  }
}