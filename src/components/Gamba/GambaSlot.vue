<template>
  <div class="inline relative">
    <div v-if="!enter" class="gamba-base gamba-back" />
    <div
      class="group gamba-base"
      :class="[
        charaGrad,
        rightSide ? `swr-delay-${props.index + 1}` : `sw-delay-${$props.index + 1}`,
        enter ? '' : 'swoop-in'
      ]"
    >
      <img
        v-if="charaImg !== null"
        class="object-cover"
        :src="charaImg"
        :alt="charaName ?? 'None' + ' Icon'"
      />
      <div
        class="gamba-text bg-black opacity-0 group-hover:opacity-50 transition-opacity"
        @touchend="mobileClick = !mobileClick"
        :aria-selected="mobileClick ? 'true' : 'false'"
        v-if="charaName !== null"
      >
        <p
          class="gamba-text-in opacity-0 group-hover:opacity-100 transition-opacity"
          :aria-selected="mobileClick ? 'true' : 'false'"
        >
          {{ charaName }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from "@/models";

const props = defineProps<{
  character?: Character;
  rightSide?: boolean;
  index: number;
}>();
const enter = ref(true);
const IMGBASE = "/assets/";
const timeoutId = ref<number | null>(null);

const mobileClick = ref(false);

const charaGrad = computed(() => {
  if (props.character) {
    return `rarity-${props.character.rarity}-bg`;
  }

  return "rarity-none";
});
const charaName = computed(() => {
  if (props.character) {
    const destTb = ["8001", "8002"];
    const presTb = ["8003", "8004"];
    const harmTb = ["8005", "8006"];

    let nicknamed = props.character.name.replace("{NICKNAME}", "Trailblazer");

    if (destTb.includes(props.character.id)) {
      nicknamed += " (Destruction)";
    } else if (presTb.includes(props.character.id)) {
      nicknamed += " (Preservation)";
    } else if (harmTb.includes(props.character.id)) {
      nicknamed += " (Harmony)";
    }

    return nicknamed;
  }

  return null;
});
const charaImg = computed(() => {
  if (props.character) {
    return IMGBASE + props.character.icon.replace(".png", ".webp");
  }

  return null;
});

watch(
  () => props.character,
  (newChar) => {
    if (newChar) {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value);
      }
      enter.value = false;
      timeoutId.value = setTimeout(() => {
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
.gamba-text[aria-selected="true"] {
  @apply opacity-50;
}

.gamba-text-in {
  @apply text-white font-bold text-center select-none mb-2;
}
.gamba-text-in[aria-selected="true"] {
  @apply opacity-100;
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
  animation-name: swoop-in;
  animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  animation-fill-mode: both;
  scale: 1.5;
}
.sw-delay-1 {
  animation-duration: 1.4s;
  z-index: 81;
}
.sw-delay-2 {
  animation-duration: 1.3s;
  z-index: 82;
}
.sw-delay-3 {
  animation-duration: 1.2s;
  z-index: 83;
}
.sw-delay-4 {
  animation-duration: 1.1s;
  z-index: 84;
}
.swr-delay-1 {
  animation-duration: 1.1s;
  z-index: 84;
}
.swr-delay-2 {
  animation-duration: 1.2s;
  z-index: 83;
}
.swr-delay-3 {
  animation-duration: 1.3s;
  z-index: 82;
}
.swr-delay-4 {
  animation-duration: 1.4s;
  z-index: 81;
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
