<template>
  <table class="table-fixed border border-gray-600 border-collapse">
    <thead class="bg-gray-700">
      <tr class="h-4 px-1">
        <th
          :class="`text-left py-2 px-1 ${mainStatsMode ? 'w-2/6' : 'w-1/6'} border border-gray-600`"
        >
          Stats
        </th>
        <th class="text-left py-2 px-1 w-4/6 border border-gray-600">Value</th>
      </tr>
    </thead>
    <tbody class="bg-gray-800">
      <tr v-for="[key, value] in Object.entries(weights)" :key="key" class="h-4 px-1">
        <td :class="`py-1 px-1 ${mainStatsMode ? 'w-2/6' : 'w-1/6'} border border-gray-600`">
          <span>{{ statsTypeToName(key as StatsType) }}</span>
        </td>
        <td class="border w-4/6 border-gray-600 bg-gray-900">
          <input
            class="bg-gray-900 form-input w-full h-full"
            type="text"
            min="0.0"
            max="1.0"
            step="0.1"
            :value="value"
            @keydown="(ev) => tableValueChanges(ev, key)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { type StatsType, type StatsTypeDict, statsTypeToName } from "@/models";
import { useScoresStore } from "@/stores";

const props = defineProps<{
  score: StatsTypeDict;
  mainStatsMode?: boolean;
  mainIndex?: string;
}>();

const scoresStore = useScoresStore();
const weights = ref<StatsTypeDict>(props.score);

function updateWeight(key: string, value: number) {
  console.log(key, value, isNaN(value), Number(value.toFixed(2)));
  if (isNaN(value)) {
    return;
  }

  value = Number(value.toFixed(2));

  if (value < 0.0 || value > 1.0) {
    return;
  }

  weights.value[key as StatsType] = value;
  if (props.mainStatsMode && props.mainIndex) {
    scoresStore.updateCurrentMain(props.mainIndex, weights.value);
  } else if (!props.mainStatsMode) {
    scoresStore.updateCurrentWeight(weights.value);
  }
}

function tableValueChanges(ev: KeyboardEvent, key: string) {
  // Change if arrow up or down is pressed
  const target = ev.currentTarget as HTMLInputElement;
  if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
    ev.preventDefault();
    const incr = ev.ctrlKey ? 0.01 : 0.1;

    switch (ev.key) {
      case "ArrowUp":
        updateWeight(key, parseFloat(target.value) + incr);
        break;
      case "ArrowDown":
        updateWeight(key, parseFloat(target.value) - incr);
        break;
    }
  } else {
    const value = parseFloat(target.value);
    updateWeight(key, value);
  }
}

watch(
  () => props.score,
  (newVal) => {
    weights.value = newVal;
  }
);
</script>
