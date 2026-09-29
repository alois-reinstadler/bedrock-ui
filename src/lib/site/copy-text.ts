/** Clipboard API on HTTPS/localhost, with a selection-based fallback for tailnet HTTP. */
export async function copyText(text: string): Promise<void> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return;
		}
	} catch {
		// Permission denial can still permit a user-initiated legacy copy.
	}
	const previous = document.activeElement;
	const selection = document.getSelection();
	const ranges = selection
		? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange())
		: [];
	const field = document.createElement('textarea');
	field.value = text;
	field.setAttribute('readonly', '');
	field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
	document.body.append(field);
	try {
		field.select();
		if (!document.execCommand('copy')) throw new Error('Copy unavailable');
	} finally {
		field.remove();
		if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
		selection?.removeAllRanges();
		for (const range of ranges) selection?.addRange(range);
	}
}
