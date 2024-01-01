import type { MessageContents, MessageContentVideo, MessageSections } from "@/models/messages";
import { useLocalStorage } from "@vueuse/core";
import { marked } from "marked";
import DOMPurify from "dompurify";

export interface MessageContentsWithGroup {
  groupId: number;
  contents: MessageContents;
}

export interface MessageVideoUrl {
  video: string;
  audio: {
    src: string;
    type: string;
  }[];
  merged: string;
}

export const messageKey = Symbol("Message Sections Handling Key") as InjectionKey<Ref<readonly number[]>>;
export const messageOptionKey = Symbol("Message Sections Option Handling Key") as InjectionKey<
  Ref<MessageContentsWithGroup | undefined>
>;
const videoHost = "https://nao-archive.s3.eu-central-1.wasabisys.com/qingque/messages";

export function useMessageConfigStorage<T = any>(
  configName: string,
  initialValue: T
): ReturnType<typeof useLocalStorage<T>> {
  return useLocalStorage(`qqmessages:${configName}`, initialValue);
}

function isMobileDevice(): boolean {
  // Check touch support
  const touchDevice = navigator.maxTouchPoints > 1 || "ontouchstart" in document.documentElement;
  // Check if have orientation lock
  const hasOrientation = typeof screen.orientation !== "undefined";
  return touchDevice && hasOrientation;
}

/**
 * Format the text message to be gendered and replace the nickname
 * @param text The text to format
 * @param gender The gender to be used, defaults to `Male`/`M`
 * @param nickname The nickname to be used, defaults to `Trailblazer`
 * @returns The formatted text
 */
export function formatTextMessage(
  text: string,
  gender: string = "M",
  nickname: string = "Trailblazer",
  replaceNewline: boolean = false
) {
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

  // Check if text has <color> tags
  const colorRegex = /<color=.*?>(.*?)<\/color>/g;
  // If yes, replace it into <span style="color: #xxxxxx">...</span>
  const colorReplacer = (match: string, innerText: string) => {
    const color = match.slice(7, -8).replace(`>${innerText}`, "");
    return `<span style="color: ${color}">${innerText}</span>`;
  };
  text = text.replace(colorRegex, colorReplacer);

  // Check if text has {LAYOUT_...#Text} identifiers
  const layoutRegex = /\{LAYOUT_(.*?)#(.*?)\}/g;
  // If yes, select the layout we want to use:
  // - LAYOUT_MOBILE: if we're on a mobile device
  // - LAYOUT_KEYBOARD: if we're on a desktop device
  const mobileDevice = isMobileDevice();

  // Then, replace the layout identifier with the text
  const layoutReplacer = (match: string, layout: string, innerText: string) => {
    if (layout === "MOBILE" && mobileDevice) {
      return innerText;
    } else if (layout === "KEYBOARD" && !mobileDevice) {
      return innerText;
    } else {
      return "";
    }
  };
  text = text.replace(layoutRegex, layoutReplacer);

  // replace all \n with <br/>
  return replaceNewline ? text.replace(/\\n/g, "<br/>") : text;
}

export function renderTextMessage(content: string, stripHtml: boolean = false) {
  const html = marked
    .use({
      breaks: true,
      gfm: true
    })
    .parse(content, {
      async: false
    }) as string;
  return DOMPurify.sanitize(html, {
    USE_PROFILES: {
      html: stripHtml ? false : true
    }
  });
}

export function getVideoAndAudioUrl(message: MessageContentVideo): MessageVideoUrl {
  const videoUrl = `${videoHost}/${message.video.video_id}/video.webm`;
  const audioUrl = `${videoHost}/${message.video.video_id}/audio.wav`;
  const audioOpusUrl = `${videoHost}/${message.video.video_id}/audio.opus`;

  return {
    video: videoUrl,
    audio: [
      {
        src: audioOpusUrl,
        type: "audio/opus"
      },
      {
        src: audioUrl,
        type: "audio/wav"
      }
    ],
    merged: `${videoHost}/${message.video.video_id}0_merged.webm`
  };
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
  import.meta.env.DEV && console.log("Creating chain with startId", startId);
  let currentId = startId ?? section.startIds[0];
  let parentMessage = undefined;
  while (currentId) {
    const currentMessage = section.messages[currentId];
    yield new MessageChain(currentMessage, parentMessage);
    currentId = currentMessage.nextIds[0];
    parentMessage = currentMessage;
  }
}

export function targetMessageScroll(id: string) {
  nextTick(() => {
    const target = document.getElementById(id);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  });
}
