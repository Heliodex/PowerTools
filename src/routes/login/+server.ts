import { redirect } from "@sveltejs/kit"
import { cookieHCA } from "$lib/server/auth"

export async function GET({ cookies }) {
	cookies.set(cookieHCA, state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	})

	redirect(302, url)
}
