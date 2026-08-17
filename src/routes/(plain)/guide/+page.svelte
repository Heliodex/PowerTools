<script lang="ts">
	import Code from "#components/Code.svelte"
</script>

<h1>
	Part 1
</h1>

<p>
	So let's assume you know how to build a website. You start with a basic HTML template like the one below:
</p>

<Code filename="index.html" code={`
	<!doctype html>
	<html lang="en">

	<head>
		<meta charset="utf-8">
	</head>

	<body>
	</body>

	</html>
`} />

<p>
	Usually, the next step is to start adding some content to the page by placing markup tags inside the &lt;body&gt; section.
</p>


<Code filename="index.html" code={`
	<body>
+		<h1>Hello, World!</h1>
	</body>
`} />

<p>
We're going to take a different route here by adding a script instead, which we'll control the entire page from.
</p>

<Code filename="index.html" code={`
	<head>
		<meta charset="utf-8">
+		<script type="module" src="index.js"><\/script>
	</head>

	<body>
-		<h1>Hello, World!</h1>
	</body>
`} />

<p>
	You may know that you can add elements to a page via JavaScript by using functions on the global <code>document</code> object:
</p>

<Code filename="index.js" code={`
	const heading = document.createElement("h1")
	heading.textContent = "Hello, World!"
	document.body.appendChild(heading)
`} />

<p>
	Or, alternatively, using <code>document.createTextNode</code> to create the text node and then appending it to the heading element:
</p>

<Code filename="index.js" code={`
	const heading = document.createElement("h1")
-	heading.textContent = "Hello, World!"
+	const text = document.createTextNode("Hello, world!")
+	heading.appendChild(text)
	document.body.appendChild(heading)
`} />

<p class="pb-4">
	We could build our entire page this way, though with repetitive and imperative <code>document.createElement</code> calls, as opposed to the more declarative approach of standard HTML markup. When I say "imperative" as opposed to "declarative" here, I'm referring to the fact that the JS code requires a lot of machinery relating to describing what you want the computer to <em>do</em>, as opposed to what you want to <em>see</em>.
</p>

<p>
	More declarative code cuts out the repetitiveness of telling the browser exactly what to do, and generally results in shorter code. However, we can introduce functions to abstract away this repetitiveness and end up JavaScript that's more declarative, at the cost of needing to understand how the abstractions work.
</p>

<p>
	Imagine a function as follows:
</p>

<Code filename="index.js" code={`
	function addChildren(node, children) {
		for (const child of children)
			node.appendChild(child)

		return node
	}
`} />

<p>
	Pretty simple, though it'll allow a nicer approach to building sections of HTML:
</p>

<Code filename="index.js" code={`
	const part = addChildren(document.createElement("div"), [
		addChildren(document.createElement("h1"), [
			document.createTextNode("Hello, world!"),
		]),
		addChildren(document.createElement("p"), [
			document.createTextNode("This is a paragraph."),
		]),
	])

	document.body.appendChild(part)
`} />

<p class="pb-4">
	Though none of this is yet as simple as writing vanilla HTML yet. We're sacrificing quite a bit of readability and requiring using custom non-standard abstractions. Are there any benefits to this?
</p>

<p>
	Well, to start with, we can create reusable components:
</p>

<Code filename="index.js" code={`
-	const part =
+	const createPart = (heading, text) =>
		addChildren(document.createElement("div"), [
			addChildren(document.createElement("h1"), [
-				document.createTextNode("Hello, world!"),
+				document.createTextNode(heading),
			]),
			addChildren(document.createElement("p"), [
-				document.createTextNode("This is a paragraph."),
+				document.createTextNode(text),
			]),
		])

-	document.body.appendChild(part)
+	document.body.appendChild(createPart(
+		"Part 1",
+		"This is part 1."
+	))
+	document.body.appendChild(createPart(
+		"Part 2",
+		"Here's another part!"
+	))
`} />

<p class="pb-4">
	You could do this with normal HTML by extracting reusable components from the page with JavaScript and interpolating values into them. Here, since everything is in JavaScript, we can just return it from a normal function, and call the function instead.
</p>

<p class="pb-4">
	Here, each element is created with <code>document.createElement()</code> and <code>document.createTextNode()</code>. They don't show immediately in the browser yet though, since they aren't part of the Document Object Model, or the DOM. The <code>addChildren</code> functions here are used to add the elements as parents of each other, and then finally we use <code>document.body.appendChild()</code> to add the parent element to the DOM.
</p>

<p>
	We could do this final part of parenting elements to the DOM with our <code>addChildren()</code> function as well:
</p>

<Code filename="index.js" code={`
+	addChildren(document.body, [
+		createPart(
-		document.body.appendChild(createPart(
			"Part 1",
			"This is part 1."
-		))
+		),
-		document.body.appendChild(createPart(
+		createPart(
			"Part 2",
			"Here's another part!"
-		))
+		),
+	])
`} />

<p>
	You may have heard of other systems that allow you to write HTML templates in JavaScript, such as <a href="https://react.dev">React</a> or <a href="https://vuejs.org">Vue</a>. These allow you to build your entire app in a way similar to this, in that the HTML file is just an empty stub that gets filled in by the JavaScript code. So, creating these elements, parenting to the DOM, and updating them based on what you want code to do with them &ndash; is this how these frameworks work under the hood? Well, it's close, though not quite there yet.
</p>
