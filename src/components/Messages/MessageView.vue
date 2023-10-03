<template>
  <div class="flex flex-col w-full min-h-screen bg-neutral-800">
    <MessageContent
      :message="message"
      :author="!isNone(message.senderId) ? usedContacts[message.senderId] : undefined"
      :key="message.id"
      :class="index > 0 ? (index === messagesTree.length - 1 ? 'mb-6 mt-2' : 'my-2') : 'mb-2'"
      v-for="(message, index) in messagesTree"
    />
  </div>
</template>

<script setup lang="ts">
import contactsJSON from "@/assets/messages_contacts.json";
import type { MessageAuthorInfo, MessageSections } from "@/models/messages";
import { isNone } from "@/utils";
import { makeMessagesChain } from "@/utils/messages";

const props = defineProps<{
  messageGroup: MessageSections[];
}>();

const messagesTree = computed(() => {
  return makeMessagesChain(props.messageGroup[0]);
});

const usedContacts = computed(() => {
  const contacts = {} as Record<string, MessageAuthorInfo>;
  for (const sections of props.messageGroup) {
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
</script>
