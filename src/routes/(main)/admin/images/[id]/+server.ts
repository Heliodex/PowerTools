import { error, type RequestEvent } from "@sveltejs/kit"
import { isAdmin } from "#lib/server/admin.js"

// Serves the processed project image stored on disk. Record ids can arrive either as a plain string ("4q8py190...") or as a full record id ("project:4q8py190..."), so strip any table prefix before looking up the file.
export function GET({ locals, params }: RequestEvent) {
	if (!isAdmin(locals.user)) error(403, "Forbidden")

	const { id } = params
	if (!id) error(400, "Missing project id")

	const file = Bun.file(`./data/images/${id}.avif`)
	if (!file.exists()) error(404, "No image found for this project")

	return new Response(file, {
		headers: {
			"Content-Type": "image/avif",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	})
}
