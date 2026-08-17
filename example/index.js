console.log("hello world")

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function randomStringID() {
	const result = []

	for (let i = 0; i < 9; i++)
		result.push(chars[Math.floor(Math.random() * chars.length)])

	return result.join("")
}

class Dom {
	constructor(head, body) {
		this.head = head
		this.body = body
	}

	render() {
		for (const element of this.head) {
			const node = renderElement(element)
			document.head.appendChild(node)
		}

		for (const element of this.body) {
			const node = renderElement(element)
			document.body.appendChild(node)
		}
	}
}
