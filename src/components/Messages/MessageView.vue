<template>
  <div class="flex flex-col w-full h-screen overflow-y-scroll border-2 border-neutral-500 bg-neutral-800">
    <MessageSections
      :message-section="messageSect"
      :key="`root-${messageSect.id}`"
      :has-more="index < messagesGroups.length - 1"
      @completed="onSectionsCompleted"
      v-for="(messageSect, index) in messagesGroups"
    />
  </div>
</template>

<script setup lang="ts">
import type { MessageSections } from "@/models/messages";
import { messageKey } from "@/utils";

const props = defineProps<{
  messageGroup: MessageSections[];
}>();

const nextWaiter = ref<number>();
const messagesGroups = ref(props.messageGroup);
const activeSections = ref<number[]>([]);

function onSectionsCompleted(completedId: number) {
  const index = messagesGroups.value.findIndex((sect) => sect.id === completedId);
  const nextIndex = index + 1;
  console.log("Completed section", completedId, index, nextIndex, messagesGroups.value.length);
  const nextSection = messagesGroups.value[nextIndex];
  if (nextSection) {
    // Delay next section
    nextWaiter.value = setTimeout(() => {
      activeSections.value = [...activeSections.value, nextSection.id];
    }, 1500);
  }
}

function startMessageSectionsChaining(messageChains: MessageSections[]) {
  clearTimeout(nextWaiter.value);
  activeSections.value = [];
  console.log("Starting message sections chaining");
  messagesGroups.value = messageChains;
  // Start first chain
  activeSections.value = [messageChains[0].id];
}

provide(messageKey, readonly(activeSections));

watch(
  () => props.messageGroup,
  (newValue) => {
    startMessageSectionsChaining(newValue);
  }
);
onMounted(() => {
  nextTick(() => {
    startMessageSectionsChaining(props.messageGroup);
  });
});
</script>
