import fs from "node:fs"
import { error, redirect } from "@sveltejs/kit"
import { type } from "arktype"
import sharp from "sharp"
import { authorise } from "#lib/server/auth.js"
import { db, type RecordId } from "#lib/server/db.js"
import { LAPSE_TIMELAPSE_SINCE } from "$app/env/private"
import { form, query } from "$app/server"
import createProjectQuery from "./createProject.surql?raw"
import getLapseDataQuery from "./getLapseData.surql?raw"


const schema = type({
	"image?": "File",
	name: "string",
	description: "string",
	"codeUrl?": "string",
	"ai?": "boolean",
	"reviewerNotes?": "string",
	"timelapseIds?": "string[]",
})

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

		console.log(
			image,
			name,
			description,
			codeUrl,
			ai,
			reviewerNotes,
			timelapseIds
		)

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
				timelapseIds,
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
