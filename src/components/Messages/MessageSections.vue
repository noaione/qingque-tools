<template>
  <TransitionGroup tag="div" name="message-popup" v-if="isActive">
    <MessageContent
      :id="`msg-${message.id}`"
      :message="message"
      :author="!isNone(message.senderId) ? usedContacts[message.senderId] : undefined"
      :key="message.id"
      :class="index > 0 ? (index === messagesQueue.length - 1 ? 'mb-6 mt-2' : 'my-2') : 'mb-2'"
      @play="onVideoPlay"
      v-for="(message, index) in messagesQueue"
    />
  </TransitionGroup>
  <MessageMission v-if="activeMission" :mission="activeMission" />
  <MessageVideoPlayer v-if="activeVideo" :message="activeVideo" @close="onVideoClose" />
</template>

<script setup lang="ts">
import contactsJSON from "@/assets/message_contacts.json";
import {
  type MessageAuthorInfo,
  type MessageContents,
  type MessageContentSeparator,
  type MessageContentVideo,
  type MessageMission,
  type MessageSections
} from "@/models/messages";
import { isNone } from "@/utils";
import {
  makeMessagesChain,
  MessageChain,
  type MessageContentsWithGroup,
  messageKey,
  messageOptionKey,
  targetMessageScroll
} from "@/utils/messages";

const props = defineProps<{
  messageSection: MessageSections;
  hasMore?: boolean;
}>();
const emits = defineEmits<{
  (e: "completed", id: number): void;
  (e: "choices", choices: MessageContents[]): void;
}>();

const activeSections = inject(messageKey) as Ref<readonly number[]>;
const selectedOption = inject(messageOptionKey) as Ref<MessageContentsWithGroup | undefined>;
console.log("Injection active sections", activeSections);

const chainInterval = ref<number>();
const completed = ref(false);
const messagesGroups = ref(props.messageSection);
const messagesGenerator = ref<Generator<MessageChain, void, unknown>>();
const messagesQueue = ref<MessageContents[]>([]);
const activeMission = ref<MessageMission>();
const activeVideo = ref<MessageContentVideo>();

const isActive = computed(() => {
  return activeSections.value.includes(props.messageSection.id);
});

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

function chainMessageOptionsByIds(startIds: number[]) {
  const mappedMessages = startIds.map((id) => {
    const message = messagesGroups.value.messages[id];
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    return message;
  });

  emits("choices", mappedMessages);
}

function chainMessageOptions(message: MessageContents) {
  const { nextIds } = message;
  chainMessageOptionsByIds(nextIds);
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

function emitCompleteOnDelay(delay: number = 500) {
  if (delay <= 0) {
    emits("completed", messagesGroups.value.id);
    return;
  }

  setTimeout(() => {
    emits("completed", messagesGroups.value.id);
  }, delay);
}

function setSectionAsComplete() {
  console.log("Section completed", messagesGroups.value.id);
  clearInterval(chainInterval.value);
  completed.value = true;
  if (props.hasMore) {
    // add separator
    const separator = createSectionSeparator();
    messagesQueue.value.push(createSectionSeparator());
    targetMessageScroll(`msg-${separator.id}`);
  }
  nextTick(() => {
    setTimeout(() => {
      console.log("Starting message mission animation", messagesGroups.value.id);
      if (messagesGroups.value.type === "MissionMessage") {
        activeMission.value = messagesGroups.value.mission;
        nextTick(() => {
          emitCompleteOnDelay(2000);
        });
      } else {
        emitCompleteOnDelay(0);
      }
    }, 300);
  });
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
      if (message.current.type === "Video") {
        clearInterval(chainInterval.value);
        messagesQueue.value.push(message.current);
        targetMessageScroll(`msg-${message.current.id}`);

        return;
      }

      if (message.current.kind === "Player") {
        // Stop iteration, wait for user input
        clearInterval(chainInterval.value);
        const nextMessage = message.parent ?? message.current;
        chainMessageOptions(nextMessage);
      } else {
        messagesQueue.value.push(message.current);
        targetMessageScroll(`msg-${message.current.id}`);
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
  messagesGroups.value = newValue;

  const precomputedChain = makeMessagesChain(newValue);
  messagesGenerator.value = precomputedChain;
  const firstVal = messagesGenerator.value.next();
  if (!firstVal.value) {
    return;
  }

  if (firstVal.value.current.kind === "Player") {
    messagesGenerator.value.return();
    chainMessageOptionsByIds(messagesGroups.value.startIds);
    return;
  } else {
    messagesQueue.value.push(firstVal.value.current);
    startGeneratorProcess();
  }
}

function onMessageOptionSelected(message: MessageContents) {
  // Push selection to queue
  messagesQueue.value.push(message);
  targetMessageScroll(`msg-${message.id}`);
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

function onVideoPlay(videoMsg: MessageContentVideo) {
  activeVideo.value = videoMsg;
}

function onVideoClose(videoMsg: MessageContentVideo) {
  activeVideo.value = undefined;
  const { nextIds } = videoMsg;
  if (!nextIds.length) {
    setSectionAsComplete();
    return;
  }

  // check if we have more than one option
  if (nextIds.length > 1) {
    // if yes, we need to show the options
    chainMessageOptionsByIds(nextIds);
  } else {
    // if not, continue the chain
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
watch(
  () => selectedOption.value,
  (newOption) => {
    console.log("Selected option changed", newOption);
    if (newOption && newOption.groupId === props.messageSection.id) {
      selectedOption.value = undefined;
      onMessageOptionSelected(newOption.contents);
    }
  }
);
onMounted(() => {
  if (activeSections.value.includes(props.messageSection.id)) {
    startMessageChain(props.messageSection);
  }
});
</script>

<style scoped lang="postcss">
.message-popup-enter-active,
.message-select-enter-active {
  transition: all 0.3s ease-out;
}

.message-popup-leave-active,
.message-select-leave-active {
  transition: all 0.25s ease-in-out;
}

.message-popup-enter-from {
  transform: translateY(2rem);
  opacity: 0;
}
.message-select-enter-from {
  transform: translateY(1rem);
  opacity: 0;
}

.message-select-leave-to {
  opacity: 0;
}
</style>
