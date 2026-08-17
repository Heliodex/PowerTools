import { Dom, tag, text } from "./dom.js"

new Dom(
	[tag("title").addChildren(text("JS tools test"))],
	[
		tag("h1").addChildren(text("JS tools test")),
		tag("p").addChildren(text("hello, world")),

		tag("button")
			.addEvent("click", () => {
				console.log("sup")
			})
			.addChildren(text("Click me")),
	]
).render()
