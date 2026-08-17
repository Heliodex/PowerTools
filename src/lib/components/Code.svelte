<script lang="ts">
	const { code }: { code: string } = $props()

	function countTabs(line: string): number {
		return line.split("\t").length - 2
	}

	const lines = $derived(code.split("\n").slice(1, -1).map(line => [
		countTabs(line),
		line.trim()
	] as [number, string]))
</script>

<div class="w-150">
	{#each lines as [indent, line]}
		{let padding = `padding-left: ${indent + 0.5}rem`}

		{#if line.startsWith("+")}
			<code class="bg-blue-500" style={padding}>{line.substring(1)}</code>
		{:else if line.startsWith("-")}
			<code class="bg-red-500" style={padding}>{line.substring(1)}</code>
		{:else}
			<code style={padding}>{line}</code>
		{/if}
	{/each}
</div>

<style>
	code {
		height: 1.2rem;
		display: block;
	}
</style>
