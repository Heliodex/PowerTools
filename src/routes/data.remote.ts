import { getRequestEvent, query } from "$app/server"

export const getLoggedIn = query(() => getRequestEvent().locals.user != null)
