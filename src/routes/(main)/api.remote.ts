// Contains various api methods that cannot be accessed in a page context, usually because they are requested from a component.

import { redirect } from "@sveltejs/kit"
import { authorise, cookieName, invalidateSession } from "#lib/server/auth.js"
import { db } from "#lib/server/db.js"
import { form, getRequestEvent, query } from "$app/server"

export const logout = form(async () => {
	const { cookies, locals } = getRequestEvent()
	const { session } = await authorise(locals)

	await invalidateSession(session)
	cookies.delete(cookieName, {})

	redirect(302, "/")
})

export const statusping = form(() => {
	// does nothing
	// hooks.server.ts will update the user's status when pinged
})

type LapseProfile = {
	id: string
	handle: string
	displayName: string
	profilePictureUrl: string
}

export const getLapseData = query(async () => {
	const { locals } = getRequestEvent()
	const { user } = await authorise(locals)

	// Only public profile fields are returned to the client — never the access/refresh tokens
	const [result] = await db.query<LapseProfile[][]>(
		"SELECT VALUE lapseData FROM $user",
		{ user: user.id }
	)
	const lapseData = result?.[0] ?? null
	if (!lapseData) return null

	return {
		id: lapseData.id,
		handle: lapseData.handle,
		displayName: lapseData.displayName,
		profilePictureUrl: lapseData.profilePictureUrl,
	}
})
