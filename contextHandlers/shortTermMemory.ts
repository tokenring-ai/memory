import Agent from "@tokenring-ai/agent/Agent";
import {ChatConfig, ContextItem} from "@tokenring-ai/chat/schema";
import {MemoryState} from "../state/memoryState.ts";

/**
 * Asynchronously yields memories
 */
export default async function * getContextItems(input: string, chatConfig: ChatConfig, params: {}, agent: Agent): AsyncGenerator<ContextItem> {
  const state = agent.getState(MemoryState);
  for (const memory of state.memories ?? []) {
    yield {
      role: "user",
      content: memory,
    };
  }
}