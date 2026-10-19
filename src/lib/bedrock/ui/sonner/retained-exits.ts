/** Sonner keeps its own timers and gestures; this only retires accessibility targets. */
export function retireToastExits(root: HTMLElement) {
	const saved = new WeakMap<HTMLElement, { inert: boolean; hidden: string | null }>();
	let returnFocus =
		document.activeElement instanceof HTMLElement && !root.contains(document.activeElement)
			? document.activeElement
			: null;

	function rememberFocus(event: FocusEvent) {
		if (event.target instanceof HTMLElement && !root.contains(event.target)) {
			returnFocus = event.target;
		}
	}

	function usable(node: HTMLElement | null): node is HTMLElement {
		return Boolean(
			node?.isConnected &&
			node !== document.body &&
			node !== document.documentElement &&
			!node.closest('[inert], [aria-hidden="true"]') &&
			!node.matches(':disabled')
		);
	}

	function restoreFocus(toast: HTMLElement) {
		if (!toast.contains(document.activeElement)) return;
		const next = [
			...root.querySelectorAll<HTMLElement>('[data-sonner-toast][data-visible="true"]')
		].find((node) => node !== toast && node.dataset.removed !== 'true' && usable(node));
		const candidates = [
			next,
			returnFocus,
			root.querySelector<HTMLElement>('section[tabindex="-1"]')
		];
		for (const target of candidates) {
			if (!target || !usable(target)) continue;
			target.focus({ preventScroll: true });
			if (document.activeElement === target) return;
		}
	}

	function sync() {
		for (const toast of root.querySelectorAll<HTMLElement>('[data-sonner-toast]')) {
			if (toast.dataset.removed === 'true') {
				if (!saved.has(toast)) {
					saved.set(toast, { inert: toast.inert, hidden: toast.getAttribute('aria-hidden') });
				}
				// Move focus before hiding its old ancestor from accessibility APIs.
				restoreFocus(toast);
				toast.inert = true;
				toast.setAttribute('aria-hidden', 'true');
			} else {
				// Sonner can revive the same keyed toast before its exit timeout finishes.
				const original = saved.get(toast);
				if (!original) continue;
				toast.inert = original.inert;
				if (original.hidden === null) toast.removeAttribute('aria-hidden');
				else toast.setAttribute('aria-hidden', original.hidden);
				saved.delete(toast);
			}
		}
	}

	const observer = new MutationObserver(sync);
	observer.observe(root, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['data-removed']
	});
	document.addEventListener('focusin', rememberFocus);
	sync();
	return () => {
		observer.disconnect();
		document.removeEventListener('focusin', rememberFocus);
	};
}
