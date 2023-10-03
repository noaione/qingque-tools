<template>
  <!-- Non-System ver. -->
  <div
    v-if="isSystem"
    :class="`flex flex-col justify-center items-center m-6 text-neutral-300 ${$props.class ?? ''}`"
  >
    <div class="flex flex-row gap-0.5">
      <span>—</span>
      <i-mdi-bell-outline class="w-6 h-6 mb-0.5" />
      <span>—</span>
    </div>
    <p class="text-sm font-bold mx-2 text-center">
      {{ formatTextMessage(message.text, trailblazerGender, trailblazerName) }}
    </p>
  </div>
  <div
    v-else
    :class="`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start m-6 gap-[0.6rem] ${
      $props.class ?? ''
    }`"
  >
    <div class="flex rounded-full border border-neutral-400 bg-neutral-600">
      <img class="object-contain h-16 w-auto" :src="senderAvatar" />
    </div>
    <div class="flex flex-col bg-neutral-600 rounded-md mt-[0.35rem] px-4 py-2 max-w-lg">
      <div :class="`text-lg font-bold ${isMe ? 'text-right' : 'text-left'}`">{{ senderName }}</div>
      <div
        v-if="message.type === 'Text'"
        :class="`flex flex-wrap pb-1 ${isMe ? 'text-right' : 'text-left'}`"
      >
        {{ formatTextMessage(message.text, trailblazerGender, trailblazerName) }}
      </div>
      <div v-else-if="message.type === 'Image'" class="flex flex-wrap pb-1 mt-2">
        <img
          class="object-contain h-36 w-auto"
          :src="`/assets/${message.image.path.replace('.png', '.webp')}`"
          :alt="message.text"
        />
      </div>
      <div v-else-if="message.type === 'Sticker'" class="flex flex-wrap pb-1 mt-2">
        <img
          class="object-contain h-36 w-auto"
          :src="`/assets/${message.sticker.path.replace('.png', '.webp')}`"
          :alt="message.sticker.keywords"
        />
      </div>
      <div
        v-else-if="message.type === 'Raid'"
        :class="`flex flex-col flex-wrap pb-1 mt-2 ${isMe ? 'text-right' : 'text-left'}`"
      >
        <img
          class="object-contain h-40 mt-2 w-auto items-center"
          :src="`/assets/${message.raid.image.replace('.png', '.webp')}`"
          :alt="message.raid.name"
        />
        <span class="mt-2 text-purple-300 text-lg font-semibold">Mission</span>
        <span class="mt-0.5 font-semibold">{{ message.raid.name }}</span>
        <span class="mt-2">{{ message.raid.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageAuthorInfo, MessageContents } from "@/models/messages";
import { formatTextMessage, useMessageConfigStorage } from "@/utils/messages";

const trailblazerName = useMessageConfigStorage("tbName", "Trailblazer");
const trailblazerGender = useMessageConfigStorage("tbGender", "M");

const props = defineProps<{
  message: MessageContents;
  author?: MessageAuthorInfo;
  class?: string;
}>();

const isMe = computed(() => {
  return ["Player", "PlayerAuto"].includes(props.message.kind);
});
const isSystem = computed(() => {
  return props.message.kind === "System";
});

const senderName = computed(() => {
  if (props.author) {
    if (props.author.id === 8000) {
      return trailblazerName.value;
    }

    return formatTextMessage(props.author.name, trailblazerGender.value, trailblazerName.value);
  }

  return trailblazerName.value;
});

const senderAvatar = computed(() => {
  const tbProfile = trailblazerGender.value === "M" ? "8001.webp" : "8002.webp";

  if (props.author) {
    if (props.author.id === 8000) {
      return `/assets/icon/avatar/${tbProfile}`;
    }

    return `/assets/${props.author.iconPath.replace(".png", ".webp")}`;
  }

  return `/assets/icon/avatar/${tbProfile}`;
});
</script>
