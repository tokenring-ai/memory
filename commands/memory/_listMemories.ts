import type Agent from "@tokenring-ai/agent/Agent";
import {MemoryState} from "../../state/memoryState.ts";

export default function _listMemories(
  agent: Agent,
) {
  let index = 0;
  const lines: string[] = [];

  for (const memory of agent.getState(MemoryState).memories) {
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
