import { createHighlighter } from 'shiki';

const highlighter = createHighlighter({
	themes: ['github-light-default', 'github-dark-default'],
	langs: ['typescript', 'svelte']
});
const cache = new Map<string, string>();

/** Only trusted Shiki-generated HTML leaves this server-only module. */
export async function highlight(code: string, language: 'typescript' | 'svelte') {
	const key = `${language}\0${code}`;
	const cached = cache.get(key);
	if (cached !== undefined) return cached;
	const html = (await highlighter).codeToHtml(code, {
		lang: language,
		themes: { light: 'github-light-default', dark: 'github-dark-default' },
		defaultColor: false
	});
	if (cache.size >= 200) cache.delete(cache.keys().next().value!);
	cache.set(key, html);
	return html;
}
