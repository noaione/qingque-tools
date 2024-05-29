<template>
  <ModalView :show="modal" @close="modal = false">
    <template #header>
      <h3 class="text-xl font-bold">Add New</h3>
    </template>
    <template #footer>
      <div class="flex flex-row gap-2">
        <button
          class="btn-basic btn-green-add"
          @click="addCharacter"
          :disabled="missingCharacters.length < 1"
        >
          Add
        </button>
        <button class="btn-basic bg-red-600 hover:bg-red-500" @click="emit('close')">Cancel</button>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex flex-col">
        <label class="text-gray-200 mb-2 font-semibold">Character</label>
        <select
          class="form-select bg-gray-900 rounded-md text-gray-100"
          :value="valueId"
          :disabled="missingCharacters.length < 1"
          @change="onSelectChara"
        >
          <option v-for="chara in missingCharacters" :key="chara.tag" :value="chara.id">
            {{ getName(chara) }}
          </option>
        </select>
      </div>
    </div>
  </ModalView>
</template>

<script setup lang="ts">
import characterJSON from "@/assets/characters.json";
import { type Character, getCharacterPath } from "@/models/characters";
import { useScoresStore } from "@/stores";

const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const modal = ref(false);
const valueId = ref<string>();
const stores = useScoresStore();

const missingCharacters = computed(() => {
  const ignoredIds = ["8002", "8003", "8006"];

  const scoreIds = stores.scores.map((s) => s.id);
  const charaIds = Object.keys(characterJSON);

  // Find charaIds that are not in scoreIds
  const missingIds = charaIds.filter((id) => !scoreIds.includes(id)).filter((id) => !ignoredIds.includes(id));
  if (missingIds.length === 0) {
    return [];
  }

  return missingIds.map((id) => characterJSON[id as keyof typeof characterJSON]) as Character[];
});

function getName(model: Character) {
  if (model.name.includes("{NICKNAME}")) {
    return (
      model.name.replace("{NICKNAME}", "Trailblazer") + ` (${getCharacterPath(model.path)}/${model.element})`
    );
  }
  return model.name;
}

function onSelectChara(e: Event) {
  const target = e.currentTarget as HTMLSelectElement;
  const id = target.value;
  if (id) {
    valueId.value = id;
  }
}

function addCharacter() {
  stores.addCharacter(valueId.value ?? "");
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
