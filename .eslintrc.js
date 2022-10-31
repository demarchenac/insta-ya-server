module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
		node: true,
	},
	extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-console': 'error',
		'no-duplicate-imports': ['error', { includeExports: true }],
		'no-self-compare': 'error',
		'no-template-curly-in-string': 'warn',
		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
		'no-use-before-define': 'error',
		// Suggestions
		curly: 'error',
		'default-case': 'error',
		eqeqeq: 'error',
		// Plugins
		// 'prettier/prettier': ['error', { tabWidth: 2, useTabs: true }],
		'prettier/prettier': 'error',
	},
};
