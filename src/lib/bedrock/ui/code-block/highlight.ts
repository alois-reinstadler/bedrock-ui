import { readable } from 'svelte/store';
import type { BundledLanguage, createHighlighter as CreateHighlighter } from 'shiki';

export type CodeToken = { text: string; style?: string };
export type CodeLineData = { text: string; tokens?: readonly CodeToken[] };

export function plainLines(code: string): CodeLineData[] {
	return code.split(/\r\n|\n/).map((text) => ({ text }));
}

let highlighterPromise: ReturnType<typeof CreateHighlighter> | undefined;
const cache = new Map<string, Promise<CodeLineData[] | undefined>>();
const CACHE_LIMIT = 100;

/** Highlight whole documents so tokens retain multiline grammar context. */
export function highlightCode(code: string, language: string) {
	const lang = language.trim().toLowerCase();
	if (typeof window === 'undefined' || ['', 'plaintext', 'text', 'txt'].includes(lang)) {
		return undefined;
	}
	const key = `${lang}\u0000${code}`;
	const cached = cache.get(key);
	if (cached) return cached;
	const pending = loadHighlight(code, lang);
	if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
	cache.set(key, pending);
	return pending;
}

async function loadHighlight(code: string, language: string): Promise<CodeLineData[] | undefined> {
	try {
		const shiki = await import('shiki');
		highlighterPromise ??= shiki.createHighlighter({
			themes: ['github-light-default', 'github-dark-default'],
			langs: []
		});
		const highlighter = await highlighterPromise;
		const lang = language as BundledLanguage;
		if (!highlighter.getLoadedLanguages().includes(lang)) await highlighter.loadLanguage(lang);
		const { tokens } = highlighter.codeToTokens(code, {
			lang,
			themes: { light: 'github-light-default', dark: 'github-dark-default' },
			defaultColor: false
		});
		const fallback = plainLines(code);
		if (tokens.length !== fallback.length) return undefined;
		return tokens.map((line, index) => ({
			text: fallback[index].text,
			tokens:
				line.map((token) => token.content).join('') !== fallback[index].text
					? undefined
					: line.map((token) => ({
							text: token.content,
							style: Object.entries(token.htmlStyle ?? {})
								.map(([key, value]) => `${key}:${value}`)
								.join(';')
						}))
		}));
	} catch {
		// Unknown grammars or unavailable assets keep the escaped plain-text fallback.
		return undefined;
	}
}

/** An async source that starts with current plaintext and ignores stale completions. */
export function createCodeSource(code: string, language: string) {
	return readable<readonly CodeLineData[]>(plainLines(code), (set) => {
		let active = true;
		const pending = highlightCode(code, language);
		void pending?.then((lines) => {
			if (active && lines) set(lines);
		});
		return () => {
			active = false;
		};
	});
}
