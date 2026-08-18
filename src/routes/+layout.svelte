<script lang="ts">
	import "./layout.css"
	import favicon from "#lib/assets/favicon.svg"
	import { getIsAdmin, getLoggedIn, login } from "./data.remote"

	let { children } = $props()

	const user = $derived(await getLoggedIn())
	const isAdmin = $derived(await getIsAdmin())
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="px-4 max-w-280 mx-auto flex">
	<nav>
		<ul class="list-none p-0 m-0 flex gap-8 py-6">
			{#if user}
				<li><a class="btn" href="/home">Home</a></li>
			{:else}
				<li><a class="btn" href="/">Landing</a></li>
			{/if}
				<li><a class="btn" href="/guide">Guide</a></li>
			{#if user}
				<li><a class="btn" href="/submit">Submit</a></li>
				{#if isAdmin}
					<li><a class="btn" href="/admin">Admin</a></li>
				{/if}
			{:else}
				<li>
					<form {...login} class="-mt-1.5">
						<!-- why wrong paddingg ggggg -->
						<button class="btn" type="submit">Login</button>
					</form>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<main class="px-4 py-20 max-w-240 mx-auto flex-1">
	{@render children()}
</main>

<footer class="bg-stone-950 px-8 py-4 text-center">
	<p class="pb-4">
		A programme by <a href="https://hackclub.enterprise.slack.com/team/U07JH9LU1NC" target="_blank" rel="noreferrer">@Heliodex</a> at <a href="https://hackclub.com/" target="_blank" rel="noreferrer">Hack Club</a>!
	</p>

	<p>
		<a href="https://hackclub.com/privacy-and-terms" target="_blank" rel="noreferrer">Privacy & Terms</a> |
		<a href="https://github.com/Heliodex/ysws2" target="_blank" rel="noreferrer">Source code</a>
	</p>
</footer>

<style>
	@import "tailwindcss";

	li {
		@apply inline-block;

		a, button {
			@apply text-black  bg-[#f7df1e] hover:bg-yellow-600 active:bg-yellow-400 shadow-amber-500;

			box-shadow: 0.1rem 0.1rem 0 var(--tw-shadow-color);
		}
	}
</style>
