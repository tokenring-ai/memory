import Agent from "@tokenring-ai/agent/Agent";
import ShortTermMemoryService from "../../ShortTermMemoryService.ts";
import {MemoryState} from "../../state/memoryState.ts";

export default async function _listMemories(memoryService: ShortTermMemoryService, agent: Agent): Promise<string> {
  let index = 0;
  const lines: string[] = [];

  for await (const memory of agent.getState(MemoryState).memories) {
    if (index === 0) lines.push("Memory items:");
    const memoryLines = memory.split("\n");
    lines.push(`[${index}] ${memoryLines[0]}`);
    for (let i = 1; i < memoryLines.length; i++) {
      lines.push(`[${index}]  ${memoryLines[i]}`);
    }
    index++;
  }

  if (index === 0) lines.push("No memory items stored");
  return lines.join("\n");
}
