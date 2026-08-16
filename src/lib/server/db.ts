import {
	type Query,
	Surreal,
	RecordId as SurrealRecordId,
	Table,
} from "surrealdb"
import { building } from "$app/environment"
import initQuery from "$lib/server/init.surql?raw"
import startSurreal from "$lib/server/process/surreal"

if (!building)
	try {
		startSurreal()
	} catch (e) {
		console.log(e)
		console.error(
			"Failed to start SurrealDB. Make sure it is installed and accessible as `surreal`."
		)
		process.exit(1)
	}

export const db = new Surreal({
	codecOptions: {
		useNativeDates: true,
	},
})

// Retry queries
const ogq = db.query.bind(db)
const retriable = "This transaction can be retried"

// oof
// also bad types but who cares
db.query = async <R extends unknown[]>(
	query: string,
	bindings?: Record<string, unknown>
): Query<R> => {
	try {
		return await ogq(query, bindings)
	} catch (err) {
		const e = err as Error
		if (!e.message.endsWith(retriable)) throw e
		console.log("Retrying query:", e.message)
	}
	return await db.query(query, bindings)
}

export const version = db.version.bind(db)

const url = new URL("ws://localhost:8001") // must be ws:// to prevent token expiration, http:// will expire after 1 hour by default

async function reconnect() {
	for (let attempt = 0; ; attempt++)
		try {
			await db.close() // doesn't do anything if not connected
			console.log("connecting to database")
			await db.connect(url, {
				namespace: "main",
				database: "main",
				authentication: {
					username: "root", // security B)
					password: "root",
				},
			})
			console.log("reloaded", (await version()).version)
			break
		} catch (err) {
			const e = err as Error
			console.error("Failed to connect to database:", e.message)
			if (attempt === 4)
				console.log(
					`Multiple connection attempts failed. Make sure the database is running, either locally or in a container, and is accessible at ${url}.`
				)
			console.log("Retrying connection in 1 second...")
			await new Promise(resolve => setTimeout(resolve, 1000))
		}
}

if (!building) {
	await reconnect()
	await db.query(initQuery)
}

type RecordIdTypes = {
	hasSession: string
	project: string
	session: string
	user: string
}

export const HasSession = new Table("hasSession")
export const Project = new Table("project")
export const Session = new Table("session")
export const User = new Table("user")

// Ensure type safety when creating record ids
export type RecordId<T extends keyof RecordIdTypes> = SurrealRecordId<T>

/**
 * Returns a record id object for a given table and id.
 * @param table The table to get the record id for.
 * @param id The id of the record.
 * @returns a Record object.
 */
export const Record = <T extends keyof RecordIdTypes>(
	table: T,
	id: RecordIdTypes[T]
) => new SurrealRecordId(table, id)

/**
 * Finds whether a record exists in the database.
 * @param id The id of the record to find.
 * @returns Whether the record exists.
 * @example
 * await find("user", id)
 */
export async function find<T extends keyof RecordIdTypes>(
	table: T,
	id: RecordIdTypes[T]
) {
	const [result] = await db.query<boolean[]>("!!SELECT 1 FROM $thing", {
		thing: Record(table, id),
	})
	return result
}
