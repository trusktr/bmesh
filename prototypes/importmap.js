{
	const script = document.currentScript

	// F.e. grab the "../../" in "src="../../importmap.js"
	const base = script?.getAttribute('src')?.split('importmap.js')[0]
	if (!base) throw new Error('invalid importmap path')

	/** @type {Record<string, string>} */
	const relativeImports = {
		bmesh: '../dist/index.js',
	}

	for (const key in relativeImports) relativeImports[key] = base + relativeImports[key]

	/** @type {Record<string, string>} */
	const absoluteImports = {
		three: 'https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.module.js',
		'three/addons/': 'https://cdn.jsdelivr.net/npm/three@0.148.0/examples/jsm/',
		'three/': 'https://cdn.jsdelivr.net/npm/three@0.148.0/',
	}

	const allImports = { ...relativeImports, ...absoluteImports }

	/** Identity template tag for syntax highlighting/formatting html in JS. */
	const html = (strings, ...values) => String.raw(strings, ...values)

	document.write(html`
		<script type="importmap">
			{
				"imports": ${JSON.stringify(allImports)}
			}
		</script>
	`)
}
