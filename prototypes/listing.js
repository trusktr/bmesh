const listing = document.querySelector('#listing')

for (const link of Array.from(listing?.children ?? [])) {
	let href = link.getAttribute('href') ?? ''
	if (href.endsWith('/index.html')) href = href.slice(0, -10) // Remove /index.html
	link.textContent = href
}
