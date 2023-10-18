<template>
  <RouterLink :to="`/messages/${target}`">
    <div
      class="flex flex-row py-2 px-4 transition-all rounded-lg items-start border-4 z-5 hover:z-10 gap-4"
      :class="`bg-gray-600 border-gray-600 hover:bg-gray-500 hover:scale-110 hover:border-gray-400`"
    >
      <div class="flex flex-col w-16 h-16 aspect-square rounded-full">
        <img
          class="object-contain w-16 h-16 rounded-full shadow-md bg-gray-700"
          :src="authorAvatar"
          :alt="String(target)"
        />
      </div>
      <div class="flex flex-col w-full">
        <div class="my-1 font-bold text-left text-xl mb-1">
          {{ formatTextMessage(author, trailblazerGender, trailblazerName) }}
        </div>
        <div class="max-w-xs text-left text-sm mb-1">{{ signature ?? `ID: ${target}` }}</div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { formatTextMessage, useMessageConfigStorage } from "@/utils";

const trailblazerName = useMessageConfigStorage("tbName", "Trailblazer");
const trailblazerGender = useMessageConfigStorage("tbGender", "M");

const props = defineProps<{
  target: number;
  author: string;
  signature: string | null;
  icon: string;
}>();

const authorAvatar = computed(() => {
  const tbProfile = trailblazerGender.value === "M" ? "8001.webp" : "8002.webp";

  if (props.target === 8000) {
    return `/assets/icon/avatar/${tbProfile}`;
  }

  return `/assets/${props.icon.replace(".png", ".webp")}`;
});
</script>
