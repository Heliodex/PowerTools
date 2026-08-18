<script lang="ts">
	let { data } = $props()
	const projects = $derived(data.projects)
</script>

<h1>All submitted projects</h1>

{#if projects.length === 0}
	<p class="pt-4">No projects have been submitted yet.</p>
{:else}
	<ul class="flex flex-col gap-4 pt-4">
		{#each projects as project (project.id)}
			<li class="border border-neutral-600 rounded-lg p-4 flex flex-col gap-1">
				<h3 class="pb-0!">{project.name}</h3>

				{#if project.submitterEmail}
					<p class="text-neutral-300">Submitted by {project.submitterEmail}</p>
				{/if}

				<p>AI used: {project.ai ? "Yes" : "No"}</p>

				{#if project.codeUrl}
					<a href={project.codeUrl} target="_blank" rel="noreferrer">
						{project.codeUrl}
					</a>
				{/if}

				<p>{project.description}</p>

				{#if project.reviewerNotes}
					<p>Reviewer notes: {project.reviewerNotes}</p>
				{/if}

				<p class="text-neutral-500 text-sm">
					Submitted {project.submittedAt}
				</p>
			</li>
		{/each}
	</ul>
{/if}
