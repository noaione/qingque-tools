<template>
  <div
    :class="`${charaGrad} gamba-base cursor-pointer transition-opacity hover:opacity-75 ${
      active ? 'opacity-100' : 'opacity-50'
    }`"
    @click="emit('toggle', character.id)"
  >
    <img v-if="charaImg !== null" class="object-cover" :src="charaImg" />
  </div>
</template>

<script setup lang="ts">
import type { Character } from "@/models";
import { computed } from "vue";

const props = defineProps<{
  character: Character;
  active?: boolean;
}>();
const emit = defineEmits<{
  (e: "toggle", charaId: string): void;
}>();
const IMGBASE = "https://raw.githubusercontent.com/naoTimesdev/qingque-data/master/";

const charaGrad = computed(() => {
  if (props.character) {
    return `rarity-${props.character.rarity}-bg`;
  }

  return "rarity-none";
});
const charaImg = computed(() => {
  if (props.character) {
    return IMGBASE + props.character.icon;
  }

  return null;
});
</script>

<style lang="postcss">
.gamba-base {
  @apply flex relative bg-gradient-to-bl rounded-tr-lg border-2;
  @apply z-[80] w-[7rem] h-[10rem] xl:w-[9rem] xl:h-[12rem];
}
.gamba-text {
  @apply w-full h-full absolute flex flex-col-reverse;
}
.gamba-text-in {
  @apply text-white font-bold text-center select-none mb-2;
}
.rarity-none {
  @apply from-[#343642] to-[#808187];
  @apply border-[#a3a4ac];
}
.rarity-4-bg {
  @apply from-[#3e3d65] to-[#8b58d0];
}
.rarity-5-bg {
  @apply from-[#8a504a] to-[#d0a869];
}
</style>
