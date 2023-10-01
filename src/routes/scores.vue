<script setup lang="ts">
import { useScoresStore } from "@/stores";
import { definePage } from "vue-router/auto";

const scores = useScoresStore();

definePage({
  meta: {
    title: "Qingque Scoring",
    description: "A web editor for scoring system used by Qingque Bot"
  }
});
</script>

<template>
  <main class="pt-2 pb-8">
    <QingqueIcon navigateable />
    <div class="flex flex-col mt-4 mb-5 items-center">
      <h1 class="text-3xl font-bold">Qingque Scoring</h1>
      <p class="text-lg mt-2 text-center">A web editor for scoring system used by Qingque Bot</p>
    </div>
    <UploadArea />
    <ScoreEditor v-if="scores.loaded" />
  </main>
</template>
