/** @type {import('prettier').Config} */
export default {
	printWidth: 120,
	semi: false,
	singleQuote: true,
	trailingComma: 'all',
	arrowParens: 'avoid',
	useTabs: true,

	overrides: [
		{
			files: '*.md',
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
}
