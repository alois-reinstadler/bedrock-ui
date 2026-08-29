import type { Attachment } from 'svelte/attachments';
import {
	boxFromRect,
	captureBox,
	constrainInvert,
	cssInverseScale,
	cssInvert,
	hasScaleInvert,
	invertTransform,
	isDegenerateBox,
	isSignificantInvert,
	layoutEasing,
	prefersReducedMotion,
	type LayoutBox,
	type LayoutType
} from './layout-math.js';

export type LayoutOptions = {
	id?: string;
	type?: LayoutType;
};

type LayoutNode = {
	el: HTMLElement;
	options: LayoutOptions;
	lastLayout: LayoutBox;
	animation: Animation | null;
	contentAnimation: Animation | null;
};

type SharedSnapshot = {
	box: LayoutBox;
	at: number;
};

const SHARED_TTL_MS = 480;
const PLAY_MS = 520;
const groups = new WeakMap<HTMLElement, LayoutGroupHandle>();

export type LayoutGroupHandle = {
	bindRoot: (element: HTMLElement) => () => void;
	register: (el: HTMLElement, options?: LayoutOptions) => () => void;
	destroy: () => void;
};

function findGroup(from: HTMLElement): LayoutGroupHandle {
	let node: HTMLElement | null = from;
	while (node) {
		const group = groups.get(node);
		if (group) return group;
		node = node.parentElement;
	}
	throw new Error('layout() must be used inside <LayoutGroup>');
}

function styleWithoutTransform(value: string): string {
	return value.replace(/transform(-origin)?:[^;]*;?/gi, '').replace(/\s+/g, '');
}

