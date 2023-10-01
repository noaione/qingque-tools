<script setup lang="ts">
import { definePage } from "vue-router/auto";

definePage({
  meta: {
    title: "Qingque Gamba",
    description: "Gamble your MoC progress with this character randomizer."
  }
});
</script>

<template>
  <main class="pt-2 pb-8">
    <QingqueIcon navigateable />
    <div class="flex flex-col mt-4 mb-5 items-center">
      <h1 class="text-3xl font-bold">Qingque Gamba</h1>
      <p class="text-lg mt-2 text-center">
        Gamble your MoC progress with this character randomizer.
      </p>
    </div>
    <div class="flex flex-col mt-4 mb-5 items-center">
      <GambaSlots />
    </div>
    <div class="flex flex-col mt-6 mb-5 items-center">
      <h1 class="text-xl font-semibold">Owned Characters</h1>
      <p class="font-medium mt-1">
        You can tap/click on characters to includes/remove from randomizer
      </p>
      <GambaCharacters />
    </div>
  </main>
</template>
