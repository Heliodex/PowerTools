import type { RequestEvent } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
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
	if (!code || !state || state !== storedState) {
		console.error("Invalid OAuth state or missing code")
		redirect(302, "/login?error=invalid_state")
	}

	// Delete the state cookie
	cookies.delete("hca_state", { path: "/" })

	try {
		// Exchange code for access token
		const tokenResponse = await exchangeCodeForToken(code)

		// Fetch user info from Hack Club
		const userInfo = await fetchHackClubUserInfo(tokenResponse.access_token)

		// Find or create user in database
		const userId = await findOrCreateUser(userInfo)

		// Create session
		const session = await createSession(userId)

		// Set session cookie
		cookies.set(cookieName, session, cookieOptions)

		// Redirect to home page (or wherever you want after login)
		redirect(302, "/")
	} catch (error) {
		console.error("OAuth callback error:", error)
		redirect(302, "/login?error=callback_failed")
	}
}
