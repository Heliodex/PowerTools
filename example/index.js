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
 * Represents a HTML element in the Document Object Model (DOM)
 */
class Element {}

/**
 * Represents a HTML DOM element with a name, attributes, events, and children
 * @param {string} name The element's tag name, such as "div", "a", "p", etc
 * @param {{[_: string]: any}} attrs An object of element attributes, like { "class": "btn" } or { "href": "https://hackclub.com" }
 * @param {{[_: string]: () => void}} events
 * @param {Element[]} children
 */
class TagElement extends Element {
	constructor(name, attrs, events, children) {
		// Always call the parent constructor first
		super()

		// Check types of arguments
		if (typeof name !== "string") throw new Error("name must be a string")
		if (typeof attrs !== "object")
			throw new Error("attrs must be an object")
		if (typeof events !== "object")
			throw new Error("events must be an object")
		if (!Array.isArray(children))
			throw new Error("children must be an array")

		this.name = name
		this.attrs = attrs
		this.events = events
		this.children = children
	}
}

/**
 * Represents a text node in the DOM
 * @param {string} text
 */
class TextNode extends Element {
	constructor(text) {
		super()

		// Check types of arguments
		if (typeof text !== "string") throw new Error("text must be a string")

		this.text = text
	}
}

/**
 * Represents a HTML document, with a head and body section
 * @param {TagElement[]} head
 * @param {TagElement[]} body
 */
class Dom {
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
