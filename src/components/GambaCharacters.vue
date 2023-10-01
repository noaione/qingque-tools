<template>
  <div class="flex flex-row flex-wrap mx-2 md:mx-6 lg:mx-10 mt-4 gap-4 items-center justify-center">
    <GambaChara
      :character="character"
      :active="gambaStore.actives.includes(character.id)"
      :key="character.id"
      v-for="character in characters"
      @toggle="toggleCharacter"
    />
  </div>
  <div class="mt-6 flex flex-row items-center gap-2">
    <button
      class="group bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-md"
      @click="deselectAll"
    >
      <span class="font-bold group-hover:opacity-90 transition-opacity">Deselect All</span>
    </button>
    <button
      class="group bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-md"
      @click="resetSelect"
    >
      <span class="font-bold group-hover:opacity-90 transition-opacity">Reset</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Character } from "@/models";
import charactersJSON from "@/assets/characters.json";
import { useGambaStore } from "@/stores/gamba";
import sortBy from "lodash.sortby";

const gambaStore = useGambaStore();

const characters = computed(() => {
  const DUPES = ["8002", "8003", "8004"];
  const characters = Object.values(charactersJSON) as Character[];
  return sortBy(
    characters.filter((chara) => !DUPES.includes(chara.id)),
    ["rarity", "id"]
  ).reverse();
});

function toggleCharacter(charaId: string) {
  gambaStore.toggleActive(charaId);
}

function deselectAll() {
  gambaStore.actives = [];
}

function resetSelect() {
  gambaStore.defaults();
}
</script>
