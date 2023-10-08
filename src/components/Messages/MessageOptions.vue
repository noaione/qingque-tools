<template>
  <TransitionGroup
    tag="div"
    class="flex flex-col mt-auto mb-6 px-4 gap-2"
    :css="false"
    @before-enter="onAniBeforeEnter"
    @enter="onAniEnter"
    @leave="onAniLeave"
  >
    <div
      class="message-option"
      @click="emitMessageSelect(message)"
      :id="`msg-opts-${message.id}`"
      :key="message.id"
      :data-id="message.id"
      :data-multiple="String(contents.length > 1)"
      v-for="message in contents"
      v-html="formatMessage(message)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import gsap, { Quad } from "gsap";
import type { MessageContents } from "@/models/messages";
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

const contents = ref(props.messages);
const selected = ref<number>();

function emitMessageSelect(message: MessageContents) {
  selected.value = message.id;
  nextTick(() => {
    contents.value = [];
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
    console.log("Options changed", messages);
    contents.value = messages;
    selected.value = undefined;
  }
);
</script>

<style scoped lang="postcss">
.message-option {
  @apply w-full px-2 flex flex-row items-center text-center justify-center py-2;
  @apply bg-neutral-600 hover:bg-neutral-700 hover:text-gray-300 transition-colors;
  @apply font-semibold select-none cursor-pointer;
  @apply border-2 border-neutral-600 hover:border-orange-800;
}
</style>
