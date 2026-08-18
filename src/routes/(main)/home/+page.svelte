<script lang="ts">
	import { getLapseData, logout } from "../api.remote"

	const lapseData = $derived(await getLapseData())
</script>

<h1>You are logged in</h1>

Wanna <a href="/submit">submit</a>?

{#if lapseData}
	<h2 class="pt-4">Your Lapse account</h2>
	{#if lapseData.profilePictureUrl}
		<img
			src={lapseData.profilePictureUrl}
			alt="Lapse profile"
			class="w-16 h-16 rounded-full" />
	{/if}
	<p>ID: {lapseData.id}</p>
	<p>Handle: {lapseData.handle}</p>
	<p>Display name: {lapseData.displayName}</p>
{:else}
	<a
		class="btn text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-400"
		href="/auth/lapse">
		Link Lapse account
	</a>
{/if}

<form {...logout} class="pt-4">
	<button
		class="btn text-white bg-red-500 hover:bg-red-600 active:bg-red-400 font-bold">
		Log out
	</button>
</form>
