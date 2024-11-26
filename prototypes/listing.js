const listing = document.querySelector('#listing')
console.log('listing', listing)

for (const link of Array.from(listing?.children ?? [])) {
	console.log('link', link)
	let href = link.getAttribute('href') ?? ''
	if (href.endsWith('/index.html')) href = href.slice(0, -10) // Remove /index.html
	link.textContent = href
}
