// Import some classes from the elements module
import { renderElement, TagElement, TextNode } from "./elements"

/**
 * Represents a virtual HTML document, with a head and body section
 * @param {TagElement[]} head
 * @param {TagElement[]} body
 */
export class VirtualDom {
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

/**
 * Creates a new TextNode instance
 * @param {string} str
 * @returns {TextNode}
 */
export const text = str => new TextNode(str)

/**
 * Creates a new TagElement instance
 * @param {string} name
 * @returns {TagElement}
 */
export const tag = name => new TagElement(name)
