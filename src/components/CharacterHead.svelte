<script lang="ts">
	export let tag: string;
	export let name: string;
	export let icon: string;
	export let path: string;
	export let element: string;

	const IMGBASE = "https://raw.githubusercontent.com/naoTimesdev/qingque-data/master/";
</script>

<div class="flex flex-row">
	<div class="object-contain">
		<img class="w-20 h-20 rounded-lg" src={`${IMGBASE}${icon}`} alt={name + " Icon"} />
	</div>
	<div class="flex flex-col ml-2">
		<h3 id={tag} class="text-lg">
			<span class="font-bold">{name}</span>
		</h3>
		<div class="flex flex-row items-center">
			<p><span class="font-bold">Element:</span> {element}</p>
			<img class="w-4 h-4 ml-1" src={`${IMGBASE}/icon/element/${element}.png`} alt={element + " Icon"} />
		</div>
		<div class="flex flex-row items-center">
			<p><span class="font-bold">Path:</span> {path}</p>
			<img class="w-4 h-4 ml-1" src={`${IMGBASE}/icon/path/${path}.png`} alt={path + " Icon"} />
		</div>
	</div>
</div>
