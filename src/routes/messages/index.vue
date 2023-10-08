<template>
  <main class="pt-2 pb-8">
    <QingqueIcon navigateable />
    <div class="flex flex-col mt-4 mb-5 items-center">
      <h1 class="text-3xl font-bold">Qingque Messages</h1>
      <p class="text-lg mt-2 text-center">See/interact with in-game messages</p>
      <MessagesConfig class="mt-4" />
    </div>
    <hr class="border-gray-500 mt-2" />
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 justify-center items-center gap-4 mt-4 mx-2">
      <NavButton
        :target="`/messages/${message.id}`"
        :title="message.name.replace('{NICKNAME}', 'Trailblazer')"
        :description="message.signature ?? `ID: ${message.id}` ?? undefined"
        :key="`msg-${message.id}`"
        v-for="message in allMessages"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import messagesJSON from "@/assets/messages.json";
import type { MessageAuthorInfo } from "@/models/messages";
import sortBy from "lodash.sortby";

const allMessages = computed(() => {
  const messages = Object.values(messagesJSON) as MessageAuthorInfo[];
  return sortBy(messages, ["camp", "id"]);
});

useHead({
  title: "Qingque Messages",
  meta: [
    {
      name: "description",
      content: "See/interact with in-game messages"
    }
  ]
});
</script>
