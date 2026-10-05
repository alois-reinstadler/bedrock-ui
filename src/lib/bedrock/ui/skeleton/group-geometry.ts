import type { Attachment } from 'svelte/attachments';

// Share one gradient coordinate system, then let each native placeholder's
// background clip it to its own shape. No overlay, cloned shapes, or frame loop.
export function createGroupGeometry(): {
	attach: Attachment<HTMLDivElement>;
	register: Attachment<HTMLElement>;
} {
	let root: HTMLDivElement | undefined;
	let resize: ResizeObserver | undefined;
	let frame = 0;
	const items = new Set<HTMLElement>();
	const observed = new Set<Element>();

	function setLength(node: HTMLElement, name: string, value: number) {
		const next = `${Math.round(value * 1000) / 1000}px`;
		if (node.style.getPropertyValue(name) !== next) node.style.setProperty(name, next);
	}

	function measure() {
		frame = 0;
		if (!root) return;
		const bounds = root.getBoundingClientRect();
		const style = getComputedStyle(root);
		let width = parseFloat(style.width);
		let height = parseFloat(style.height);
		if (style.boxSizing === 'content-box') {
			width +=
				parseFloat(style.paddingLeft) +
				parseFloat(style.paddingRight) +
				parseFloat(style.borderLeftWidth) +
				parseFloat(style.borderRightWidth);
			height +=
				parseFloat(style.paddingTop) +
				parseFloat(style.paddingBottom) +
				parseFloat(style.borderTopWidth) +
				parseFloat(style.borderBottomWidth);
		}
		if (!width || !height || !bounds.width || !bounds.height) return;
		const scaleX = bounds.width / width;
		const scaleY = bounds.height / height;
		// Read all geometry before writing styles. Ancestor transforms and scrolling
		// move the group and its children together, without shifting their phase.
		const positions = [...items].map((node) => {
			const item = node.getBoundingClientRect();
			return { node, x: (item.left - bounds.left) / scaleX, y: (item.top - bounds.top) / scaleY };
		});
		setLength(root, '--skeleton-group-width', width);
		setLength(root, '--skeleton-group-height', height);
		for (const { node, x, y } of positions) {
			setLength(node, '--skeleton-group-x', x);
			setLength(node, '--skeleton-group-y', y);
		}
	}

	function schedule() {
		if (root && !frame) frame = requestAnimationFrame(measure);
	}

	function observeLayout() {
		if (!root || !resize) return;
		const next = new Set<Element>([root]);
		for (const item of items) {
			for (let node: Element | null = item; node && node !== root; node = node.parentElement) {
				next.add(node);
			}
		}
		for (const node of observed) if (!next.has(node)) resize.unobserve(node);
		for (const node of next) if (!observed.has(node)) resize.observe(node);
		observed.clear();
		for (const node of next) observed.add(node);
	}

	return {
		attach(node) {
			root = node;
			resize = new ResizeObserver(schedule);
			const mutations = new MutationObserver(() => {
				observeLayout();
				schedule();
			});
			mutations.observe(node, {
				subtree: true,
				childList: true,
				attributes: true,
				attributeFilter: ['class', 'style', 'hidden', 'dir']
			});
			observeLayout();
			schedule();
			node.addEventListener('scroll', schedule, true);
			window.addEventListener('resize', schedule);
			return () => {
				cancelAnimationFrame(frame);
				frame = 0;
				mutations.disconnect();
				resize?.disconnect();
				observed.clear();
				node.removeEventListener('scroll', schedule, true);
				window.removeEventListener('resize', schedule);
				node.style.removeProperty('--skeleton-group-width');
				node.style.removeProperty('--skeleton-group-height');
				root = undefined;
				resize = undefined;
			};
		},
		register(node) {
			items.add(node);
			observeLayout();
			schedule();
			return () => {
				items.delete(node);
				node.style.removeProperty('--skeleton-group-x');
				node.style.removeProperty('--skeleton-group-y');
				observeLayout();
				schedule();
			};
		}
	};
}
