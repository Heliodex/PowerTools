<script lang="ts">
	import { newProjectForm } from "./new.remote"
</script>

<h1 class="text-2xl">Submit your project</h1>

<form {...newProjectForm} enctype="multipart/form-data" class="pt-8">
	<fieldset>
		<label for="image">Project image</label>
		<input type="file" name="image" id="image" accept="image/*" />
	</fieldset>

	<fieldset>
		<label for="name">Project name</label>
		<input type="text" name="name" id="name" required />
	</fieldset>

	<fieldset>
		<label for="description">Project description</label>
		<textarea name="description" id="description" required></textarea>
	</fieldset>

	<fieldset>
		<label for="codeUrl">Code URL</label>
		<input
			type="url"
			name="codeUrl"
			id="codeUrl"
			placeholder="https://github.com/..." />
	</fieldset>

	<fieldset>
		<div>
			<input type="checkbox" name="ai" id="ai" />
			<label for="ai" class="pl-2">I used generative AI in building this project</label>
		</div>
	</fieldset>

	<fieldset>
		<label for="reviewerNotes">Extra reviewer notes</label>
		<textarea name="reviewerNotes" id="reviewerNotes"></textarea>
	</fieldset>

	<button
		type="submit"
		class="btn bg-blue-500 hover:bg-blue-600 active:bg-blue-400 px-3 py-1.5 rounded-lg font-bold">
		Submit
	</button>
</form>
