// See https://svelte.dev/docs/kit/types#app.d.ts for information about these interfaces

/// <reference types="@types/bun" />

import type { RecordId } from "$lib/server/db"

declare global {
	declare type User = {
		id: RecordId<"user">
		name: string
		robloxData: RobloxData | undefined
	}

	namespace App {
		interface Locals {
			session: string | null
			user: User | null
		}
	}
}
