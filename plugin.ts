import TokenRingApp from "@tokenring-ai/app"; 
import {AgentCommandService} from "@tokenring-ai/agent";
import {ChatService} from "@tokenring-ai/chat";
import {TokenRingPlugin} from "@tokenring-ai/app";
import {ScriptingService} from "@tokenring-ai/scripting";
import {ScriptingThis} from "@tokenring-ai/scripting/ScriptingService";

import chatCommands from "./chatCommands.ts";
import contextHandlers from "./contextHandlers.ts";
import packageJSON from "./package.json" with {type: "json"};
import ShortTermMemoryService from "./ShortTermMemoryService.js";
import tools from "./tools.ts";


export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app: TokenRingApp) {
    app.waitForService(ScriptingService, (scriptingService: ScriptingService) => {
      scriptingService.registerFunction("addMemory", {
          type: 'native',
          params: ['memory'],
          execute(this: ScriptingThis, memory: string): string {
            this.agent.requireServiceByType(ShortTermMemoryService).addMemory(memory, this.agent);
            return `Added memory: ${memory.substring(0, 50)}...`;
          }
        }
      );

      scriptingService.registerFunction("clearMemory", {
          type: 'native',
          params: [],
          execute(this: ScriptingThis): string {
            this.agent.requireServiceByType(ShortTermMemoryService).clearMemory(this.agent);
            return 'Memory cleared';
          }
        }
      );
    });
    app.waitForService(ChatService, chatService => {
      chatService.addTools(packageJSON.name, tools);
      chatService.registerContextHandlers(contextHandlers);
    });
    app.waitForService(AgentCommandService, agentCommandService =>
      agentCommandService.addAgentCommands(chatCommands)
    );
    app.addServices(new ShortTermMemoryService());
  },
} satisfies TokenRingPlugin;
