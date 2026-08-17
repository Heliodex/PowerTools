import type { RequestEvent } from "@sveltejs/kit"
import { error, redirect } from "@sveltejs/kit"
import {
	cookieName,
	cookieOptions,
	createSession,
	exchangeCodeForToken,
	fetchHackClubUserInfo,
	findOrCreateUser,
} from "$lib/server/auth"

export async function GET(event: RequestEvent) {
	const { cookies, url } = event
	const code = url.searchParams.get("code")
	const state = url.searchParams.get("state")
	const storedState = cookies.get("hca_state")

	// Verify state to prevent CSRF
	if (!code || !state || state !== storedState)
		error(400, "Invalid OAuth state or missing code")

	// Delete the state cookie
	cookies.delete("hca_state", { path: "/" })

	try {
		const tokenResponse = await exchangeCodeForToken(code)
		const userInfo = await fetchHackClubUserInfo(tokenResponse.access_token)
		const userId = await findOrCreateUser(userInfo)
		const session = await createSession(userId)

		cookies.set(cookieName, session, cookieOptions)
	} catch (e) {
		console.error("OAuth callback error:", e)
		error(500, "OAuth callback failed")
	}

	redirect(302, "/")
}
