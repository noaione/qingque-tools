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
      <div class="flex flex-row justify-center mt-4 gap-2">
        <RouterLink to="/messages">
          <button class="transition-colors px-4 py-2 rounded-md font-bold bg-gray-600 hover:bg-gray-500">
            Back
          </button>
        </RouterLink>
        <MessagesConfig v-if="!importError" />
      </div>
    </div>
    <hr class="border-gray-500 mt-2" />
    <div v-if="ready">
      <div v-if="messageData && !isNone(activeMessageIdx)" class="flex flex-col w-full">
        <div class="flex flex-row bg-neutral-800 py-6 px-4 font-bold text-2xl">
          {{ formatTextMessage(messageData.info.name) }}
        </div>
        <div class="flex mt-2 flex-col lg:flex-row w-screen overflow-x-hidden">
          <div class="flex flex-col gap-2 lg:w-1/3">
            <MessageSwitcher
              :id="messages[0].id"
              :preview="makePreviewMessage(messages[0])"
              :key="`sect-${messages[0].id}`"
              :selected="activeMessageIdx === mIdx"
              v-for="(messages, mIdx) in messageData.sections"
              @select="selectFromSwitcher"
            />
          </div>
          <div class="flex flex-row w-full">
            <MessageView :message-group="messageData.sections[activeMessageIdx]" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col mt-4 mb-5 items-center">
        <p class="text-xl font-semibold animate-pulse mt-2 text-center">Loading messages...</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { MessageGroup, MessageSections } from "@/models/messages";
import { formatTextMessage, isNone } from "@/utils";

type ParamInput = { charaId: string };

const route = useRoute();
const ready = ref(false);
const messageData = ref<MessageGroup>();
const activeMessageIdx = ref<number>();
const importError = ref(false);

function selectFromSwitcher(sectionId: number) {
  if (!messageData.value) return;

  for (let i = 0; i < messageData.value.sections.length; i++) {
    if (messageData.value.sections[i][0].id === sectionId) {
      activeMessageIdx.value = i;
      break;
    }
  }
}

function makePreviewMessage(section: MessageSections) {
  const { startIds } = section;
  const messagesMap = startIds.map((id) => section.messages[id]);
  // check for NPC type
  const npcMessage = messagesMap.find((msg) => ["NPC", "PlayerAuto"].includes(msg.kind));
  const hasSystem = messagesMap.some((msg) => msg.kind === "System");

  const fallbackMessage = hasSystem ? "[System Message]" : messagesMap[0].option ?? "[...]";

  return npcMessage?.text ?? fallbackMessage;
}

onMounted(() => {
  const charaId = (route.params as ParamInput).charaId;

  import(`../../assets/messages/${charaId}.json`)
    .then((module) => {
      messageData.value = module.default;
      activeMessageIdx.value = 0;
    })
    .catch(() => {
      importError.value = true;
    })
    .finally(() => {
      ready.value = true;
    });
});

useHead({
  title: () => `Qingque Message — ${messageData.value?.info.name.replace("{NICKNAME}", "Trailblazer")}`,
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