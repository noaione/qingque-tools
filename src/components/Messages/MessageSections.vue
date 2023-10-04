<template>
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
</template>

<script setup lang="ts">
import contactsJSON from "@/assets/messages_contacts.json";
import type {
  MessageAuthorInfo,
  MessageContents,
  MessageContentSeparator,
  MessageSections
} from "@/models/messages";
import { isNone } from "@/utils";
import { makeMessagesChain, MessageChain, messageKey } from "@/utils/messages";

const props = defineProps<{
  messageSection: MessageSections;
  hasMore?: boolean;
}>();
const emits = defineEmits<{
  (e: "completed", id: number): void;
}>();

const activeSections = inject(messageKey) as Ref<number[]>;
console.log("Injection active sections", activeSections);

const chainInterval = ref<number>();
const completed = ref(false);
const messagesGroups = ref(props.messageSection);
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
  for (const section of Object.values(props.messageSection.messages)) {
    if (!isNone(section.senderId)) {
      contacts[section.senderId] = contactsJSON[
        String(section.senderId) as MessagesContactsJSONKeys
      ] as MessageAuthorInfo;
    }
  }
  return contacts;
});

function chainMessageOptions(message: MessageContents) {
  const { nextIds } = message;

  const mappedMessages = nextIds.map((id) => {
    const message = messagesGroups.value.messages[id];
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    return message;
  });

  optionsSelections.value = mappedMessages;
  targetScroll(`msg-opts-${mappedMessages[mappedMessages.length - 1].id}`);
}

function createSectionSeparator(): MessageContentSeparator {
  const lastmsg = messagesQueue.value[messagesQueue.value.length - 1];

  return {
    id: lastmsg.id + 999999,
    kind: "System",
    sectionId: lastmsg.sectionId,
    senderId: null,
    text: "---",
    option: null,
    nextIds: [],
    type: "SectionSeparator"
  };
}

function setSectionAsComplete() {
  console.log("Section completed", messagesGroups.value.id);
  clearInterval(chainInterval.value);
  completed.value = true;
  if (props.hasMore) {
    // add separator
    const separator = createSectionSeparator();
    messagesQueue.value.push(createSectionSeparator());
    targetScroll(`msg-${separator.id}`);
  }
  emits("completed", messagesGroups.value.id);
}

function startGeneratorProcess() {
  chainInterval.value = setInterval(() => {
    // get the next message one by one from the chain, messages is a generator
    if (!messagesGenerator.value) {
      clearInterval(chainInterval.value);
      return;
    }
    const { value: message, done } = messagesGenerator.value.next();
    console.log(message, done);
    if (done) {
      setSectionAsComplete();
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

function startMessageChain(newValue: MessageSections) {
  if (completed.value) return;

  console.log("Starting message chain", newValue.id);
  clearInterval(chainInterval.value);
  messagesGenerator.value = undefined;
  chainInterval.value = undefined;
  messagesQueue.value = [];
  optionsSelections.value = [];
  messagesGroups.value = newValue;

  const precomputedChain = makeMessagesChain(newValue);
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
  if (!nextIds.length) {
    setSectionAsComplete();
    return;
  }
  if (nextIds.length > 1) {
    // TODO: Handle again
  } else {
    const nextChain = makeMessagesChain(messagesGroups.value, nextIds[0]);
    messagesGenerator.value = nextChain;
    startGeneratorProcess();
  }
}

watch(
  () => activeSections.value,
  (newSections) => {
    console.log("Active sections changed", newSections);
    if (newSections.includes(props.messageSection.id)) {
      startMessageChain(props.messageSection);
    }
  }
);
onMounted(() => {
  if (activeSections.value.includes(props.messageSection.id)) {
    startMessageChain(props.messageSection);
  }
});
</script>
