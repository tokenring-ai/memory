import {AgentCommandService} from "@tokenring-ai/agent";
import type {TokenRingPlugin} from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {ScriptingService} from "@tokenring-ai/scripting";
import type {ScriptingThis} from "@tokenring-ai/scripting/ScriptingService";
import {z} from "zod";

import agentCommands from "./commands.ts";
import contextHandlers from "./contextHandlers.ts";
import packageJSON from "./package.json" with {type: "json"};
import ShortTermMemoryService from "./ShortTermMemoryService.ts";
import tools from "./tools.ts";

const packageConfigSchema = z.object({});

export default {
  name: packageJSON.name,
  displayName: "Agent Memory",
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, _config) {
    app.waitForService(
      ScriptingService,
      (scriptingService: ScriptingService) => {
        scriptingService.registerFunction("addMemory", {
          type: "native",
          params: ["memory"],
          execute(this: ScriptingThis, memory: string): string {
            this.agent
              .requireServiceByType(ShortTermMemoryService)
              .addMemory(memory, this.agent);
            return `Added memory: ${memory.substring(0, 50)}...`;
          },
        });

        scriptingService.registerFunction("clearMemory", {
          type: "native",
          params: [],
          execute(this: ScriptingThis): string {
            this.agent
              .requireServiceByType(ShortTermMemoryService)
              .clearMemory(this.agent);
            return "Memory cleared";
          },
        });
      },
    );
    app.waitForService(ChatService, (chatService) => {
      chatService.addTools(...tools);
      chatService.registerContextHandlers(contextHandlers);
    });
    app.waitForService(AgentCommandService, (agentCommandService) =>
      agentCommandService.addAgentCommands(agentCommands),
    );
    app.addServices(new ShortTermMemoryService());
  },
  config: packageConfigSchema,
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
