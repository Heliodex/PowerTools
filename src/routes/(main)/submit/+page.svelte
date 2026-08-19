<script lang="ts">
	import { getTimelapses, newProjectForm } from "./submit.remote"

	const timelapseData = $derived(await getTimelapses())

	const sinceLabel = $derived(
		timelapseData ? new Date(timelapseData.since).toLocaleDateString() : ""
	)

	// Kept in sync with the checkboxes via bind:group; also drives the count below
	let selected = $state<string[]>([])

	function formatDuration(seconds: number) {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = Math.round(seconds % 60)

		return [hours, minutes, secs]
			.map((part, i) => (i === 0 ? part : String(part).padStart(2, "0")))
			.join(":")
	}
</script>

<h1 class="text-2xl">Submit your project</h1>

<form {...newProjectForm} enctype="multipart/form-data" class="pt-8">
	{#if timelapseData.error}
		<p class="pb-4 text-red-500">{timelapseData.error}</p>
	{:else if timelapseData.timelapses.length === 0}
		<p class="pb-4">No timelapses found since {sinceLabel}.</p>
	{:else}
		<fieldset class="pb-8">
			<legend class="font-bold">
				Your timelapses (since {sinceLabel})
			</legend>
			<p class="pb-2 text-sm opacity-70">
				Select the timelapses you want to submit for this project.
			</p>

			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{#each timelapseData.timelapses as t (t.id)}
					<label
						class="relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 p-2 transition-colors hover:border-blue-500 has-checked:border-blue-500">
						<input
							{...newProjectForm.fields.timelapseIds.as("checkbox", t.id)}
							class="absolute top-2 left-2 z-10 size-5 accent-blue-500" />
						{#if t.thumbnailUrl}
							<img
								src={t.thumbnailUrl}
								alt={t.name}
								class="aspect-video w-full rounded object-cover" />
						{:else}
							<div
								class="flex aspect-video w-full items-center justify-center rounded bg-zinc-800 text-sm text-zinc-500">
								Processing…
							</div>
						{/if}
						<span class="mt-2 line-clamp-1 text-sm font-semibold">{t.name}</span>
						<span class="text-xs opacity-70">
							{new Date(t.createdAt).toLocaleDateString()} · {formatDuration(t.duration)}
						</span>
					</label>
				{/each}
			</div>

			<p class="pt-2 text-sm opacity-70">
				{selected.length === 0
					? "No timelapses selected."
					: `${selected.length} timelapse${selected.length === 1 ? "" : "s"} selected.`}
			</p>
			{#each newProjectForm.fields.timelapseIds.issues() ?? [] as issue}
				<p class="pt-2 text-sm text-red-500">{issue.message}</p>
			{/each}
		</fieldset>
	{/if}

	<label>
		<span>Project image</span>
		<input {...newProjectForm.fields.image.as("file")} />
		{#each newProjectForm.fields.image.issues() ?? [] as issue}
			<span class="pt-2 text-sm text-red-500">{issue.message}</span>
		{/each}
	</label>

	<label>
		<span>Project name</span>
		<input {...newProjectForm.fields.name.as("text")} />
		{#each newProjectForm.fields.name.issues() ?? [] as issue}
			<span class="pt-2 text-sm text-red-500">{issue.message}</span>
		{/each}
	</label>

	<label>
		<span>Project description</span>
		<textarea {...newProjectForm.fields.description.as("text")}></textarea>
		{#each newProjectForm.fields.description.issues() ?? [] as issue}
			<span class="pt-2 text-sm text-red-500">{issue.message}</span>
		{/each}
	</label>

	<label>
		<span>Code URL</span>
		<input
			{...newProjectForm.fields.codeUrl.as("url")}
			placeholder="https://github.com/..." />
		{#each newProjectForm.fields.codeUrl.issues() ?? [] as issue}
			<span class="pt-2 text-sm text-red-500">{issue.message}</span>
		{/each}
	</label>

	<label>
		<span>
			<input {...newProjectForm.fields.ai.as("checkbox")} />
			I used generative AI in building this project
		</span>
		{#each newProjectForm.fields.ai.issues() ?? [] as issue}
			<span class="pt-2 text-sm text-red-500">{issue.message}</span>
		{/each}
	</label>

	<label>
		<span>Extra reviewer notes</span>
		<textarea {...newProjectForm.fields.reviewerNotes.as("text")}></textarea>
		{#each newProjectForm.fields.reviewerNotes.issues() ?? [] as issue}
			<span class="pt-2 text-sm text-red-500">{issue.message}</span>
		{/each}
	</label>

	{#if newProjectForm.fields.allIssues()?.length}
		<div class="mb-6" role="alert">
			<p class="font-bold text-red-500">Please fix the following issues:</p>
			<ul class="list-disc pl-6 text-sm text-red-500">
				{#each newProjectForm.fields.allIssues() ?? [] as issue}
					<li>{issue.message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<button
		disabled={!!timelapseData.error}
		type="submit"
		class="btn bg-blue-500 hover:bg-blue-600 active:bg-blue-400 font-bold">
		Submit
	</button>
</form>
