import {AgentCommandService, AgentTeam, TokenRingPackage} from "@tokenring-ai/agent";
import {ChatService} from "@tokenring-ai/chat";
import {ScriptingService} from "@tokenring-ai/scripting";
import {ScriptingThis} from "@tokenring-ai/scripting/ScriptingService.js";

import * as chatCommands from "./chatCommands.ts";
import packageJSON from "./package.json" with {type: "json"};
import ShortTermMemoryService from "./ShortTermMemoryService.js";
import * as tools from "./tools.ts";

export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(agentTeam: AgentTeam) {
    agentTeam.waitForService(ScriptingService, (scriptingService: ScriptingService) => {
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
    agentTeam.waitForService(ChatService, chatService =>
      chatService.addTools(packageJSON.name, tools)
    );
    agentTeam.waitForService(AgentCommandService, agentCommandService =>
      agentCommandService.addAgentCommands(chatCommands)
    );
    agentTeam.addServices(new ShortTermMemoryService());
  },
} as TokenRingPackage;

export {default as ShortTermMemoryService} from "./ShortTermMemoryService.ts";
