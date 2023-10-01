<template>
  <div v-if="parsedModel !== undefined" class="flex flex-row">
    <div class="object-contain">
      <img class="w-20 h-20 rounded-lg" :src="parsedModel.icon" :alt="parsedModel.name" />
    </div>
    <div class="flex flex-col ml-2">
      <h3 :id="parsedModel.tag" class="text-lg">
        <span class="font-bold">{{ parsedModel.name }}</span>
      </h3>
      <div class="flex flex-row items-center">
        <p><span class="font-bold">Element:</span> {{ parsedModel.element }}</p>
        <img class="w-4 h-4 ml-1" :src="parsedModel.elementImg" :alt="parsedModel.element" />
      </div>
      <div class="flex flex-row items-center">
        <p><span class="font-bold">Path:</span> {{ parsedModel.path }}</p>
        <img class="w-4 h-4 ml-1" :src="parsedModel.pathImg" :alt="parsedModel.path" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCharacterElement, getCharacterPath } from "@/models";
import type { SCStoreWithModel } from "@/stores";

const props = defineProps<{
  data: SCStoreWithModel;
}>();

const IMGBASE = "https://raw.githubusercontent.com/naoTimesdev/qingque-data/master/";

// make a proper getter for this
const parsedModel = computed(() => {
  if (props.data) {
    const element = getCharacterElement(props.data.model.element);
    const path = getCharacterPath(props.data.model.path);
    let name = props.data.model.name;
    if (name.includes("{NICKNAME}")) {
      name = name.replace("{NICKNAME}", "Trailblazer") + ` (${path}/${element})`;
    }
    return {
      name,
      tag: props.data.model.tag,
      icon: `${IMGBASE}${props.data.model.icon}`,
      elementImg: `${IMGBASE}icon/element/${element}.png`,
      element,
      pathImg: `${IMGBASE}icon/path/${path}.png`,
      path
    };
  }
  return undefined;
});
</script>
