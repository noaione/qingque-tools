module.exports = {
	root: true,
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:svelte/recommended", "prettier"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		extraFileExtensions: [".svelte"]
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser"
			}
		}
	],
	rules: {
		quotes: [
			"error",
			"double",
			{
				allowTemplateLiterals: true
			}
		],
		semi: [
			"error",
			"always",
			{
				omitLastInOneLineBlock: true
			}
		],
		"no-trailing-spaces": "error",
		"max-len": [
			"error",
			{
				code: 120,
				tabWidth: 4,
				ignoreComments: true,
				ignoreUrls: true,
				ignoreRegExpLiterals: true,
				ignoreTemplateLiterals: true,
				ignoreStrings: true
			}
		],
		"comma-dangle": [
			"error",
			{
				arrays: "only-multiline",
				objects: "only-multiline",
				functions: "never",
				imports: "only-multiline",
				exports: "never"
			}
		],
		"no-empty": ["error", { allowEmptyCatch: true }],
		"eol-last": ["warn", "always"],
		"no-constant-condition": ["error", { checkLoops: false }],
		"sort-imports": [
			"warn",
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
				allowSeparatedGroups: true
			}
		]
	}
};
