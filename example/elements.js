/**
 * Represents a HTML element in the Document Object Model (DOM)
 */
export class Element {}

/**
 * Transforms a virtual element to a DOM node
 * @param {Element} element
 * @returns {Node}
 */
export function renderElement(element) {
	if (element instanceof TextNode) return element.render()
	if (element instanceof TagElement) return element.render()

	throw new Error("unknown element type")
}

/**
 * Represents a HTML DOM element with a name, attributes, events, and children
 * @param {string} name The element's tag name, such as "div", "a", "p", etc
 * @param {{[_: string]: any}} attrs An object of element attributes, like { "class": "btn" } or { "href": "https://hackclub.com" }
 * @param {{[_: string]: () => void}} events
 * @param {Element[]} children
 */
export class TagElement extends Element {
	/** @type {{[_: string]: any}} */
	attrs = {}

	/** @type {{[_: string]: () => void}} */
	events = {}

	/** @type {Element[]} */
	children = []

	/**
	 * Creates a new TagElement instance
	 * @param {string} name
	 */
	constructor(name) {
		// Always call the parent constructor first
		super()

		// Check types of arguments
		if (typeof name !== "string") throw new Error("name must be a string")

		this.name = name
	}

	/**
	 * Adds an attribute to the tag element
	 * @param {string} name
	 * @param {any} value
	 * @returns {this}
	 */
	addAttribute(name, value) {
		if (typeof name !== "string") throw new Error("name must be a string")
		if (typeof value !== "string") throw new Error("value must be a string")

		this.attrs[name] = value
		return this
	}

	/**
	 * Adds an event listener to the tag element
	 * @param {string} event
	 * @param {() => void} handler
	 * @returns {this}
	 */
	addEvent(event, handler) {
		this.events[event] = handler
		return this
	}

	/**
	 * Adds children to the tag element
	 * @param {...Element} nodes
	 * @returns {this}
	 */
	addChildren(...nodes) {
		for (const [i, node] of nodes.entries())
			if (!(node instanceof Element))
				throw new Error(`nodes[${i}] must be an instance of Element`)

		this.children = nodes
		return this
	}

	/**
	 * Renders the tag element to a DOM node
	 * @returns {Node}
	 */
	render() {
		const node = document.createElement(this.name)

		for (const [name, value] of Object.entries(this.attrs))
			node.setAttribute(name, value)

		for (const [event, handler] of Object.entries(this.events))
			node.addEventListener(event, handler)

		for (const child of this.children)
			node.appendChild(renderElement(child))

		return node
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

	/**
	 * Renders the text element to a DOM node
	 * @returns {Node}
	 */
	render() {
		return document.createTextNode(this.text)
	}
}
