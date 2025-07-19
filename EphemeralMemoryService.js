import MemoryService from "./MemoryService.js";

export default class EphemeralMemoryService extends MemoryService {
 name = "EphemeralMemoryService";
 description = "Provides EphemeralMemory functionality";
 constructor() {
  super();
 }

 memories = [];
 attentionItems = {};

 addMemory(memory) {
  this.memories.push(memory);
 }
 clearMemory() {
  this.memories = [];
 }
 spliceMemory(index, count, ...items) {
  this.memories.splice(index, count, ...items);
 }


 pushAttentionItem(type, item) {
  (this.attentionItems[type] ??= []).push(item);
 }

 unshiftAttentionItem(type, item) {
  (this.attentionItems[type] ??= []).unshift(item);
 }

 clearAttentionItems(type) {
  delete this.attentionItems[type];
 }
 spliceAttentionItems(type, index, count, ...items) {
  (this.attentionItems[type] ??= []).splice(index, count, ...items);
 }

 /**
  * Asynchronously yields memories
  * @param {TokenRingRegistry} registry
  * @async
  * @generator
  * @yields {MemoryItem} Memory object with role and content.
  */
 async* getMemories(registry) {
  for (const memory of this.memories ?? []) {
   yield memory;
  }
 }

 /**
  * Asynchronously yields attention items
  * @async
  * @generator
  * @yields {AttentionItem} Attention Item with role and content.
  */
 async* getAttentionItems(registry) {
  let message = [];
  for (const type in this.attentionItems) {
   const items = this.attentionItems[type];
   if (items.length > 0) {
    message.push(`${type}`);
    for (const item of items) {
     message.push(`- ${item}`);
    }
   }
  }

  if (message.length > 0) {
   yield {role: "user", content: message.join('\n')};
  }
 }
}