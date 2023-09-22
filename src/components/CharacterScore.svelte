<script lang="ts">
	import type { ScoreCharacter } from "$lib/models/scores";
	import { getCharacterPath, type Character, getCharacterElement } from "$lib/models/characters";

	import characters from "../data/character.json";
	import CharacterHead from "./CharacterHead.svelte";
	import CharacterWeight from "./CharacterWeight.svelte";
	import { calculateMaximumPossibleValues } from "$lib";

	export let characterId: string;
	export let score: ScoreCharacter;
	export let className = "";

	const charData = characters[characterId as keyof typeof characters] as Character;
	if (charData === undefined) {
		throw new Error(`Character ${characterId} not found`);
	}

	let charPath: string;
	let charElement: string;
	let charName: string;
	let charIcon: string;

	$: {
		const charData = characters[characterId as keyof typeof characters] as Character;
		if (charData === undefined) {
			throw new Error(`Character ${characterId} not found`);
		}
		console.log(charData);
		charPath = getCharacterPath(charData.path);
		charElement = getCharacterElement(charData.element);
		charName = charData.name.replace("{NICKNAME}", "Trailblazer");
		charIcon = charData.icon;
	}
	$: maxScore = calculateMaximumPossibleValues(score);
</script>

<div class={`flex flex-col ${className}`}>
	<CharacterHead tag={characterId} name={charName} icon={charIcon} path={charPath} element={charElement} />

	<h4 class="text-lg mt-1"><span class="font-semibold">Max:</span> {maxScore}</h4>

	<h3 class="text-lg font-semibold mt-3 mb-1">Main Stats</h3>
	<div class="flex flex-row mt-1 mb-2">
		<div class="flex flex-col mr-2">
			<img src="/icon/RelicHead.png" class="w-14 h-14" alt="Relic Head Icon" />
			<h4 class="font-medium text-center tracking-wide text-gray-200 mt-1">Head</h4>
		</div>
		<CharacterWeight relicMode bind:weights={score.main["1"]} />
	</div>
	<div class="flex flex-row mt-1 mb-2">
		<div class="flex flex-col mr-2">
			<img src="/icon/RelicHand.png" class="w-14 h-14" alt="Relic Hand Icon" />
			<h4 class="font-medium text-center tracking-wide text-gray-200 mt-1">Hand</h4>
		</div>
		<CharacterWeight relicMode bind:weights={score.main["2"]} />
	</div>
	<div class="flex flex-row mt-1 mb-2">
		<div class="flex flex-col mr-2">
			<img src="/icon/RelicBody.png" class="w-14 h-14" alt="Relic Body Icon" />
			<h4 class="font-medium text-center tracking-wide text-gray-200 mt-1">Body</h4>
		</div>
		<CharacterWeight relicMode bind:weights={score.main["3"]} />
	</div>
	<div class="flex flex-row mt-1 mb-2">
		<div class="flex flex-col mr-2">
			<img src="/icon/RelicFoot.png" class="w-14 h-14" alt="Relic Foot Icon" />
			<h4 class="font-medium text-center tracking-wide text-gray-200 mt-1">Foot</h4>
		</div>
		<CharacterWeight relicMode bind:weights={score.main["4"]} />
	</div>
	<div class="flex flex-row mt-1 mb-2">
		<div class="flex flex-col mr-2">
			<img src="/icon/RelicPlanarOrb.png" class="w-14 h-14" alt="Relic Planar Orb Icon" />
			<h4 class="font-medium text-center tracking-wide text-gray-200 mt-1">Planar</h4>
			<span class="font-medium text-center tracking-wide text-gray-200">Orb</span>
		</div>
		<CharacterWeight relicMode bind:weights={score.main["5"]} />
	</div>
	<div class="flex flex-row mt-1 mb-2">
		<div class="flex flex-col mr-2">
			<img src="/icon/RelicPlanarRope.png" class="w-14 h-14" alt="Relic Planar Rope Icon" />
			<h4 class="font-medium text-center tracking-wide text-gray-200 mt-1">Planar</h4>
			<span class="font-medium text-center tracking-wide text-gray-200">Rope</span>
		</div>
		<CharacterWeight relicMode bind:weights={score.main["6"]} />
	</div>

	<h3 class="text-lg font-semibold mt-2 mb-2">Weights</h3>
	<CharacterWeight bind:weights={score.weight} />
</div>
