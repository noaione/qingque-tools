<template>
  <div class="flex flex-col mt-auto items-center justify-center w-full mb-6">
    <div
      ref="headerRef"
      class="w-full lg:w-2/3 text-white text-lg font-bold px-2 z-40 py-1 rounded-t-lg select-none"
      :style="{
        backgroundColor: MissionColor[mission.type],
        opacity: 0,
        transform: 'translateX(-1rem)',
        borderBottomLeftRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem'
      }"
    >
      {{ MissionText[mission.type] }}
    </div>
    <div
      ref="contentRef"
      class="w-full lg:w-2/3 h-24 bg-gray-300 z-30 rounded-bl-lg flex flex-row"
      :style="{
        opacity: 0,
        transform: 'translateX(-1rem)'
      }"
    >
      <div
        class="mmission-icon-contain z-20"
        ref="iconRef"
        :style="{
          backgroundColor: MissionColor[mission.type],
          opacity: 0,
          transform: 'translateY(-1rem)'
        }"
      >
        <img
          class="m-auto object-contain h-[4.5rem] w-[4.5rem]"
          :src="`/assets/icon/missionicon/${mission.type}.webp`"
          :alt="`Mission ${mission.type} Icon`"
        />
      </div>
      <div
        ref="nameRef"
        class="w-full mx-4 my-auto text-3xl font-bold text-neutral-700 z-10"
        :style="{
          opacity: 0,
          transform: 'translateX(-2rem)'
        }"
      >
        {{ mission.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap, Quad } from "gsap/gsap-core";
import type { MessageMission, MessageMissionType } from "@/models/messages";

type MappedMissionType = {
  [key in MessageMissionType]: string;
};

defineProps<{
  mission: MessageMission;
}>();

const headerRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const iconRef = ref<HTMLDivElement>();
const nameRef = ref<HTMLDivElement>();

const MissionColor: MappedMissionType = {
  Main: "#ffd52b",
  Companion: "#b886ed",
  Branch: "#54a9be",
  Daily: "#9eb464"
};
const MissionText: MappedMissionType = {
  Main: "Trailblaze Mission",
  Companion: "Companion Mission",
  Branch: "Adventure Mission",
  Daily: "Daily Mission"
};

/**
 * Animation
 */

function startAni(tl: gsap.core.Timeline) {
  if (headerRef.value) {
    tl.to(headerRef.value, {
      opacity: 1,
      duration: 0.3,
      transform: "translateX(0)",
      ease: Quad.easeOut
    });
    if (contentRef.value) {
      tl.to(contentRef.value, {
        opacity: 1,
        duration: 0.3,
        transform: "translateX(0)",
        delay: -0.15,
        ease: Quad.easeOut
      });
      tl.to(headerRef.value, {
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0",
        duration: 0.4,
        delay: -0.15,
        ease: Quad.easeOut
      });
    }
  }

  if (iconRef.value) {
    tl.to(iconRef.value, {
      opacity: 1,
      duration: 0.3,
      transform: "translateY(0)",
      delay: -0.3,
      ease: Quad.easeOut
    });
  }

  if (nameRef.value) {
    tl.to(nameRef.value, {
      opacity: 1,
      duration: 0.3,
      transform: "translateX(0)",
      delay: -0.35,
      ease: Quad.easeOut
    });
  }
}

onMounted(() => {
  const tl = gsap.timeline();
  startAni(tl);
});
</script>

<style scoped lang="postcss">
.mmission-icon-contain {
  @apply flex flex-col;
  @apply w-40 md:w-32 lg:w-28 h-full ml-4 lg:ml-10;
  @apply border-x-[3px] border-gray-100 rounded-b-lg;
}
</style>
