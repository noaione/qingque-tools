<template>
  <ModalView :show="modal">
    <template #header>
      <h3 class="text-xl font-bold">Add New</h3>
    </template>
    <template #footer>
      <div class="flex flex-row gap-2">
        <button
          class="btn-basic btn-green-add"
          @click="addCharacter"
          :disabled="charaExist || !charaInGame"
        >
          Add
        </button>
        <button class="btn-basic bg-red-600 hover:bg-red-500" @click="emit('close')">Cancel</button>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex flex-col">
        <label class="text-gray-200 mb-1">ID</label>
        <input
          type="number"
          class="form-input rounded-md bg-gray-900"
          placeholder="ID"
          :value="valueId"
          @change="valueId = ($event.currentTarget as HTMLInputElement)?.value"
        />
      </div>
      <div class="flex flex-col mt-4">
        <label class="text-gray-200">Character:</label>
        <p class="font-bold">{{ charaName }}</p>
      </div>
    </div>
  </ModalView>
</template>

<script setup lang="ts">
import characterJSON from "@/assets/characters.json";
import { useScoresStore } from "@/stores";
import { isNone } from "@/utils";
import { computed } from "vue";
import { watch } from "vue";
import { ref } from "vue";

const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const modal = ref(false);
const valueId = ref<string>();
const stores = useScoresStore();

function isCharaExist(charaId: string) {
  const charaFound = stores.scoresWithModel.find((score) => score.model.id === charaId);
  return charaFound !== undefined;
}

const charaExist = computed(() => {
  return isCharaExist(valueId.value ?? "");
});
const charaInGame = computed(() => {
  if (isNone(valueId.value)) {
    return false;
  }
  const charaInfo = characterJSON[valueId.value as keyof typeof characterJSON];
  return charaInfo !== undefined;
});

const charaName = computed(() => {
  if (isNone(valueId.value)) {
    return "Waiting...";
  }

  const charaInfo = characterJSON[valueId.value as keyof typeof characterJSON];

  let charaNameEx = charaInfo?.name;
  if (charaExist.value && charaNameEx !== undefined) {
    charaNameEx += " (Already exist!)";
  }

  return charaNameEx ?? "Not found!";
});

function addCharacter() {
  if (charaExist.value) {
    return;
  }
  // stores.addCharacter();
  emit("close");
}

watch(
  () => props.show,
  (value) => {
    modal.value = value;
  }
);
</script>

<style scoped lang="postcss">
.btn-basic {
  @apply transition-colors px-4 py-2 rounded-md font-bold disabled:cursor-not-allowed;
}

.btn-green-add {
  @apply bg-green-600 hover:bg-green-500 disabled:bg-green-700 disabled:hover:bg-green-700;
}
</style>
