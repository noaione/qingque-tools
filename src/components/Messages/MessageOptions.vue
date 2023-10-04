<template>
  <Transition name="message-select">
    <div
      v-if="showTrans"
      :id="`msg-opts-${messages[messages.length - 1].id}`"
      class="flex flex-col mt-auto mb-6 px-4 gap-2"
    >
      <div
        class="message-option"
        @click="$emit('message-select', message)"
        :key="message.id"
        v-for="message in messages"
      >
        {{ formatMessage(message) }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { MessageContents } from "@/models/messages";
import { formatTextMessage, useMessageConfigStorage } from "@/utils/messages";

const trailblazerName = useMessageConfigStorage("tbName", "Trailblazer");
const trailblazerGender = useMessageConfigStorage("tbGender", "M");

defineProps<{
  messages: MessageContents[];
  class?: string;
}>();
defineEmits<{
  (e: "message-select", message: MessageContents): void;
}>();

const showTrans = ref(false);

function formatMessage(message: MessageContents) {
  return formatTextMessage(message.option ?? message.text, trailblazerGender.value, trailblazerName.value);
}

onMounted(() => {
  showTrans.value = true;
});
</script>

<style scoped lang="postcss">
.message-select-enter-active {
  transition: all 0.3s ease-out;
}

.message-select-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.message-select-enter-from {
  transform: translateY(1rem);
  opacity: 0;
}

.message-option {
  @apply w-full px-2 flex flex-row items-center text-center justify-center py-2;
  @apply bg-neutral-600 hover:bg-neutral-700 hover:text-gray-300 transition-colors;
  @apply font-semibold select-none cursor-pointer;
  @apply border-2 border-neutral-600 hover:border-orange-800;
}
</style>
