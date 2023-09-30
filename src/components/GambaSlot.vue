<template>
  <div class="inline relative">
    <div v-if="!enter" class="gamba-base gamba-back" />
    <div
      :class="[
        charaGrad,
        'group gamba-base',
        `sw-delay-${$props.index + 1}`,
        enter ? '' : 'swoop-in'
      ]"
    >
      <img v-if="charaImg !== null" class="object-cover" :src="charaImg" />
      <div
        class="gamba-text bg-black opacity-0 group-hover:opacity-50 transition-opacity"
        v-if="charaName !== null"
      >
        <p class="gamba-text-in opacity-0 group-hover:opacity-100 transition-opacity">
          {{ charaName }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from "@/models";
import { ref } from "vue";
import { watch } from "vue";
import { computed } from "vue";

const props = defineProps<{
  character?: Character;
  index: number;
}>();
const enter = ref(true);
const IMGBASE = "https://raw.githubusercontent.com/naoTimesdev/qingque-data/master/";

const charaGrad = computed(() => {
  if (props.character) {
    return `rarity-${props.character.rarity}-bg`;
  }

  return "rarity-none";
});
const charaName = computed(() => {
  if (props.character) {
    return props.character.name.replace("{NICKNAME}", "Trailblazer");
  }

  return null;
});
const charaImg = computed(() => {
  if (props.character) {
    return IMGBASE + props.character.icon;
  }

  return null;
});

watch(
  () => props.character,
  (newChar) => {
    if (newChar) {
      enter.value = false;
      setTimeout(() => {
        enter.value = true;
      }, 1500);
    }
  }
);
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

.gamba-back {
  @apply rarity-none absolute;
}

.swoop-in {
  animation: swoop-in 1s ease-in-out both;
  scale: 1.5;
}
.sw-delay-1 {
  animation-delay: 0.4s;
  z-index: 81;
}
.sw-delay-2 {
  animation-delay: 0.3s;
  z-index: 82;
}
.sw-delay-3 {
  animation-delay: 0.2s;
  z-index: 83;
}
.sw-delay-4 {
  animation-delay: 0.1s;
  z-index: 84;
}

@keyframes swoop-in {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.67);
  }
}
</style>
