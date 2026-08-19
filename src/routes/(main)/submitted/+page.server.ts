import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const load: PageLoad = ({ cookies }) => {
	if (cookies.get("submitted") !== "true") redirect(302, "/")
	cookies.delete("submitted", { path: "/" })
}
