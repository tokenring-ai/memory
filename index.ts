import {AgentTeam, TokenRingPackage} from "@tokenring-ai/agent";

import * as chatCommands from "./chatCommands.ts";
import packageJSON from "./package.json" with {type: "json"};
import ShortTermMemoryService from "./ShortTermMemoryService.js";
import * as tools from "./tools.ts";

export const packageInfo: TokenRingPackage = {
	name: packageJSON.name,
	version: packageJSON.version,
	description: packageJSON.description,
  install(agentTeam: AgentTeam) {
    agentTeam.addTools(packageInfo, tools)
    agentTeam.addChatCommands(chatCommands);
    agentTeam.addServices(new ShortTermMemoryService());
  },
};

export { default as ShortTermMemoryService } from "./ShortTermMemoryService.ts";
