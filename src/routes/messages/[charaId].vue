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
      <p v-if="importError" class="mt-1 text-center text-red-300">
        Unable to find messages for
        <span class="error-glowy">ID: {{ ($route.params as ParamInput).charaId }}</span>
      </p>
    </div>
    <hr class="border-gray-500 mt-2" />
  </main>
</template>

<script setup lang="ts">
import type { MessageGroup } from "@/models/messages";

type ParamInput = { charaId: string };

const route = useRoute();
const messageData = ref<MessageGroup>();
const importError = ref(false);

onMounted(() => {
  const charaId = (route.params as ParamInput).charaId;

  import(`../../assets/messages/${charaId}.json`)
    .then((module) => {
      messageData.value = module.default;
    })
    .catch(() => {
      importError.value = true;
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
.error-glowy {
  text-shadow: 0 0 8px rgba(228, 64, 64, 0.8);
}
</style>
