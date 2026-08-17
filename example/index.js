// Import some types from the elements module
/**
 * @import { Element, TagElement, TextNode } from "./elements"
 */

console.log("hello world")

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

/**
 * Generates a random string ID of length 9
 * @returns {string}
 */
function randomStringID() {
	const result = []

	for (let i = 0; i < 9; i++)
		result.push(chars[Math.floor(Math.random() * chars.length)])

	return result.join("")
}

/**
 * Represents a HTML document, with a head and body section
 * @param {TagElement[]} head
 * @param {TagElement[]} body
 */
class Dom {
	/**
	 * Creates a new Dom instance
	 * @param {TagElement[]} head
	 * @param {TagElement[]} body
	 */
	constructor(head, body) {
		if (!Array.isArray(head)) throw new Error("head must be an array")
		if (!Array.isArray(body)) throw new Error("body must be an array")

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
