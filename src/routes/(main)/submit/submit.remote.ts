import fs from "node:fs"
import { redirect } from "@sveltejs/kit"
import { type } from "arktype"
import sharp from "sharp"
import { authorise } from "#lib/server/auth.js"
import { db, type RecordId } from "#lib/server/db.js"
import { form, getRequestEvent } from "$app/server"
import createProjectQuery from "./createProject.surql?raw"

const schema = type({
	"image?": "File",
	name: "string",
	description: "string",
	"codeUrl?": "string",
	"ai?": "boolean",
	"reviewerNotes?": "string",
})

export const newProjectForm = form(
	schema,
	async ({ image, name, description, codeUrl, ai, reviewerNotes }) => {
		const { user } = await authorise()

		console.log(image, name, description, codeUrl, ai, reviewerNotes)

		if (!fs.existsSync("./data/images"))
			fs.mkdirSync("./data/images", { recursive: true })

		const [, project] = await db.query<RecordId<"project">[]>(
			createProjectQuery,
			{
				user,
				name,
				description,
				codeUrl,
				ai,
				reviewerNotes,
			}
		)

		console.log("created", project)

		const img = image as Blob | undefined
		if (!img || img.size <= 0) redirect(303, "/home")

		await sharp(await img.arrayBuffer())
			// size subject to change
			.resize(1280, 720, { fit: "cover" })
			.avif({ effort: 9 })
			.toFile(`./data/images/${project.id}.avif`)

		redirect(303, "/home")
	}
)
