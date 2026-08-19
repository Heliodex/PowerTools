import fs from "node:fs"
import { error, redirect } from "@sveltejs/kit"
import sharp from "sharp"
import { type } from "#lib/arktype.js"
import { authorise } from "#lib/server/auth.js"
import { db, type RecordId } from "#lib/server/db.js"
import { LAPSE_TIMELAPSE_SINCE } from "$app/env/private"
import { form, getRequestEvent, query } from "$app/server"
import createProjectQuery from "./createProject.surql?raw"
import getLapseDataQuery from "./getLapseData.surql?raw"

const schema = type({
	"image?": type("Blob").as<File>(),
	name: "string >= 1",
	description: "string >= 1",
	codeUrl: "string >= 1",
	"ai?": "boolean",
	"reviewerNotes?": "string",
	timelapseIds: "string[] >= 1",
})
	.configure(
		{ message: () => "please give your project a name." },
		n => n.kind === "required" && n.expression.startsWith("name:")
	)
	.configure(
		{ message: () => "please add a description of your project." },
		n => n.kind === "required" && n.expression.startsWith("description:")
	)
	.configure(
		{ message: () => "please provide a URL to your project's code." },
		n => n.kind === "required" && n.expression.startsWith("codeUrl:")
	)
	.configure(
		{ message: () => "please select at least one timelapse." },
		n => n.kind === "required" && n.expression.startsWith("timelapseIds:")
	)

export const newProjectForm = form(
	schema,
	async ({
		image,
		name,
		description,
		codeUrl,
		ai,
		reviewerNotes,
		timelapseIds,
	}) => {
		const { user } = await authorise()

		// Process the uploaded image (if any) into a fixed-size AVIF, then content-address it by its SHA-256 hash so identical uploads share a single file on disk. The hash is stored on the project and used to serve the image later.
		let imageHash: string | undefined
		if (image && image.size > 0) {
			await fs.promises.mkdir("./data/images", { recursive: true })

			console.log("compressing")
			const bytes = await sharp(await image.arrayBuffer())
				// size subject to change
				.resize(1280, 720, { fit: "cover" })
				.avif()
				.toBuffer()
			console.log("compresesd")

			imageHash = new Bun.CryptoHasher("sha256")
				.update(bytes)
				.digest("hex")
			console.log("hashed")

			const filePath = `./data/images/${imageHash}.avif`
			if (!fs.existsSync(filePath)) await Bun.write(filePath, bytes)
			console.log("written")
		}

		console.log("submitting")
		const submit = {
			user,
			image: imageHash ? { hash: imageHash } : undefined,
			name,
			description,
			codeUrl,
			ai: ai ?? false,
			reviewerNotes,
			timelapseIds,
		}

		const [, project] = await db.query<RecordId<"project">[]>(
			createProjectQuery,
			submit
		)

		console.log("created", project)

		const { cookies } = getRequestEvent()
		cookies.set("submitted", "true", { path: "/" })

		redirect(303, "/submitted")
	}
)

type LapseTimelapse = {
	id: string
	name: string
	description: string
	visibility: string
	createdAt: number
	duration: number
	thumbnailUrl: string | null
	playbackUrl: string | null
}

export type TimelapsesResult = {
	error: string | null
	since: string
	timelapses: LapseTimelapse[]
}

export const getTimelapses = query(async (): Promise<TimelapsesResult> => {
	const { user } = await authorise()

	const since = LAPSE_TIMELAPSE_SINCE
	const sinceMs = Date.parse(since)

	const [result] = await db.query<{ id: string; accessToken: string }[][]>(
		getLapseDataQuery,
		{ user: user.id }
	)
	const lapse = result?.[0]
	if (!lapse?.accessToken)
		error(401, "Please link your lapse account to submit a project!")

	try {
		const response = await fetch(
			`https://api.lapse.hackclub.com/api/timelapse/findByUser?user=${encodeURIComponent(lapse.id)}`,
			{ headers: { Authorization: `Bearer ${lapse.accessToken}` } }
		)

		if (!response.ok) {
			if (response.status === 401)
				return {
					error: "Your Lapse session has expired. Please re-link your Lapse account.",
					since,
					timelapses: [],
				}

			return {
				error: `Failed to fetch timelapses from Lapse (status ${response.status}).`,
				since,
				timelapses: [],
			}
		}

		const body = await response.json()
		if (!body?.ok || !body?.data?.timelapses)
			return {
				error: `Lapse API returned an error: ${JSON.stringify(body)}`,
				since,
				timelapses: [],
			}

		const timelapses = (body.data.timelapses as LapseTimelapse[])
			.filter(t => t.createdAt >= sinceMs)
			.sort((a, b) => b.createdAt - a.createdAt)
			.map(
				({
					id,
					name,
					description,
					visibility,
					createdAt,
					duration,
					thumbnailUrl,
					playbackUrl,
				}) => ({
					id,
					name,
					description,
					visibility,
					createdAt,
					duration,
					thumbnailUrl,
					playbackUrl,
				})
			)

		return { error: null, since, timelapses }
	} catch (e) {
		console.error("Failed to fetch Lapse timelapses:", e)

		return {
			error: "Failed to fetch timelapses from Lapse. Please try again.",
			since,
			timelapses: [],
		}
	}
})
