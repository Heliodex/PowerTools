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

export default async () => {
	if (started) return
	if (await isLockHeldByLivingProcess()) {
		console.log("SurrealDB is already running — skipping start.")
		return
	}
	console.log("Starting SurrealDB...")
	started = true

	try {
		if (!Bun.which("surreal")) {
			console.log("SurrealDB is not installed. Installing...")
			// Curl may not be available, so download the installer script with fetch before running it.
			const response = await fetch("https://install.surrealdb.com")
			if (!response.ok)
				throw new Error(
					`Failed to download installer: ${response.status} ${response.statusText}`
				)

			const installerPath = "/tmp/surrealdb-install.sh"
			await Bun.write(installerPath, await response.text())
			// Bun.$ inherits stdout/stderr by default, so the installer's logs print to the terminal
			await Bun.$`sh ${installerPath}`
		}

		const proc = Bun.spawn(
			[
				"surreal",
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
