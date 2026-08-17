/**
 * Represents a HTML element in the Document Object Model (DOM)
 */
export class Element {}

/**
 * Represents a HTML DOM element with a name, attributes, events, and children
 * @param {string} name The element's tag name, such as "div", "a", "p", etc
 * @param {{[_: string]: any}} attrs An object of element attributes, like { "class": "btn" } or { "href": "https://hackclub.com" }
 * @param {{[_: string]: () => void}} events
 * @param {Element[]} children
 */
export class TagElement extends Element {
	/**
	 * Creates a new TagElement instance
	 * @param {string} name
	 * @param {{[_: string]: any}} attrs
	 * @param {{[_: string]: () => void}} events
	 * @param {Element[]} children
	 */
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
export class TextNode extends Element {
	/**
	 * Creates a new TextNode instance
	 * @param {string} text
	 */
	constructor(text) {
		super()

		// Check types of arguments
		if (typeof text !== "string") throw new Error("text must be a string")

		this.text = text
	}
}
