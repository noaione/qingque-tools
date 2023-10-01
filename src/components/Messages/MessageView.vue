<template>
  <div class="flex" />
</template>

<script setup lang="ts">
import type { MessageSections } from "@/models/messages";

defineProps<{
  messageGroup: MessageSections;
}>();
</script>
