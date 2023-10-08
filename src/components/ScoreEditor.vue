<template>
  <div class="mt-4 mx-auto lg:mx-4 flex flex-col">
    <h2 class="text-2xl font-bold">Editor</h2>
    <hr class="mt-4 border-gray-500" />
    <div v-if="scores.loaded" class="flex flex-row justify-start mt-4 mb-2 gap-2">
      <button class="btn-basic bg-green-700 hover:bg-green-600" @click="addModal = true">Add New</button>
      <button class="btn-basic bg-red-700 hover:bg-red-600" @click="removeConfirm = true">Remove this</button>
    </div>
    <ScoreSelector v-if="scores.loaded" />
    <div v-if="scores.currentWithModel" class="flex flex-col gap-2 mt-3">
      <ScoreView />
    </div>
  </div>
  <ScoresAdd :show="addModal" @close="addModal = false" />
  <ModalView :show="removeConfirm" @close="removeConfirm = false">
    <template #header>
      <h3 class="text-xl font-bold">Are you sure?</h3>
    </template>
    <template #footer>
      <div class="flex flex-row gap-2">
        <button class="btn-basic bg-red-600 hover:bg-red-500" @click="removeScoreKey">Remove</button>
        <button class="btn-basic bg-gray-600 hover:bg-gray-500" @click="removeConfirm = false">Cancel</button>
      </div>
    </template>

    <div class="flex flex-col">
      <span>
        Are you sure you want to remove:
        <span class="font-bold">{{ scores.currentWithModel?.model.name ?? "Unknown" }}</span> ({{
          scores.current?.id
        }})
      </span>
      <span class="mt-1">This will also remove all scores associated with this character.</span>
    </div>
  </ModalView>
</template>

<script setup lang="ts">
import { useScoresStore } from "@/stores";

const scores = useScoresStore();

const addModal = ref(false);
const removeConfirm = ref(false);

function removeScoreKey() {
  if (scores.current) {
    scores.removeCharacter(scores.current.id);
  }
  removeConfirm.value = false;
}
</script>

<style scoped lang="postcss">
.btn-basic {
  @apply transition-colors px-4 py-2 rounded-md font-bold;
}
</style>
