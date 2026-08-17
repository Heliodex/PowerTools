import { Dom, tag, text } from "./dom.js"

new Dom(
	[tag("title").addChildren(text("JS tools test"))],
	[
		tag("h1").addChildren(text("JS tools test")),
		tag("p")
			.addAttribute("style", "color: blue")
			.addChildren(text("hello, world")),

		tag("button")
			.addEvent("click", () => {
				console.log("sup")
			})
			.addChildren(text("Click me")),

		tag("div").addChildren(
			tag("h2").addChildren(text("List of things I can do")),
			tag("ul").addChildren(
				tag("li").addChildren(text("write code")),
				tag("li").addChildren(text("trial & error")),
				tag("li").addChildren(text("reinvent the wheel")),
				tag("li").addChildren(text("procrastinate"))
			)
		),
	]
).render()
