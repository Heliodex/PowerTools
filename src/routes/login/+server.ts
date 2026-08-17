import type { RequestEvent } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import { dev } from "$app/env"
import { getHackClubAuthUrl } from "$lib/server/auth"

export async function GET({ cookies }: RequestEvent) {
	// Generate a random state for CSRF protection
	const state = crypto.randomUUID()

	// Store state in a cookie for verification in the callback
	cookies.set("hca_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
		secure: !dev,
	})

	const authUrl = getHackClubAuthUrl(state)
	redirect(302, authUrl)
}
