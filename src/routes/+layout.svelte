<script>
	import "../app.css";
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.900);
		color: theme(colors.gray.100);
	}
</style>
