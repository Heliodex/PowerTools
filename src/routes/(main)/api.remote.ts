// Contains various api methods that cannot be accessed in a page context, usually because they are requested from a component.

import { redirect } from "@sveltejs/kit"
import { authorise, cookieName, invalidateSession } from "#lib/server/auth.js"
import { form, getRequestEvent } from "$app/server"

export const logout = form(async () => {
	const { cookies, locals } = getRequestEvent()
	const { session } = await authorise(locals)

	await invalidateSession(session)
	cookies.delete(cookieName, { path: "/" })

	redirect(302, "/")
})

export const statusping = form(() => {
	// does nothing
	// hooks.server.ts will update the user's status when pinged
})
