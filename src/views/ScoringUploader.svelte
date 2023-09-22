<script lang="ts">
	import { ScoreValidationError, validateScoreJSON } from "$lib";
	import type { ScoreCharacterJSON } from "$lib/models/scores";

	// Callback function for when the user selects a file
	export let onScoreLoad: (scoreJSON: ScoreCharacterJSON) => void;
	export let onScoreRemove: () => void;
	export let onScoreSave: () => void;
	let loading = false;
	let errorMessage: string | null = null;

	let loaded = false;

	// Handle file input to read data locally.

	type HandleFileInput = Event & { currentTarget: EventTarget & HTMLInputElement };

	function handleFileInput(ev: HandleFileInput) {
		onScoreRemove();
		const files = ev.currentTarget.files;
		if (files === null) return;
		const file = files[0];
		if (file.type !== "application/json") {
			errorMessage = "File must be a JSON file.";
			return;
		}
		console.info(`Loading: ${file.name}`);
		loaded = false;
		loading = true;
		const reader = new FileReader();

		// read as text
		reader.readAsText(file, "utf-8");

		reader.onload = () => {
			const result = reader.result;
			if (typeof result !== "string") {
				errorMessage = "File must be a JSON file.";
				return;
			}

			try {
				const scoreJSON = JSON.parse(result);
				validateScoreJSON(scoreJSON);
				// Delete MC dupes
				delete scoreJSON["8002"]; // Fem MC: Physical
				delete scoreJSON["8003"]; // Male MC: Fire
				onScoreLoad(scoreJSON);
			} catch (e) {
				if (e instanceof ScoreValidationError) {
					errorMessage = e.message;
					return;
				} else {
					errorMessage = "An unknown error occurred.";
				}
			} finally {
				loading = false;
				loaded = true;
			}
		};
	}
</script>

<div class="flex flex-col items-center mt-2">
	<h2 class="text-xl font-semibold">Score Files</h2>
	<div class="flex flex-row mt-6 items-center gap-2">
		<div class="upload-area">
			<label
				for="score-upload"
				class="bg-cyan-700 hover:bg-cyan-600 select-none pb-2 active:bg-cyan-600 hover:text-gray-50 transition-colors px-4 py-2 rounded-md font-bold"
				aria-disabled={loading}
			>
				Upload
			</label>
			<input
				id="score-upload"
				type="file"
				accept="application/json"
				on:change={handleFileInput}
				disabled={loading}
			/>
		</div>
		{#if loaded}
			<button
				class="bg-green-700 hover:bg-green-600 active:bg-green-600 hover:text-gray-50 transition-colors px-4 py-2 rounded-md font-bold"
				on:click={onScoreSave}
			>
				Save
			</button>
			<button
				class="bg-red-700 hover:bg-red-600 active:bg-red-600 hover:text-gray-50 transition-colors px-4 py-2 rounded-md font-bold"
				on:click={() => {
					loaded = false;
					onScoreRemove();
				}}
			>
				Clear
			</button>
		{/if}
	</div>

	{#if errorMessage !== null}
		<div class="mt-2 text-red-500">{errorMessage}</div>
	{/if}
</div>

<style lang="postcss">
	.upload-area > input[type="file"] {
		display: none;
	}

	.upload-area > label[aria-disabled="true"] {
		cursor: not-allowed;
		background-color: theme(colors.cyan.600) !important;
	}
</style>
