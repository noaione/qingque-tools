export interface MessageAuthorInfo {
  id: number;
  name: string;
  signature: string | null;
  iconPath: string;
  type: number;
  camp: number;
}

export type MessageContentKind = "Player" | "PlayerAuto" | "NPC" | "System";

interface MessageContent {
  id: number;
  sectionId: number;
  senderId: number | null;
  text: string;
  option: string | null;
  nextIds: number[];
  kind: MessageContentKind;
}

export interface MessageContentText extends MessageContent {
  type: "Text";
}

export interface MessageSticker {
  id: number;
  path: string;
  keywords: string;
}

export interface MessageContentSticker extends MessageContent {
  type: "Sticker";
  sticker: MessageSticker;
}

export interface MessageImage {
  id: number;
  path: string;
}

export interface MessageContentImage extends MessageContent {
  type: "Image";
  image: MessageImage;
}

export interface MessageRaid {
  id: number;
  name: string;
  desc: string;
  image: string;
}

export interface MessageContentRaid extends MessageContent {
  type: "Raid";
  raid: MessageRaid;
}

export interface MessageContentSeparator extends MessageContent {
  // Our own type, not from the game
  type: "SectionSeparator";
}

export type MessageContents =
  | MessageContentText
  | MessageContentSticker
  | MessageContentImage
  | MessageContentRaid
  | MessageContentSeparator;
export type MessageMissionType = "Main" | "Daily" | "Branch" | "Companion";

export interface MessageMission {
  id: number;
  name: string;
  type: MessageMissionType;
}

interface MessageSection {
  id: number;
  startIds: number[];
  messages: { [id: number]: MessageContents };
}

export interface MessageSectionNormal extends MessageSection {
  type: "Message";
}

export interface MessageSectionMission extends MessageSection {
  type: "MissionMessage";
  mission: MessageMission;
}

export type MessageSections = MessageSectionNormal | MessageSectionMission;

export interface MessageGroup {
  id: number;
  info: MessageAuthorInfo;
  sections: MessageSections[][];
}
