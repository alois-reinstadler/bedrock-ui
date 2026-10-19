import { MAX_TEXT_CHANGE } from './model.js';
import { resolveTarget } from './target.js';
import type { FeedbackTarget } from './types.js';

/** Only edit a single plain-text leaf. Never flatten links, icons, controls or private children. */
export function textEditTarget(target: FeedbackTarget, scope?: string): HTMLElement | null {
	const element = resolveTarget(target, scope);
	if (
		!(element instanceof HTMLElement) ||
		element.children.length ||
		!element.matches(
			'h1,h2,h3,h4,h5,h6,p,span,a,button,strong,em,small,li,blockquote,figcaption,dt,dd'
		) ||
		!element.textContent?.trim() ||
		element.textContent.length > MAX_TEXT_CHANGE
	)
		return null;
	return element;
}

export type TextEditor = { element: HTMLElement; stop: () => void };

/** A temporary plain-text preview. Restore the original nodes, preserving framework references. */
export function editText(
	element: HTMLElement,
	value: string,
	onInput: (value: string) => void,
	onConflict: () => void
): TextEditor {
	const nodes = [...element.childNodes].map((node) => ({ node, value: node.textContent }));
	const editable = element.getAttribute('contenteditable');
	const controller = new AbortController();
	let stopped = false;
	element.setAttribute('contenteditable', 'plaintext-only');
	// Even equal text must use a new node: typing must never mutate a saved framework node.
	element.replaceChildren(document.createTextNode(value));
	let lastMarkup = element.innerHTML;
	const contains = (event: Event) => event.composedPath().includes(element);
	const options = { capture: true, signal: controller.signal };
	window.addEventListener(
		'input',
		(event) => {
			if (!contains(event)) return;
			event.stopImmediatePropagation();
			let value = element.innerText;
			if (value.length > MAX_TEXT_CHANGE) {
				value = value.slice(0, MAX_TEXT_CHANGE);
				element.textContent = value;
			}
			lastMarkup = element.innerHTML;
			onInput(value);
		},
		options
	);
	// Editing a link or button must not navigate, submit a form or invoke the host control.
	window.addEventListener(
		'click',
		(event) => {
			if (!contains(event)) return;
			event.preventDefault();
			event.stopImmediatePropagation();
		},
		options
	);
	for (const name of ['pointerdown', 'keydown', 'keyup', 'beforeinput'] as const) {
		window.addEventListener(
			name,
			(event) => {
				if (contains(event)) event.stopImmediatePropagation();
			},
			options
		);
	}
	const observer = new MutationObserver(() => {
		if (
			element.innerHTML !== lastMarkup ||
			nodes.some((entry) => entry.node.textContent !== entry.value)
		) {
			stop(); // An application update wins over this temporary preview.
			onConflict();
		}
	});
	observer.observe(element, { childList: true, characterData: true, subtree: true });
	// Framework bindings may update the original text node even while it is detached.
	for (const { node } of nodes) observer.observe(node, { characterData: true });
	function stop() {
		if (stopped) return;
		stopped = true;
		observer.disconnect();
		controller.abort();
		if (element.innerHTML === lastMarkup) {
			element.replaceChildren(...nodes.map((entry) => entry.node));
		}
		if (element.getAttribute('contenteditable') === 'plaintext-only') {
			if (editable === null) element.removeAttribute('contenteditable');
			else element.setAttribute('contenteditable', editable);
		}
	}
	element.focus({ preventScroll: true });
	const range = document.createRange();
	range.selectNodeContents(element);
	const selection = window.getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
	return { element, stop };
}
