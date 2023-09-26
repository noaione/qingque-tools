<template>
  <button class="clear-btn" @click="clearScores">Clear</button>
</template>

<script setup lang="ts">
import { useScoresStore } from "@/stores";

const scores = useScoresStore();

const clearScores = () => {
  scores.cleanData();
};
</script>

<style scoped lang="postcss">
.clear-btn {
  @apply bg-red-700 hover:bg-red-600 active:bg-red-600 hover:text-gray-50;
  @apply transition-colors px-4 py-2 rounded-md font-bold;
}
</style>
