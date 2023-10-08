<template>
  <div class="flex flex-col mt-2">
    <select class="form-select bg-gray-800 text-gray-100" :value="scores.cIdx" @change="onSelectChara">
      <option v-for="score in scores.scoresWithModel" :key="score.model.tag" :value="score.model.id">
        {{ getName(score.model) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { type Character, getCharacterPath } from "@/models";
import { useScoresStore } from "@/stores";

const scores = useScoresStore();

function getName(model: Character) {
  if (model.name.includes("{NICKNAME}")) {
    return (
      model.name.replace("{NICKNAME}", "Trailblazer") + ` (${getCharacterPath(model.path)}/${model.element})`
    );
  }
  return model.name;
}

function onSelectChara(e: Event) {
  const target = e.currentTarget as HTMLSelectElement;
  const id = target.value;
  if (id) {
    scores.setCurrent(id);
  }
}
</script>
