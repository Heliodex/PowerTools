import { redirect } from "@sveltejs/kit"
import { isAdmin } from "#lib/server/admin.js"
import { db, type RecordId } from "#lib/server/db.js"
import projectsQuery from "./projects.surql?raw"

type AdminProject = {
	id: RecordId<"project">
	created: Date
	name: string
	description: string
	codeUrl?: string
	ai: boolean
	reviewerNotes?: string
	image?: { hash: string; updated: Date }
	submitterEmail?: string
}

export async function load({ locals }) {
	if (!isAdmin(locals.user)) redirect(302, "/")

	const [projects] = await db.query<AdminProject[][]>(projectsQuery)

	return {
		projects: projects.map(project => ({
			...project,
			// SurrealDB record ids are class instances, which can't be serialized to the client, so reduce them to their string form
			id: project.id.toString(),
			// Format server-side so SSR and hydated markup match
			submittedAt: new Date(project.created).toLocaleString(),
		})),
	}
}
