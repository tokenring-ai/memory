import {ContextHandler} from "@tokenring-ai/chat/schema";
import shortTermMemory from "./contextHandlers/shortTermMemory.ts";

export default {
  'short-term-memory': shortTermMemory,
} as Record<string, ContextHandler>;
