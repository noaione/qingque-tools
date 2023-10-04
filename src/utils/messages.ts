import type { MessageContents, MessageSections } from "@/models/messages";
import { useLocalStorage } from "@vueuse/core";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const messageKey = Symbol("Message Sections Handling Key") as InjectionKey<Ref<readonly number[]>>;

export function useMessageConfigStorage<T = any>(
  configName: string,
  initialValue: T
): ReturnType<typeof useLocalStorage<T>> {
  return useLocalStorage(`qqmessages:${configName}`, initialValue);
}

/**
 * Format the text message to be gendered and replace the nickname
 * @param text The text to format
 * @param gender The gender to be used, defaults to `Male`/`M`
 * @param nickname The nickname to be used, defaults to `Trailblazer`
 * @returns The formatted text
 */
export function formatTextMessage(text: string, gender: string = "M", nickname: string = "Trailblazer") {
  // replace {NICKNAME}
  text = text.replace("{NICKNAME}", nickname);
  // Use gendered version of the text, formatted like:
  // {F#Text}{M#Text} or swap the order, depending on the `gender`

  let genderStr = gender.slice(0, 1).toUpperCase();
  if (!["M", "F"].includes(gender)) {
    genderStr = "M";
  }
  const matcher = /\{([FM])#(.*?)\}/g;
  text = text.replace(matcher, (match, g, text) => (g === genderStr ? text : ""));
  return text;
}

export function renderTextMessage(content: string, stripHtml: boolean = false) {
  const html = marked
    .use({
      breaks: true,
      gfm: true
    })
    .parse(content);
  return DOMPurify.sanitize(html, {
    USE_PROFILES: {
      html: stripHtml ? false : true
    }
  });
}

export class MessageChain {
  current: MessageContents;
  parent?: MessageContents;

  constructor(current: MessageContents, parent?: MessageContents) {
    this.current = current;
    this.parent = parent;
  }
}

// The way message chain works is, return the current message
// and then also get the list of nextIds, if there's multiple
// on the front side, we recreate the messages chain starting from the
// provided IDs.
export function* makeMessagesChain(section: MessageSections, startId?: number) {
  // continue the chain until we hit a message with no nextIds
  console.log("Creating chain with startId", startId);
  let currentId = startId ?? section.startIds[0];
  let parentMessage = undefined;
  while (currentId) {
    const currentMessage = section.messages[currentId];
    yield new MessageChain(currentMessage, parentMessage);
    currentId = currentMessage.nextIds[0];
    parentMessage = currentMessage;
  }
}
