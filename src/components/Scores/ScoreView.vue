<template>
  <div v-if="scoresStore.currentWithModel" class="flex flex-col mt-2">
    <ScoreHead :data="scoresStore.currentWithModel" />
    <h4 class="text-lg mt-1">
      <span class="font-semibold">Max:</span>
      {{ scoresStore.currentWithModel.max.toLocaleString() }}
    </h4>
    <h3 class="text-lg font-semibold mt-3 mb-1">Main Stats</h3>
    <ScoreMainStats
      name="Head"
      alt="Relic Head Icon"
      icon="/assets/icon/RelicHead.webp"
      index="1"
      :score="scoresStore.currentWithModel.data.main[1]"
    />
    <ScoreMainStats
      name="Hand"
      alt="Relic Hand Icon"
      icon="/assets/icon/RelicHand.webp"
      index="2"
      :score="scoresStore.currentWithModel.data.main[2]"
    />
    <ScoreMainStats
      name="Body"
      alt="Relic Body Icon"
      icon="/assets/icon/RelicBody.webp"
      index="3"
      :score="scoresStore.currentWithModel.data.main[3]"
    />
    <ScoreMainStats
      name="Foot"
      alt="Relic Foot Icon"
      icon="/assets/icon/RelicFoot.webp"
      index="4"
      :score="scoresStore.currentWithModel.data.main[4]"
    />
    <ScoreMainStats
      name="Planar Orb"
      alt="Relic Planar Orb Icon"
      icon="/assets/icon/RelicPlanarOrb.webp"
      index="5"
      :score="scoresStore.currentWithModel.data.main[5]"
    />
    <ScoreMainStats
      name="Planar Rope"
      alt="Relic Planar Rope Icon"
      icon="/assets/icon/RelicPlanarRope.webp"
      index="6"
      :score="scoresStore.currentWithModel.data.main[6]"
    />
    <h3 class="text-lg font-semibold mt-3 mb-1">Weights</h3>
    <ScoreTable :score="scoresStore.currentWithModel.data.weight" />
  </div>
</template>

<script setup lang="ts">
import { useScoresStore } from "@/stores/scores";

const scoresStore = useScoresStore();
</script>
