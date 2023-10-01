<template>
  <main class="pt-2 pb-8">
    <QingqueIcon navigateable />
    <div class="flex flex-col mt-4 mb-5 items-center">
      <h1 class="text-3xl font-bold">Qingque Messages</h1>
      <p class="text-lg mt-2 text-center">
        See/interact with in-game messages<span v-if="messageData">
          from
          <span class="font-semibold glowy-text">{{
            messageData.info.name.replace("{NICKNAME}", "Trailblazer")
          }}</span></span
        >
      </p>
    </div>
    <hr class="border-gray-500 mt-2" />
  </main>
</template>

<script setup lang="ts">
import type { MessageGroup } from "@/models/messages";

const route = useRoute();
const messageData = ref<MessageGroup>();

onMounted(() => {
  const charaId = (route.params as { charaId: string }).charaId;

  import(`../../assets/messages/${charaId}.json`).then((module) => {
    messageData.value = module.default;
  });
});

useHead({
  title: () =>
    `Qingque Message — ${messageData.value?.info.name.replace("{NICKNAME}", "Trailblazer")}`,
  meta: [
    {
      name: "description",
      content: () =>
        `See/interact with in-game messages from ${messageData.value?.info.name.replace(
          "{NICKNAME}",
          "Trailblazer"
        )}`
    }
  ]
});
</script>

<style scoped lang="postcss">
.glowy-text {
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}
</style>
