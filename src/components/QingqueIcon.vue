<template>
  <div
    class="group flex flex-col mt-4 mb-4 items-center"
    :class="[props.navigateable ? 'cursor-pointer' : '']"
    @click="navigateHome"
  >
    <img
      src="/assets/qingque.png"
      class="w-32 h-auto"
      :class="[props.navigateable ? 'group-hover:scale-110 transition-all' : '']"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  navigateable?: boolean;
}>();
const router = useRouter();

function navigateHome() {
  if (props.navigateable) {
    router.push("/");
  }
}
</script>
