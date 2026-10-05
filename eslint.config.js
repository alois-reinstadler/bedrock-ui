import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		files: ['src/routes/**/*.{ts,svelte}', 'src/lib/{site,templates}/**/*.{ts,svelte}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['#lib/shadcn/**', '#lib/components/ui/**', '$lib/shadcn/**'],
							message: 'Product and documentation surfaces consume the Bedrock public API.'
						}
					]
				}
			]
		}
	},
	{
		files: ['src/lib/bedrock/**/*.{ts,svelte}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: [
								'#lib/site/**',
								'#lib/templates/**',
								'#lib/server/**',
								'$lib/site/**',
								'$lib/templates/**',
								'$lib/server/**',
								'$app/**'
							],
							message:
								'Bedrock must stay independent of application routes, documentation and templates.'
						}
					]
				}
			]
		}
	},
	{
		files: ['src/**/*.e2e.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@playwright/test',
							importNames: ['test', 'default'],
							message:
								'Import test from scripts/shared-browser-test so suites share the configured browser lifecycle.'
						}
					]
				}
			]
		}
	}
);
