<template>
  <div class="msg-switcher" :class="[selected ? 'selected' : '']" @click="$emit('select', id)">
    <i-mdi-mail class="h-6 min-w-fit inline-block" />
    <span class="ml-2 text-ellipsis text-left overflow-hidden whitespace-nowrap select-none">
      {{ previewMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { formatTextMessage, useMessageConfigStorage } from "@/utils/messages";

const trailblazerName = useMessageConfigStorage("tbName", "Trailblazer");
const trailblazerGender = useMessageConfigStorage("tbGender", "M");

const props = defineProps<{
  id: number;
  preview?: string;
  selected?: boolean;
}>();

defineEmits<{
  (e: "select", sectionId: number): void;
}>();

const previewMessage = computed(() => {
  if (props.preview) {
    return formatTextMessage(props.preview, trailblazerGender.value, trailblazerName.value);
  }

  return `ID: ${props.id}`;
});
</script>

<style scoped lang="postcss">
.msg-switcher {
  @apply flex flex-row border-2 px-2 py-2 cursor-pointer shadow-md shadow-black;
  @apply bg-neutral-700 border-neutral-700 hover:border-orange-400;
  @apply transition-colors items-center;
}

.msg-switcher.selected {
  @apply border-orange-500 font-bold;
}
</style>
