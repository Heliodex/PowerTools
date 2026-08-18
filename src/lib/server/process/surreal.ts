let started = false

// SurrealDB writes its PID into ./data/surreal/LOCK while it holds the database lock. Since the `started` flag resets whenever SvelteKit reloads this module, verify the lock is actually owned by a live process before spawning a second instance.
async function isLockHeldByLivingProcess(): Promise<boolean> {
	try {
		const pid = Number.parseInt(
			(await Bun.file("data/surreal/LOCK").text()).trim(),
			10
		)
		if (!Number.isFinite(pid)) return false

		try {
			process.kill(pid, 0)
			return true
		} catch (err) {
			// EPERM: the process exists but belongs to another user
			return (err as NodeJS.ErrnoException).code === "EPERM"
		}
	} catch {
		// No lock file — this is the first start
		return false
	}
}

function getDownloadPath(): string {
	const version = "3.2.4"
	const { arch, platform } = process
	const filename = `surreal-v${version}.${platform}-${arch}.tgz`

	return `https://github.com/surrealdb/surrealdb/releases/download/v${version}/${filename}`
}

export default async () => {
	if (started) return
	if (await isLockHeldByLivingProcess()) {
		console.log("SurrealDB is already running — skipping start.")
		return
	}
	console.log("Starting SurrealDB...")
	started = true

	let surrealPath = "surreal"

	if (!Bun.which("surreal"))
		try {
			console.log("SurrealDB is not installed. Installing...")

			const url = getDownloadPath()
			console.log(`Downloading SurrealDB from ${url}`)
			const response = await fetch(url)
			if (!response.ok)
				throw new Error(
					`Failed to download SurrealDB: ${response.status} ${response.statusText}`
				)

			surrealPath = "./surreal"
			await Bun.write(surrealPath, await response.text())
			await Bun.$`chmod +x ${surrealPath}`

			console.log("Installed SurrealDB successfully.")

			// test startup by just running surreal
			const res = await Bun.$`${surrealPath}`
			console.log(res.stdout.toString())
		} catch {
			console.error("Failed to install SurrealDB.")
			process.exit(1)
		}

	try {
		const proc = Bun.spawn(
			[
				surrealPath,
				"start",
				"-u=root",
				"-p=root",
				"-b=127.0.0.1:8001",
				"surrealkv://data/surreal",
			],
			{ cwd: ".", stdout: "pipe", stderr: "pipe" }
		)

		process.on("exit", () => {
			console.log("Shutting down SurrealDB...")
			proc.kill()
		})

		proc.exited.then(async () => {
			console.error("SurrealDB process exited unexpectedly.")
			const r = await proc.stderr.getReader().read()
			const logs = new TextDecoder().decode(r.value)
			console.log(logs.split("\n").slice(-10).join("\n"))
			process.exit(1)
		})
	} catch {
		console.error(
			"Failed to start SurrealDB. If the automatic install failed, check the logs above; otherwise make sure `surreal` is installed and on PATH."
		)
		process.exit(1)
	}
}
