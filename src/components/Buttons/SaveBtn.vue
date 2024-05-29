<template>
  <button class="save-btn" @click="saveScores">Save</button>
</template>

<script setup lang="ts">
import type { ScoreCharacterJSON } from "@/models";
import { useScoresStore } from "@/stores";
import { calculateMaximumPossibleValues } from "@/utils";

const FILENAME = "QingqueScoring.json";
const scores = useScoresStore();

function saveScores() {
  console.log("Saving...");
  const scoreJSON: ScoreCharacterJSON = {};
  for (const { id, data } of scores.$state.scores) {
    scoreJSON[id] = {
      ...data,
      max: calculateMaximumPossibleValues(data)
    };
    switch (id) {
      case "8001":
        scoreJSON["8002"] = {
          ...data,
          max: calculateMaximumPossibleValues(data)
        };
        break;
      case "8002":
        scoreJSON["8001"] = {
          ...data,
          max: calculateMaximumPossibleValues(data)
        };
        break;
      case "8003":
        scoreJSON["8004"] = {
          ...data,
          max: calculateMaximumPossibleValues(data)
        };
        break;
      case "8004":
        scoreJSON["8003"] = {
          ...data,
          max: calculateMaximumPossibleValues(data)
        };
        break;
      case "8005":
        scoreJSON["8006"] = {
          ...data,
          max: calculateMaximumPossibleValues(data)
        };
        break;
      case "8006":
        scoreJSON["8005"] = {
          ...data,
          max: calculateMaximumPossibleValues(data)
        };
        break;
    }
  }

  const blob = new Blob([JSON.stringify(scoreJSON, undefined, 4)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = FILENAME;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}
</script>

<style scoped lang="postcss">
.save-btn {
  @apply bg-green-700 hover:bg-green-600 active:bg-green-600 hover:text-gray-50;
  @apply transition-colors px-4 py-2 rounded-md font-bold;
}
</style>
