<template>
  <div class="flex flex-col lg:flex-row mt-4 gap-8 justify-between items-center">
    <div class="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-2">
      <GambaSlot
        :character="character"
        :index="index"
        :key="`first-${index}`"
        v-for="(character, index) in firstRows"
      />
    </div>
    <div class="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-2">
      <GambaSlot
        :character="character"
        :index="index"
        :key="`second-${index}`"
        right-side
        v-for="(character, index) in secondRows"
      />
    </div>
  </div>
  <div class="mt-6 flex flex-row items-center gap-2">
    <button
      class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-700 btn-gamba"
      :disabled="randomizing"
      @click="randomize"
    >
      <span class="font-bold group-hover:opacity-90 transition-opacity">Randomize</span>
    </button>
    <button
      class="bg-red-600 hover:bg-red-700 disabled:bg-red-700 btn-gamba"
      :disabled="randomizing"
      @click="clear"
    >
      <span class="font-bold group-hover:opacity-90 transition-opacity">Clear</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Character } from "@/models";
import { useGambaStore } from "@/stores/gamba";

const gambaStore = useGambaStore();
const randomizing = ref(false);
const randomizingId = ref<number | null>(null);

type CharacterNull = Character | undefined;

const UNDEFINEDS = [undefined, undefined, undefined, undefined];

const firstRows = ref<CharacterNull[]>(UNDEFINEDS);
const secondRows = ref<CharacterNull[]>(UNDEFINEDS);

function fillWithUndefined(arr: CharacterNull[]) {
  // Check count, if not 4 fill the rest with undefined
  if (arr.length < 4) {
    const diff = 4 - arr.length;
    for (let i = 0; i < diff; i++) {
      arr.push(undefined);
    }
  }
}

function randomize() {
  firstRows.value = UNDEFINEDS;
  secondRows.value = UNDEFINEDS;

  setTimeout(() => {
    gambaStore.randomize();

    const allValues = gambaStore.selectedWithModel;
    const firstValues = allValues.slice(0, 4);
    fillWithUndefined(firstValues);
    const secondValues = allValues.slice(4, 8);
    fillWithUndefined(secondValues);

    randomizing.value = true;
    firstRows.value = firstValues;
    secondRows.value = secondValues;

    if (randomizingId.value) {
      clearTimeout(randomizingId.value);
    }

    randomizingId.value = setTimeout(() => {
      randomizing.value = false;
    }, 1500);
  }, 250);
}
function clear() {
  firstRows.value = UNDEFINEDS;
  secondRows.value = UNDEFINEDS;
  gambaStore.reset();
}
</script>

<style scoped lang="postcss">
.btn-gamba {
  @apply transition-colors px-4 py-2 rounded-md disabled:cursor-not-allowed;
}
</style>
