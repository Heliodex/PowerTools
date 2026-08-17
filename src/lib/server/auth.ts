import { redirect } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { db, Record, type RecordId } from "$lib/server/db"
import deleteExpiredSessionsQuery from "$lib/server/deleteExpiredSessions.surql?raw"
import deleteSessionQuery from "$lib/server/deleteSession.surql?raw"
import deleteUserSessionsQuery from "$lib/server/deleteUserSessions.surql?raw"
import getSessionAndUserQuery from "$lib/server/getSessionAndUser.surql?raw"
import setSessionQuery from "$lib/server/setSession.surql?raw"

export async function createSession(user: RecordId<"user">): Promise<string> {
	const [, session] = await db.query<string[]>(setSessionQuery, { user })
	return session
}

type SessionValidationResult =
	| { session: string; user: User }
	| { session: null; user: null }

export async function validateSessionToken(
	token: string
): Promise<SessionValidationResult> {
	const [, , , res] = await db.query<SessionValidationResult[]>(
		getSessionAndUserQuery,
		{ sess: Record("session", token) }
	)
	if (!res.session || !res.user) return { session: null, user: null }
	return res
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.query(deleteExpiredSessionsQuery + deleteSessionQuery, {
		sess: Record("session", sessionId),
	})
}

export async function invalidateAllSessions(user: string): Promise<void> {
	await db.query(deleteExpiredSessionsQuery + deleteUserSessionsQuery, {
		user: Record("user", user),
	})
}

export const cookieName = "session"
export const cookieOptions = Object.freeze({
	secure: !dev,
	maxAge: 30 * 24 * 60 * 60, // 30 days
	path: "/",
})
export const cookieHCA = "hca"

/**
 * Authorises a user and returns their session and user data, or redirects them to the login page.
 * @param locals the locals object, containing the user and their session.
 * @returns An object containing the session and user data. If the authorisation fails, it will redirect the user to /login.
 * @example
 * const { session, user } = await authorise(locals)
 */
export async function authorise({
	session,
	user,
}: {
	session: string | null
	user: User | null
}) {
	if (!session || !user)
		// TODO: get session and user from getRequestEvent() locals
		redirect(302, "/login")

	return { session, user }
}
