<template>
  <button
    :class="`btn-basic bg-purple-600 hover:bg-purple-500 ${$props.class ?? ''}`"
    @click="modal = true"
  >
    Settings
  </button>
  <ModalView :show="modal" @close="modal = false">
    <template #header>
      <h3 class="text-xl font-bold">Settings</h3>
    </template>
    <template #footer>
      <div class="flex flex-row gap-2">
        <button class="btn-basic bg-red-600 hover:bg-red-500" @click="modal = false">Close</button>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex flex-col">
        <label class="text-gray-200 mb-1">Name</label>
        <input
          type="text"
          class="form-input rounded-md bg-gray-900"
          placeholder="Name..."
          maxlength="20"
          :value="tbName"
          @change="tbName = ($event.currentTarget as HTMLInputElement)?.value"
        />
      </div>
      <div class="flex flex-col mt-2">
        <label class="text-gray-200 mb-1">Gender</label>
        <select
          class="form-select bg-gray-900 text-gray-100"
          :value="tbGender"
          @change="tbGender = ($event.currentTarget as HTMLSelectElement)?.value"
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
    </div>
  </ModalView>
</template>

<script setup lang="ts">
import { useMessageConfigStorage } from "@/utils";

defineProps<{
  class?: string;
}>();

const modal = ref(false);

const tbName = useMessageConfigStorage("tbName", "Trailblazer");
const tbGender = useMessageConfigStorage("tbGender", "M");
</script>

<style scoped lang="postcss">
.btn-basic {
  @apply transition-colors px-4 py-2 rounded-md font-bold disabled:cursor-not-allowed;
}
</style>
