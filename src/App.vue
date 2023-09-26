<script setup lang="ts">
import { useScoresStore } from "./stores";

const scores = useScoresStore();
</script>

<template>
  <main class="pt-2 pb-8">
    <div class="flex flex-col mt-4 mb-4 items-center">
      <img src="/assets/qingque.png" class="w-32 h-auto" />
    </div>
    <div class="flex flex-col mt-4 mb-5 items-center">
      <h1 class="text-3xl font-bold">Qingque Scoring</h1>
      <p class="text-lg mt-2">A web editor for scoring system used by Qingque Bot</p>
    </div>
    <UploadArea />
    <ScoreEditor v-if="scores.loaded" />
  </main>
</template>

<style lang="postcss">
html {
  @apply bg-gray-900 text-gray-100;
}
</style>
