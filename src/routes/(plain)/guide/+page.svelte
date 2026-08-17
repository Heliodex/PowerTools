<script lang="ts">
	import Code from "#components/Code.svelte"
</script>

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

Usually, the next step is to start adding some content to the page by placing markup tags inside the &lt;body&gt; section.


<Code filename="index.html" code={`
	<body>
+		<h1>Hello, World!</h1>
	</body>
`} />

We're going to take a different route here by adding a script instead, which we'll control the entire page from.

<Code filename="index.html" code={`
	<head>
		<meta charset="utf-8">
+		<script type="module" src="index.js"><\/script>
	</head>

	<body>
-		<h1>Hello, World!</h1>
	</body>
`} />

You may know that you can add elements to a page via JavaScript by using functions on the global <code>document</code> object:

<Code filename="index.js" code={`
	const heading = document.createElement("h1")
	heading.textContent = "Hello, World!"
	document.body.appendChild(heading)
`} />

Or, alternatively, using <code>document.createTextNode</code> to create the text node and then appending it to the heading element:

<Code filename="index.js" code={`
	const heading = document.createElement("h1")
-	heading.textContent = "Hello, World!"
+	const text = document.createTextNode("Hello, world!")
+	heading.appendChild(text)
	document.body.appendChild(heading)
`} />
