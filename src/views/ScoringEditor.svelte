<script lang="ts">
	import type { ScoringData } from "$lib";
	import CharacterScore from "../components/CharacterScore.svelte";

	export let scoreData: ScoringData[];

	scoreData.sort((a, b) => a.id.localeCompare(b.id));
</script>

<div class="mt-4 mx-auto lg:mx-4 flex flex-col">
	<h2 class="text-2xl font-bold">Editor</h2>
	<hr class="mt-4 border-gray-500" />
	<div class="flex flex-col gap-2">
		{#each scoreData as { id, data }}
			<CharacterScore className="mt-2" characterId={id} bind:score={data} />
		{/each}
	</div>
</div>
