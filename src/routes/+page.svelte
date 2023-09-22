<script lang="ts">
	import ScoringUploader from "../views/ScoringUploader.svelte";
	import ScoringEditor from "../views/ScoringEditor.svelte";
	import type { ScoreCharacterJSON } from "$lib/models/scores";
	import { calculateMaximumPossibleValues, type ScoringData } from "$lib/scoring";

	let scoreData: ScoringData[] = [];

	function onScoreLoad(scoreJSON: ScoreCharacterJSON) {
		const scoreDataTemp = [];
		for (const [charId, charScore] of Object.entries(scoreJSON)) {
			scoreDataTemp.push({
				id: charId,
				data: charScore
			});
		}
		scoreData = scoreDataTemp;
	}

	function onScoreRemove() {
		scoreData = [];
	}

	function onScoreSave() {
		console.log("Saving...");
		const scoreJSON: ScoreCharacterJSON = {};
		for (const { id, data } of scoreData) {
			scoreJSON[id] = {
				...data,
				max: calculateMaximumPossibleValues(data)
			};
		}

		const blob = new Blob([JSON.stringify(scoreJSON, undefined, 4)], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.style.display = "none";
		a.href = url;
		a.download = "QingqueScoring.json";
		a.click();
		URL.revokeObjectURL(url);
		a.remove();
	}
</script>

<main class="py-2">
	<div class="flex flex-col mt-4 mb-5 items-center">
		<h1 class="text-3xl font-bold">Qingque Scoring</h1>
		<p class="text-lg mt-2">A web editor for scoring system used by Qingque Bot</p>
	</div>
	<ScoringUploader {onScoreLoad} {onScoreRemove} {onScoreSave} />
	{#if scoreData.length > 0}
		<ScoringEditor {scoreData} />
	{/if}
</main>
