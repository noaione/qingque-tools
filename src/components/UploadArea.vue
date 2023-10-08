<template>
  <div class="flex flex-col items-center mt-2">
    <h2 class="text-xl font-semibold">Score Files</h2>
    <div class="flex flex-row mt-6 items-center gap-2">
      <LoadBtn @load-error="setError" @init-load="errorMsg = null" />
      <SaveBtn v-if="scores.loaded" />
      <ClearBtn v-if="scores.loaded" />
    </div>
  </div>
  <div class="mt-2 text-red-500" v-if="errorMsg !== null">
    {{ errorMsg }}
  </div>
</template>

<script setup lang="ts">
import { useScoresStore } from "@/stores";

const scores = useScoresStore();

const errorMsg = ref<string | null>(null);

function setError(msg: string | null) {
  errorMsg.value = msg;
}
</script>
