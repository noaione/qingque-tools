<script lang="ts">
	import { statsTypeToName, type StatsType, type StatsTypeDict, statsTypeToIcon } from "$lib/models/scores";

	export let weights: StatsTypeDict;
	export let relicMode = false;
	export let validWeights: StatsType[] = [];

	const IMGBASE = "https://raw.githubusercontent.com/naoTimesdev/qingque-data/master/";
	type KVNum = {
		key: StatsType;
		value: number;
	};

	let actualWeights: KVNum[] = [];
	for (const [key, value] of Object.entries(weights)) {
		actualWeights.push({ key: key as StatsType, value });
	}
	if (validWeights.length > 0) {
		for (const key of validWeights) {
			const index = actualWeights.findIndex((x) => x.key === key);
			// if missing, add it
			if (index === -1) {
				actualWeights.push({ key, value: 0.0 });
			}
		}
	}

	// Check if actualWeights changed
	$: {
		const newWeights = actualWeights
			.map(({ key, value }) => ({ [key]: value }))
			.reduce((a, b) => ({ ...a, ...b }), {});
		if (JSON.stringify(newWeights) !== JSON.stringify(weights)) {
			weights = newWeights as StatsTypeDict;
		}
	}
</script>

<table class="table-fixed border border-gray-600 border-collapse">
	<thead class="bg-gray-700">
		<tr class=" h-4 px-1">
			<th class={`text-left py-2 px-1 ${relicMode ? "w-2/6" : "w-1/6"} border border-gray-600`}>Stats</th>
			<th class="text-left py-2 px-1 w-4/6 border border-gray-600">Value</th>
		</tr>
	</thead>
	<tbody class="bg-gray-800">
		{#each actualWeights as { key, value }}
			<tr>
				<td class={`px-1 py-1 border ${relicMode ? "w-2/6" : "w-1/6"} border-gray-600`}>
					<div class="flex flex-row items-center">
						<img class="w-5 h-5" src={IMGBASE + statsTypeToIcon(key)} alt={key + " Icon"} />
						<span class="ml-1">{statsTypeToName(key)}</span>
					</div>
				</td>
				<td class=" border w-4/6 border-gray-600 bg-gray-900">
					<input
						class="bg-gray-900 form-input w-full h-full"
						type="number"
						min="0.0"
						max="1.0"
						step="0.1"
						bind:value
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
