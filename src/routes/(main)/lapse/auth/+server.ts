import type { RequestEvent } from "@sveltejs/kit"
import { error, redirect } from "@sveltejs/kit"
import {
	authorise,
	exchangeLapseCodeForToken,
	fetchLapseUserInfo,
	linkLapseAccount,
} from "#lib/server/auth.js"

export async function GET({ cookies, locals, url }: RequestEvent) {
	const { user } = await authorise(locals)

	// Verify state to prevent CSRF
	const code = url.searchParams.get("code")
	if (!code) error(400, "Missing code")
	const state = url.searchParams.get("state")
	if (!state) error(400, "Missing state")
	const storedState = cookies.get("lapse_state")
	if (!storedState) error(400, "Missing cookie")
	if (state !== storedState) error(400, "Invalid state")
	const verifier = cookies.get("lapse_verifier")
	if (!verifier) error(400, "Missing verifier cookie")

	// Delete the state and verifier cookies
	cookies.delete("lapse_state", {})
	cookies.delete("lapse_verifier", {})

	try {
		const tokenResponse = await exchangeLapseCodeForToken(code, verifier)
		const userInfo = await fetchLapseUserInfo(tokenResponse.access_token)
		await linkLapseAccount(user.id, userInfo, tokenResponse)
	} catch (e) {
		console.error("Lapse OAuth callback error:", e)
		error(500, "Lapse OAuth callback failed")
	}

	redirect(302, "/home")
}
