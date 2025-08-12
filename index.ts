import packageJSON from './package.json' with { type: 'json' };
export const name = packageJSON.name;
export const version = packageJSON.version;
export const description = packageJSON.description;

export * as chatCommands from "./chatCommands.ts";
export { default as EphemeralMemoryService } from "./EphemeralMemoryService.ts";
export { default as MemoryService } from "./MemoryService.ts";
export * as tools from "./tools.ts";