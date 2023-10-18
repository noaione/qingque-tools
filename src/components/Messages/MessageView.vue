<template>
  <div class="flex flex-col w-full h-screen overflow-y-scroll border-2 border-neutral-500 bg-neutral-800">
    <MessageSections
      :message-section="messageSect"
      :key="`root-${messageSect.id}`"
      :has-more="index < messagesGroups.length - 1"
      @completed="onSectionsCompleted"
      @choices="onMessageOptionChoices"
      v-for="(messageSect, index) in messagesGroups"
    />
    <MessageOptions :messages="optionsSelections" @message-select="onMessageOptionSelected" />
  </div>
</template>

<script setup lang="ts">
import type { MessageContents, MessageSections } from "@/models/messages";
import { type MessageContentsWithGroup, messageKey, messageOptionKey, targetMessageScroll } from "@/utils";

const props = defineProps<{
  messageGroup: MessageSections[];
}>();

const nextWaiter = ref<number>();
const messagesGroups = ref(props.messageGroup);
const activeSections = ref<number[]>([]);
const optionsSelections = ref<MessageContents[]>([]);
const selectedMessage = ref<MessageContentsWithGroup>();
const activeSection = ref<number>(props.messageGroup[0].id);

function onSectionsCompleted(completedId: number) {
  const index = messagesGroups.value.findIndex((sect) => sect.id === completedId);
  const nextIndex = index + 1;
  console.log("Completed section", completedId, index, nextIndex, messagesGroups.value.length);
  const nextSection = messagesGroups.value[nextIndex];
  if (nextSection) {
    // Set new active section
    activeSection.value = nextSection.id;
    // Delay next section
    nextWaiter.value = setTimeout(() => {
      activeSections.value = [...activeSections.value, nextSection.id];
    }, 1500);
  }
}

function onMessageOptionChoices(choices: MessageContents[]) {
  optionsSelections.value = choices;
  const lastChoice = choices[choices.length - 1];

  if (lastChoice) {
    targetMessageScroll(`msg-opts-${lastChoice.id}`);
  }
}

function onMessageOptionSelected(message: MessageContents) {
  selectedMessage.value = {
    groupId: activeSection.value,
    contents: message
  };
}

function startMessageSectionsChaining(messageChains: MessageSections[]) {
  clearTimeout(nextWaiter.value);
  optionsSelections.value = [];
  activeSections.value = [];
  selectedMessage.value = undefined;
  console.log("Starting message sections chaining");
  messagesGroups.value = messageChains;
  // Start first chain
  activeSection.value = messageChains[0].id;
  activeSections.value = [messageChains[0].id];
}

provide(messageKey, readonly(activeSections));
provide(messageOptionKey, selectedMessage);

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