export function createLayoutGroup(): LayoutGroupHandle {
	const nodes = new Set<LayoutNode>();
	const shared = new Map<string, SharedSnapshot>();
	let mutationObserver: MutationObserver | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let applying = false;
	let scheduled = false;
	let bound: HTMLElement | null = null;
	let flushWindowStart = 0;
	let flushesInWindow = 0;

	function measureUntransformed(el: HTMLElement): LayoutBox {
		const previous = el.style.transform;
		el.style.transform = 'none';
		const box = boxFromRect(el.getBoundingClientRect());
		el.style.transform = previous;
		return box;
	}

	function takeShared(id: string): LayoutBox | undefined {
		const snapshot = shared.get(id);
		if (!snapshot) return undefined;
		shared.delete(id);
		if (performance.now() - snapshot.at > SHARED_TTL_MS) return undefined;
		if (isDegenerateBox(snapshot.box)) return undefined;
		return snapshot.box;
	}

	function stashShared(id: string | undefined, box: LayoutBox) {
		if (!id || isDegenerateBox(box)) return;
		shared.set(id, { box, at: performance.now() });
	}

	function contentEl(node: LayoutNode): HTMLElement | null {
		return node.el.querySelector(':scope > [data-layout-invert]');
	}

	function stop(node: LayoutNode) {
		node.animation?.cancel();
		node.contentAnimation?.cancel();
		node.animation = null;
		node.contentAnimation = null;
	}

	function play(node: LayoutNode, from: LayoutBox, to: LayoutBox) {
		node.lastLayout = to;
		stashShared(node.options.id, to);
		if (prefersReducedMotion() || isDegenerateBox(from) || isDegenerateBox(to)) {
			stop(node);
			return;
		}

		const invert = constrainInvert(invertTransform(from, to), node.options.type ?? 'both');
		if (!isSignificantInvert(invert)) {
			return;
		}

		stop(node);
		const scaled = hasScaleInvert(invert);
		const easing = layoutEasing({ scale: scaled });
		const animation = node.el.animate(
			[
				{ transformOrigin: '0 0', transform: cssInvert(invert) },
				{ transformOrigin: '0 0', transform: 'none' }
			],
			{ duration: PLAY_MS, easing, fill: 'both' }
		);
		node.animation = animation;

		const inner = scaled ? contentEl(node) : null;
		if (inner) {
			const contentAnimation = inner.animate(
				[
					{ transformOrigin: '0 0', transform: cssInverseScale(invert) },
					{ transformOrigin: '0 0', transform: 'none' }
				],
				{ duration: PLAY_MS, easing, fill: 'both' }
			);
			node.contentAnimation = contentAnimation;
			contentAnimation.finished
				.then(() => {
					if (node.contentAnimation !== contentAnimation) return;
					contentAnimation.cancel();
					node.contentAnimation = null;
				})
				.catch(() => {
					if (node.contentAnimation === contentAnimation) {
						node.contentAnimation = null;
					}
				});
		}

		animation.finished
			.then(() => {
				if (node.animation !== animation) return;
				animation.cancel();
				node.animation = null;
			})
			.catch(() => {
				if (node.animation === animation) {
					node.animation = null;
				}
			});
	}

	function flush() {
		if (nodes.size === 0) return;
		applying = true;
		const jobs: { node: LayoutNode; from: LayoutBox; to: LayoutBox }[] = [];

		for (const node of nodes) {
			if (!node.el.isConnected) continue;
			const visual = boxFromRect(node.el.getBoundingClientRect());
			const inFlight = Boolean(node.animation && node.animation.playState !== 'finished');
			const from =
				inFlight && !isDegenerateBox(visual)
					? visual
					: isDegenerateBox(node.lastLayout)
						? visual
						: node.lastLayout;
			stop(node);
			const to = measureUntransformed(node.el);
			if (isDegenerateBox(from) || isDegenerateBox(to)) {
				if (!isDegenerateBox(to)) {
					node.lastLayout = to;
					stashShared(node.options.id, to);
				}
				continue;
			}
			stashShared(node.options.id, to);
			jobs.push({ node, from, to });
		}

		for (const job of jobs) {
			play(job.node, job.from, job.to);
		}
		mutationObserver?.takeRecords();
		applying = false;
	}

	function schedule() {
		if (scheduled || applying) return;
		const now = performance.now();
		if (now - flushWindowStart > 100) {
			flushWindowStart = now;
			flushesInWindow = 0;
		}
		if (flushesInWindow >= 24) return;
		scheduled = true;
		queueMicrotask(() => {
			scheduled = false;
			flushesInWindow += 1;
			flush();
		});
	}

	function styleChangedBeyondTransform(record: MutationRecord): boolean {
		if (record.attributeName !== 'style') return false;
		const el = record.target as Element;
		return (
			styleWithoutTransform(record.oldValue ?? '') !==
			styleWithoutTransform(el.getAttribute('style') ?? '')
		);
	}

	function refreshLastLayouts() {
		for (const node of nodes) {
			if (!node.el.isConnected) continue;
			node.lastLayout = measureUntransformed(node.el);
			stashShared(node.options.id, node.lastLayout);
		}
		mutationObserver?.takeRecords();
	}

	function observe(element: HTMLElement) {
		mutationObserver?.disconnect();
		resizeObserver?.disconnect();
		mutationObserver = new MutationObserver((records) => {
			if (applying) return;
			const relevant = records.some(
				(record) =>
					record.type === 'childList' ||
					record.attributeName === 'class' ||
					styleChangedBeyondTransform(record)
			);
			if (!relevant) return;
			schedule();
		});
		mutationObserver.observe(element, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style'],
			attributeOldValue: true
		});
		resizeObserver = new ResizeObserver(() => {
			if (applying) return;
			schedule();
		});
		resizeObserver.observe(element);
	}

	function onScroll() {
		if (applying) return;
		refreshLastLayouts();
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', onScroll, { capture: true, passive: true });
	}

	function bindRoot(element: HTMLElement) {
		bound = element;
		groups.set(element, handle);
		observe(element);
		return () => {
			mutationObserver?.disconnect();
			resizeObserver?.disconnect();
			mutationObserver = null;
			resizeObserver = null;
			if (bound) groups.delete(bound);
			bound = null;
		};
	}

	function register(el: HTMLElement, options: LayoutOptions = {}) {
		applying = true;
		const measured = measureUntransformed(el);
		mutationObserver?.takeRecords();
		applying = false;

		const inherited = options.id ? takeShared(options.id) : undefined;
		const node: LayoutNode = {
			el,
			options,
			lastLayout: inherited ?? measured,
			animation: null,
			contentAnimation: null
		};
		nodes.add(node);

		if (inherited) {
			play(node, inherited, measured);
			mutationObserver?.takeRecords();
		} else if (!isDegenerateBox(measured)) {
			stashShared(options.id, measured);
		}

		return () => {
			stashShared(options.id, captureBox(el, node.lastLayout));
			stop(node);
			nodes.delete(node);
			schedule();
		};
	}

	function destroy() {
		mutationObserver?.disconnect();
		resizeObserver?.disconnect();
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', onScroll, { capture: true });
		}
		for (const node of nodes) {
			stop(node);
		}
		nodes.clear();
		shared.clear();
		if (bound) groups.delete(bound);
		bound = null;
	}

	const handle: LayoutGroupHandle = { bindRoot, register, destroy };
	return handle;
}

export function layout(options: LayoutOptions = {}): Attachment<HTMLElement> {
	return (element) => {
		if (typeof requestAnimationFrame === 'undefined') return;

		let unregister: (() => void) | undefined;
		let attempts = 0;
		let frame = 0;

		const tryRegister = () => {
			try {
				unregister = findGroup(element).register(element, options);
			} catch (error) {
				if (attempts++ > 8) {
					console.warn(error);
					return;
				}
				frame = requestAnimationFrame(tryRegister);
			}
		};

		tryRegister();

		return () => {
			cancelAnimationFrame(frame);
			unregister?.();
		};
	};
}
