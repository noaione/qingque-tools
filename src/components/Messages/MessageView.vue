<template>
  <div class="flex flex-col w-full h-screen overflow-y-scroll border-2 border-neutral-500 bg-neutral-800">
    <MessageContent
      :message="message"
      :author="!isNone(message.senderId) ? usedContacts[message.senderId] : undefined"
      :key="message.id"
      :class="index > 0 ? (index === messagesQueue.length - 1 ? 'mb-6 mt-2' : 'my-2') : 'mb-2'"
      v-for="(message, index) in messagesQueue"
    />
    <MessageOptions
      :messages="optionsSelections"
      @message-select="onMessageOptionSelected"
      v-if="optionsSelections.length > 0"
    />
  </div>
</template>

<script setup lang="ts">
import contactsJSON from "@/assets/messages_contacts.json";
import type { MessageAuthorInfo, MessageContents, MessageSections } from "@/models/messages";
import { isNone } from "@/utils";
import { makeMessagesChain, MessageChain } from "@/utils/messages";

const props = defineProps<{
  messageGroup: MessageSections[];
}>();

const chainInterval = ref<number>();
const messagesGroups = ref(props.messageGroup);
const messagesGenerator = ref<Generator<MessageChain, void, unknown>>();
const messagesQueue = ref<MessageContents[]>([]);
const optionsSelections = ref<MessageContents[]>([]);

function targetScroll(id: string) {
  nextTick(() => {
    const target = document.getElementById(id);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  });
}

const usedContacts = computed(() => {
  const contacts = {} as Record<string, MessageAuthorInfo>;
  for (const sections of messagesGroups.value) {
    for (const section of Object.values(sections.messages)) {
      if (!isNone(section.senderId)) {
        contacts[section.senderId] = contactsJSON[
          String(section.senderId) as MessagesContactsJSONKeys
        ] as MessageAuthorInfo;
      }
    }
  }
  return contacts;
});

function chainMessageOptions(message: MessageContents) {
  const { nextIds } = message;

  const mappedMessages = nextIds.map((id) => {
    const message = messagesGroups.value[0].messages[id];
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    return message;
  });

  optionsSelections.value = mappedMessages;
  targetScroll(`msg-opts-${mappedMessages[mappedMessages.length - 1].id}`);
}

function startGeneratorProcess() {
  chainInterval.value = setInterval(() => {
    // get the next message one by one from the chain, messages is a generator
    if (!messagesGenerator.value) {
      clearInterval(chainInterval.value);
      return;
    }
    const { value: message, done } = messagesGenerator.value.next();
    if (done) {
      clearInterval(chainInterval.value);
      return;
    }
    if (message) {
      // Check if messages if Player
      if (message.current.kind === "Player") {
        // Stop iteration, wait for user input
        clearInterval(chainInterval.value);
        const nextMessage = message.parent ?? message.current;
        chainMessageOptions(nextMessage);
      } else {
        messagesQueue.value.push(message.current);
        targetScroll(`msg-${message.current.id}`);
      }
    }
  }, 1000);
}

function startMessageChain(newValue: MessageSections[]) {
  console.log("Starting message chain", newValue[0].id);
  clearInterval(chainInterval.value);
  messagesGenerator.value = undefined;
  chainInterval.value = undefined;
  messagesQueue.value = [];
  optionsSelections.value = [];
  messagesGroups.value = newValue;

  const precomputedChain = makeMessagesChain(newValue[0]);
  messagesGenerator.value = precomputedChain;
  const firstVal = messagesGenerator.value.next();
  if (!firstVal.value) {
    return;
  }

  if (firstVal.value.current.kind === "Player") {
    messagesGenerator.value.return();
    const nextMessage = firstVal.value.parent ?? firstVal.value.current;
    chainMessageOptions(nextMessage);
    return;
  } else {
    messagesQueue.value.push(firstVal.value.current);
    startGeneratorProcess();
  }
}

function onMessageOptionSelected(message: MessageContents) {
  optionsSelections.value = [];
  // Push selection to queue
  messagesQueue.value.push(message);
  targetScroll(`msg-${message.id}`);
  // Create new chain
  const { nextIds } = message;
  if (!nextIds) return;
  if (nextIds.length > 1) {
    // TODO: Handle again
  } else {
    const nextChain = makeMessagesChain(messagesGroups.value[0], nextIds[0]);
    messagesGenerator.value = nextChain;
    startGeneratorProcess();
  }
}

watch(
  () => props.messageGroup,
  (newValue) => {
    startMessageChain(newValue);
  }
);
onMounted(() => {
  startMessageChain(props.messageGroup);
});
</script>
