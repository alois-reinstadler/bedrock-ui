/** Stable identities are application-owned; labels may be localized. */
export type ChatContext = { id: string; label: string; description?: string; disabled?: boolean };
export type ChatCommand = { id: string; label: string; description?: string; disabled?: boolean };
export type ChatSource = {
	id: string;
	title: string;
	href?: string;
	description?: string;
	excerpt?: string;
	kind?: string;
};
export type ChatQuestion = {
	id: string;
	label: string;
	description?: string;
	options: { value: string; label: string }[];
	allowCustom?: boolean;
	required?: boolean;
};
export type ChatActivityStep = {
	id: string;
	title: string;
	kind?: 'tool' | 'task' | 'reasoning';
	status: 'pending' | 'running' | 'complete' | 'error';
	duration?: string;
	progress?: number;
	detail?: string;
	children?: { id: string; label: string; detail?: string }[];
};
export type ChatRecommendationOption = {
	id: string;
	title: string;
	description?: string;
	confidence?: string;
};
/** App-computed review units; the component does not calculate or apply patches. */
export type ChatChange = {
	id: string;
	title: string;
	before: string;
	after: string;
	language?: string;
};
export type ChatSelectionAction = { id: string; label: string };

/** Source links accept web URLs and local paths/fragments, never executable schemes. */
export function chatSourceHref(value?: string): string | undefined {
	if (!value) return undefined;
	const href = value.trim();
	if ([...href].some((char) => char.charCodeAt(0) <= 32 || char === '\\')) return undefined;
	if (/^https?:\/\//i.test(href)) {
		try {
			const url = new URL(href);
			return url.hostname ? url.href : undefined;
		} catch {
			return undefined;
		}
	}
	if (href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'))) return href;
	return undefined;
}

/** Only a token ending at the collapsed caret activates autocomplete. */
export function chatPromptToken(text: string, start: number, end = start) {
	if (start !== end) return null;
	const match = /(?:^|\s)([@/])([^\s@/]*)$/.exec(text.slice(0, start));
	return match
		? {
				trigger: match[1] as '@' | '/',
				query: match[2],
				start: start - match[2].length - 1,
				end: start
			}
		: null;
}

/** A valid whole-file unified diff. Consumers may supply smaller review units for granular changes. */
export function chatChangeDiff(change: Pick<ChatChange, 'before' | 'after'>): string {
	const lines = (value: string) => (value === '' ? [] : value.replace(/\n$/, '').split('\n'));
	const before = lines(change.before),
		after = lines(change.after);
	const oldLines = before.map((line) => `-${line}`),
		newLines = after.map((line) => `+${line}`);
	if (before.length && !change.before.endsWith('\n')) oldLines.push('\\ No newline at end of file');
	if (after.length && !change.after.endsWith('\n')) newLines.push('\\ No newline at end of file');
	return [
		'--- before',
		'+++ after',
		`@@ -${before.length ? 1 : 0},${before.length} +${after.length ? 1 : 0},${after.length} @@`,
		...oldLines,
		...newLines
	].join('\n');
}
