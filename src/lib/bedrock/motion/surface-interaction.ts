import type { Attachment } from 'svelte/attachments';

/** Decoration only: Bits remains the sole presence and focus owner. */
export const surfaceInteraction: Attachment<HTMLElement> = (node) => {
	const settle = () => node.setAttribute('data-motion-settled', '');
	const prepare = () => {
		node.removeAttribute('data-motion-settled');
		// An autofocus on the menu container is not a focused action. Actual item
		// focus/highlight must settle immediately, including keyboard-open menus.
		if (
			node.querySelector('[data-highlighted]') ||
			(node.contains(document.activeElement) && document.activeElement !== node)
		)
			settle();
		const items = node.querySelectorAll<HTMLElement>('[role^="menuitem"]');
		items.forEach((item, index) => {
			if (item.closest('[role="menu"]') !== node) return;
			item.querySelectorAll<SVGElement>('svg[aria-hidden="true"]').forEach((icon) => {
				if (index > 0 && index < 5) icon.setAttribute('data-menu-motion-icon', String(index));
			});
		});
	};
	const focus = (event: FocusEvent) => {
		if (event.target !== node) settle();
	};
	prepare();
	const observer = new MutationObserver((records) => {
		if (
			records.some((record) => record.target === node && record.attributeName === 'data-state') &&
			node.getAttribute('data-state') === 'open'
		)
			prepare();
		if (node.querySelector('[data-highlighted]')) settle();
	});
	observer.observe(node, {
		attributes: true,
		subtree: true,
		attributeFilter: ['data-state', 'data-highlighted']
	});
	node.addEventListener('focusin', focus);
	node.addEventListener('pointermove', settle, { passive: true });
	node.addEventListener('keydown', settle);
	node.addEventListener('pointerdown', settle);
	return () => {
		observer.disconnect();
		node.removeEventListener('focusin', focus);
		node.removeEventListener('pointermove', settle);
		node.removeEventListener('keydown', settle);
		node.removeEventListener('pointerdown', settle);
		node.removeAttribute('data-motion-settled');
		node
			.querySelectorAll('[data-menu-motion-icon]')
			.forEach((icon) => icon.removeAttribute('data-menu-motion-icon'));
	};
};

/** An exiting retained surface is never a second interactive/semantic layer. */
export const surfacePresence: Attachment<HTMLElement> = (node) => {
	const originalHidden = node.getAttribute('aria-hidden');
	const originalInert = node.inert;
	const sync = () => {
		const closed = node.getAttribute('data-state') === 'closed' || node.hasAttribute('data-closed');
		node.inert = closed || originalInert;
		if (closed) node.setAttribute('aria-hidden', 'true');
		else if (originalHidden === null) node.removeAttribute('aria-hidden');
		else node.setAttribute('aria-hidden', originalHidden);
	};
	sync();
	const observer = new MutationObserver(sync);
	observer.observe(node, { attributes: true, attributeFilter: ['data-state', 'data-closed'] });
	return () => {
		observer.disconnect();
		node.inert = originalInert;
		if (originalHidden === null) node.removeAttribute('aria-hidden');
		else node.setAttribute('aria-hidden', originalHidden);
	};
};
