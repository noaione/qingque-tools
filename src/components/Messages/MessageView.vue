<template>
  <div class="flex" />
</template>

<script setup lang="ts">
import contactsJSON from "@/assets/messages_contacts.json";
import type { MessageAuthorInfo, MessageSections } from "@/models/messages";
import { isNone } from "@/utils";

const props = defineProps<{
  messageGroup: MessageSections;
}>();

const usedContacts = computed(() => {
  const contacts = {} as Record<string, MessageAuthorInfo>;
  for (const section of Object.values(props.messageGroup.messages)) {
    if (!isNone(section.senderId)) {
      contacts[section.senderId] = contactsJSON[
        String(section.senderId) as MessagesContactsJSONKeys
      ] as MessageAuthorInfo;
    }
  }
  return contacts;
});
</script>
