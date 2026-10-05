import type { FeedbackElementTarget, FeedbackMode, FeedbackTarget } from './types.js';

export const MAX_GROUP_ELEMENTS = 50;
export type SelectionRect = { x: number; y: number; width: number; height: number };

const ignored =
	'[data-feedback-ui], [data-feedback-ignore], input, textarea, select, [contenteditable]:not([contenteditable="false"])';

export function canInspect(element: Element, scope?: string): boolean {
	if (element.getRootNode() !== element.ownerDocument) return false;
	if (element.matches('html, body, script, style') || element.closest(ignored)) return false;
	try {
		return !scope || Boolean(element.closest(scope));
	} catch {
		return false;
	}
}

/** Prefer author-supplied stable identities; use a unique structural path only as a fallback. */
export function elementSelector(element: Element): string {
	const doc = element.ownerDocument;
	const unique = (selector: string) => doc.querySelectorAll(selector).length === 1;
	const parts: string[] = [];
	for (let node: Element | null = element; node; node = node.parentElement) {
		for (const name of ['data-feedback-id', 'data-testid', 'id']) {
			const value = node.getAttribute(name);
			if (!value) continue;
			const selector = `[${name}="${CSS.escape(value)}"]`;
			if (unique(selector)) return [selector, ...parts].join(' > ');
		}
		const tag = node.localName;
		const siblings = node.parentElement
			? [...node.parentElement.children].filter((item) => item.localName === tag)
			: [];
		parts.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${siblings.indexOf(node) + 1})` : tag);
		if (unique(parts.join(' > '))) return parts.join(' > ');
	}
	return parts.join(' > ');
}

function safeText(element: Element): string {
	const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
		acceptNode: (node) =>
			node.parentElement?.closest(`${ignored}, script, style`)
				? NodeFilter.FILTER_REJECT
				: NodeFilter.FILTER_ACCEPT
	});
	let value = '';
	while (walker.nextNode() && value.length < 500)
		value += ` ${walker.currentNode.textContent ?? ''}`;
	return value.replace(/\s+/g, ' ').trim().slice(0, 500);
}

/** A bounded, readable hover label that never includes excluded descendant text. */
export function describeElement(element: Element): string {
	const kind = /^h[1-6]$/.test(element.localName)
		? 'heading'
		: (({ p: 'paragraph', a: 'link', img: 'image' } as Record<string, string>)[element.localName] ??
			element.localName);
	const label = (
		element.getAttribute('aria-label') ||
		element.getAttribute('alt') ||
		safeText(element)
	).slice(0, 64);
	return label ? `${kind}: “${label}”` : kind;
}

export function captureTarget(element: Element, mode: FeedbackMode): FeedbackElementTarget {
	const rect = element.getBoundingClientRect();
	const text = safeText(element);
	const target: FeedbackElementTarget = {
		kind: 'element',
		selector: elementSelector(element),
		tag: element.localName,
		text,
		label: (
			element.getAttribute('aria-label') ||
			element.getAttribute('alt') ||
			text ||
			element.localName
		).slice(0, 240),
		rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
	};
	if (mode === 'developer') {
		const styles = getComputedStyle(element);
		target.styles = Object.fromEntries(
			[
				'display',
				'font-size',
				'font-weight',
				'color',
				'background-color',
				'padding',
				'gap',
				'border-radius'
			].map((key) => [key, styles.getPropertyValue(key)])
		);
	}
	return target;
}

/** Do not put a pin on a different element after a structural selector becomes stale. */
export function resolveTarget(target: FeedbackTarget, scope?: string): Element | null {
	if (target.kind !== 'element') return null;
	try {
		const matches = document.querySelectorAll(target.selector);
		const element = matches.length === 1 ? matches[0] : null;
		if (!element || !canInspect(element, scope) || element.localName !== target.tag) return null;
		const stable =
			/^\[(data-feedback-id|data-testid|id)=/.test(target.selector) &&
			!target.selector.includes(' > ');
		return stable || safeText(element) === target.text ? element : null;
	} catch {
		return null;
	}
}

export type BoxCandidate = { element: Element; rect: SelectionRect };

/** Read geometry once per drag, invalidated by page mutations and layout changes. */
export function captureBoxCandidates(scope?: string): BoxCandidate[] {
	let roots: Element[];
	try {
		roots = scope ? [...document.querySelectorAll(scope)] : [document.body];
	} catch {
		return [];
	}
	const candidates = new Set(roots.flatMap((root) => [root, ...root.querySelectorAll('*')]));
	const measured: BoxCandidate[] = [];
	for (const element of candidates) {
		if (!canInspect(element, scope)) continue;
		const rect = element.getBoundingClientRect();
		// A viewport-bound selection cannot enclose offscreen or empty elements.
		if (
			rect.width <= 0 ||
			rect.height <= 0 ||
			rect.right < 0 ||
			rect.bottom < 0 ||
			rect.left > innerWidth ||
			rect.top > innerHeight
		)
			continue;
		if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
		measured.push({ element, rect });
	}
	return measured;
}

/** Candidates are in document order, so only the last selected ancestor can contain this node. */
export function candidatesInBox(box: SelectionRect, candidates: BoxCandidate[]): BoxCandidate[] {
	const selected: BoxCandidate[] = [];
	for (const candidate of candidates) {
		const { element, rect } = candidate;
		if (
			rect.x >= box.x &&
			rect.y >= box.y &&
			rect.x + rect.width <= box.x + box.width &&
			rect.y + rect.height <= box.y + box.height &&
			!selected.at(-1)?.element.contains(element)
		)
			selected.push(candidate);
	}
	return selected;
}

/** Always refresh on release so saved targets reflect the current page. */
export function elementsInBox(box: SelectionRect, scope?: string): Element[] {
	return candidatesInBox(box, captureBoxCandidates(scope)).map(({ element }) => element);
}

export function unionRect(rects: SelectionRect[]): SelectionRect | null {
	if (!rects.length) return null;
	const x = Math.min(...rects.map((rect) => rect.x));
	const y = Math.min(...rects.map((rect) => rect.y));
	return {
		x,
		y,
		width: Math.max(...rects.map((rect) => rect.x + rect.width)) - x,
		height: Math.max(...rects.map((rect) => rect.y + rect.height)) - y
	};
}

export function captureGroup(elements: Element[], mode: FeedbackMode): FeedbackTarget {
	const members = elements.map((element) => captureTarget(element, mode));
	if (members.length === 1) return members[0];
	return {
		kind: 'group',
		selector: '',
		label: `${members.length} elements`,
		tag: '',
		text: members
			.map((member) => member.text)
			.join(' · ')
			.slice(0, 500),
		rect: unionRect(members.map((member) => member.rect!)) ?? undefined,
		elements: members
	};
}

export function resolveTargets(target: FeedbackTarget, scope?: string): Element[] {
	return (target.kind === 'group' ? (target.elements ?? []) : [target])
		.map((member) => resolveTarget(member, scope))
		.filter((element): element is Element => element !== null);
}
