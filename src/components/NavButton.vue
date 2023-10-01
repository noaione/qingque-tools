<template>
  <RouterLink :to="target">
    <div
      class="flex flex-col py-2 px-4 transition-all rounded-lg items-center border-4 z-5 hover:z-10"
      :class="`bg-gray-600 border-gray-600 hover:bg-gray-500 hover:scale-110 hover:border-gray-400`"
    >
      <div class="my-1 font-bold text-center text-xl mb-1">{{ title }}</div>
      <div v-if="description" class="max-w-xs text-center text-sm mb-1">{{ description }}</div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteNamedMap } from "vue-router/auto/routes";

defineProps<{
  target: keyof RouteNamedMap | string;
  title: string;
  description?: string;
}>();
</script>
