<script lang="ts">
	import { logout } from "../api.remote"
</script>

<h1>You are logged in</h1>

Wanna <a href="/submit">submit</a>?

<form {...logout} class="pt-4">
	<button
		class="btn text-white bg-red-500 hover:bg-red-600 active:bg-red-400">
		<b>Log out</b>
	</button>
</form>
