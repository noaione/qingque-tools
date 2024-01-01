<template>
  <TransitionGroup
    tag="div"
    class="flex flex-col mt-auto mb-6 px-4 gap-2"
    :css="false"
    @before-enter="onAniBeforeEnter"
    @enter="onAniEnter"
    @leave="onAniLeave"
  >
    <TransitionGroup
      tag="div"
      class="flex flex-row flex-wrap md:flex-nowrap mx-auto gap-2"
      :css="false"
      @before-enter="onAniBeforeEnter"
      @enter="onAniEnter"
      @leave="onAniLeave"
    >
      <div
        class="message-option p-4"
        @click="emitMessageSelect(sticker)"
        :id="`msg-opts-${sticker.id}`"
        :key="sticker.id"
        :data-id="sticker.id"
        :data-multiple="String(stickerContents.length > 1)"
        v-for="sticker in stickerContents"
      >
        <img
          :src="`/assets/${sticker.sticker.path.replace('png', 'webp')}`"
          :alt="sticker.option ?? sticker.text"
          class="w-24 h-24"
        />
      </div>
    </TransitionGroup>
    <div
      class="message-option p-2"
      @click="emitMessageSelect(message)"
      :id="`msg-opts-${message.id}`"
      :key="message.id"
      :data-id="message.id"
      :data-multiple="String(stringContents.length > 1)"
      v-for="message in stringContents"
      v-html="formatMessage(message)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import gsap, { Quad } from "gsap";
import type { MessageContents, MessageContentSticker } from "@/models/messages";
import { log } from "@/utils";
import { formatTextMessage, renderTextMessage, useMessageConfigStorage } from "@/utils/messages";

const trailblazerName = useMessageConfigStorage("tbName", "Trailblazer");
const trailblazerGender = useMessageConfigStorage("tbGender", "M");

const props = defineProps<{
  messages: MessageContents[];
  class?: string;
}>();
const emits = defineEmits<{
  (e: "message-select", message: MessageContents): void;
}>();

const stringContents = ref(props.messages);
const stickerContents = ref<MessageContentSticker[]>([]);
const selected = ref<number>();

function emitMessageSelect(message: MessageContents) {
  selected.value = message.id;
  nextTick(() => {
    stringContents.value = [];
    stickerContents.value = [];
    nextTick(() => {
      setTimeout(() => {
        emits("message-select", message);
      }, 400);
    });
  });
}

function formatMessage(message: MessageContents) {
  return renderTextMessage(
    formatTextMessage(message.option ?? message.text, trailblazerGender.value, trailblazerName.value)
  );
}

/**
 * Animation
 */
function onAniBeforeEnter(el: Element) {
  gsap.set(el, {
    opacity: 0,
    transform: "translateY(1rem)"
  });
}
function onAniEnter(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 1,
    duration: 0.3,
    transform: "translateY(0)",
    ease: Quad.easeOut,
    onComplete: done
  });
}

function onAniLeave(el: Element, done: () => void) {
  // wait next tick
  nextTick(() => {
    const dataId = Number((el as HTMLDivElement).dataset.id);
    const delayAct = dataId === selected.value ? 0.2 : 0;
    const hasMultiple = (el as HTMLDivElement).dataset.multiple === "true";
    gsap.to(el, {
      opacity: 0,
      duration: 0.3,
      delay: hasMultiple ? delayAct : 0,
      ease: Quad.easeIn,
      onComplete: done
    });
  });
}

watch(
  () => props.messages,
  (messages) => {
    log("Options changed", messages);
    stringContents.value = messages.filter((msg) => msg.type !== "Sticker");
    stickerContents.value = messages.filter((msg) => msg.type === "Sticker") as MessageContentSticker[];
    selected.value = undefined;
  }
);
</script>

<style scoped lang="postcss">
.message-option {
  @apply w-full flex flex-row items-center text-center justify-center;
  @apply bg-neutral-600 hover:bg-neutral-700 hover:text-gray-300 transition-colors;
  @apply font-semibold select-none cursor-pointer;
  @apply border-2 border-neutral-600 hover:border-orange-800;
}
</style>
