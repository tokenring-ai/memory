import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingService} from "@tokenring-ai/app/types";
import {MemoryState} from "./state/memoryState.ts";

export default class ShortTermMemoryService implements TokenRingService {
  name = "ShortTermMemoryService";
  description = "Provides Short Term Memory functionality";

  async attach(agent: Agent): Promise<void> {
    agent.initializeState(MemoryState, {});
  }

  addMemory(memory: string, agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      state.memories.push(memory);
    });
  }

  clearMemory(agent: Agent): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      state.memories = [];
    });
  }

  spliceMemory(
    index: number,
    count: number,
    agent: Agent,
    ...items: string[]
  ): void {
    agent.mutateState(MemoryState, (state: MemoryState) => {
      state.memories.splice(index, count, ...items);
    });
  }
}
