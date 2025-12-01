import {ContextHandler} from "@tokenring-ai/chat/types";
import shortTermMemory from "./contextHandlers/shortTermMemory.ts";

export default {
  'short-term-memory': shortTermMemory,
} as Record<string, ContextHandler>;
