import { redirect } from "@sveltejs/kit"
import { getHackClubAuthUrl } from "#lib/server/auth.js"
import { dev } from "$app/env"
import { form, getRequestEvent, query } from "$app/server"

export const getLoggedIn = query(() => getRequestEvent().locals.user != null)

export const login = form(() => {
	const { cookies } = getRequestEvent()

	// Generate a random state for CSRF protection
	const state = crypto.randomUUID()

	// Store state in a cookie for verification in the callback
	cookies.set("hca_state", state, {
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
		secure: !dev,
	})

	const authUrl = getHackClubAuthUrl(state)
	redirect(302, authUrl, { external: true })
})
