<template>
  <div class="flex flex-col mt-4 mb-4 items-center">
    <img
      src="/assets/qingque.webp"
      class="w-32 h-auto"
      width="256"
      height="256"
      fetchpriority="high"
      alt="Qingque Icon"
      @click="props.navigateable ? $router.push('/') : null"
      :class="[props.navigateable ? 'cursor-pointer hover:scale-110 transition-all' : '']"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  navigateable?: boolean;
}>();
</script>
