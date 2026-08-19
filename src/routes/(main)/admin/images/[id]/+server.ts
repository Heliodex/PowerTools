import fs from "node:fs"
import { error, type RequestEvent } from "@sveltejs/kit"
import { isAdmin } from "#lib/server/admin.js"

// Serves the processed project image stored on disk. Record ids can arrive either as a plain string ("4q8py190...") or as a full record id ("project:4q8py190..."), so strip any table prefix before looking up the file.
export function GET({ locals, params }: RequestEvent) {
	if (!isAdmin(locals.user)) error(403, "Unauthorized")

	const id = params.id ?? ""
	if (!id) error(400, "Missing project id")

	const plainId = id.split(":").at(-1) ?? id

	const candidates = [`./data/images/${plainId}.avif`]
	if (plainId !== id) candidates.push(`./data/images/${id}.avif`)

	const file = candidates.find(f => fs.existsSync(f))
	if (!file) error(404, "No image found for this project")

	return new Response(fs.readFileSync(file), {
		headers: {
			"Content-Type": "image/avif",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	})
}
