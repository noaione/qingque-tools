<template>
  <RouterLink :to="target">
    <div class="flex flex-col py-2 px-4 bg-gray-600 hover:scale-110 transition-all rounded-lg">
      <div class="my-1 font-bold text-center text-xl mb-1">{{ title }}</div>
      <div v-if="description" class="max-w-xs text-center text-sm mb-1">{{ description }}</div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteNamedMap } from "vue-router/auto/routes";

defineProps<{
  target: keyof RouteNamedMap;
  title: string;
  description?: string;
}>();
</script>
