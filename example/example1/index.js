import { tag, text, VirtualDom } from "./dom.js"

const dom = new VirtualDom(
	[tag("title").children(text("JS tools test"))],
	[
		tag("h1").children(text("JS tools test")),
		tag("p")
			.attribute("style", "color: blue")
			.children(text("hello, world")),

		tag("button")
			.onEvent("click", () => {
				console.log("sup")
			})
			.children(text("Click me")),

		tag("div").children(
			tag("h2").children(text("List of things I can do")),
			tag("ul").children(
				tag("li").children(text("write code")),
				tag("li").children(text("trial & error")),
				tag("li").children(text("reinvent the wheel")),
				tag("li").children(text("procrastinate")),
			)
		),
	]
)

dom.render()
