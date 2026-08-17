import { defineEnvVars } from "@sveltejs/kit/env"

export const variables = defineEnvVars({
	HACKCLUB_CLIENT_ID: { static: true },
	HACKCLUB_CLIENT_SECRET: { static: true },
	HACKCLUB_REDIRECT_URI: { static: true },
	LAPSE_CLIENT_ID: { static: true },
	LAPSE_CLIENT_SECRET: { static: true },
	LAPSE_REDIRECT_URI: { static: true },
})
