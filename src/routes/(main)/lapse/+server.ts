import type { RequestEvent } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import { generatePkcePair, getLapseAuthUrl } from "#lib/server/auth.js"
import { dev } from "$app/env"

export async function GET({ cookies }: RequestEvent) {
	const state = crypto.randomUUID()
	const { verifier, challenge } = await generatePkcePair()

	// Store the state and PKCE verifier in cookies for verification in the callback
	cookies.set("lapse_state", state, {
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
		secure: !dev,
	})
	cookies.set("lapse_verifier", verifier, {
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax",
		secure: !dev,
	})

	redirect(302, getLapseAuthUrl(state, challenge), { external: true })
}
