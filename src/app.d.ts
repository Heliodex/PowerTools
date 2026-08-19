// See https://svelte.dev/docs/kit/types#app.d.ts for information about these interfaces

/// <reference types="@types/bun" />

import type { RecordId } from "#lib/server/db.js"

declare global {
	declare type User = {
		id: RecordId<"user">
		email: string
		firstName: string | null
		lastName: string | null
		emailVerified: boolean | null
		phoneNumber: string | null
		phoneNumberVerified: boolean | null
		birthdate: string | null
		slackId: string | null
		verificationStatus: string | null
		yswsEligible: boolean | null
		address: {
			streetAddress: string | null
			locality: string | null
			region: string | null
			postalCode: string | null
			country: string | null
		} | null
	}

	namespace App {
		interface Locals {
			session: string | null
			user: User | null
		}
	}
}
