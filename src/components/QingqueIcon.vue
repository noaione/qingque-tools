<template>
  <div
    class="group flex flex-col mt-4 mb-4 items-center"
    :class="[props.navigateable ? 'cursor-pointer' : '']"
    @click="props.navigateable ? $router.push('/') : null"
  >
    <img
      src="/assets/qingque.webp"
      class="w-32 h-auto"
      :class="[props.navigateable ? 'group-hover:scale-110 transition-all' : '']"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  navigateable?: boolean;
}>();
</script>
