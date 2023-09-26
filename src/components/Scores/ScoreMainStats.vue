<template>
  <div class="flex flex-row mt-1 mb-2">
    <div class="flex flex-col mr-2">
      <img :src="icon" class="w-14 h-14" :alt="alt" />
      <h4 class="font-medium text-center tracking-wide text-gray-200 mt-1 w-14">{{ name }}</h4>
    </div>
    <ScoreTable :score="score" :main-index="index" main-stats-mode />
  </div>
</template>

<script setup lang="ts">
import type { StatsTypeDict } from "@/models";

defineProps<{
  score: StatsTypeDict;
  name: string;
  icon: string;
  alt: string;
  index: string;
}>();
</script>
