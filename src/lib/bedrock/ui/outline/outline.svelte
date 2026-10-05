<script lang="ts" module>
	/** One table-of-contents entry; matches `outlineFromMarkdown` output. */
	export type OutlineItem = { id: string; label: string; level: number };
</script>

<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { elementPrefersReducedMotion } from '#lib/bedrock/motion/policy.js';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * Table-of-contents navigation with scroll-spy over in-page headings.
	 * One tab stop (roving tabindex); ArrowUp/ArrowDown move, Home/End jump,
	 * Enter/Space activate. `onNavigateEnd` fires exactly once per
	 * `onNavigateStart`: on smooth-scroll settle, on reduced-motion instant
	 * jump, or when the user interrupts (wheel/touch/keydown).
	 */
	export type OutlineProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
		items: OutlineItem[];
		activeId?: string;
		/** Set false to disable scroll tracking and control `activeId` yourself. */
		scrollSpy?: boolean;
		/** Fixed-header height in px; shifts the activation line and the scroll landing. */
		offset?: number;
		/** Scrolling element the headings live in; defaults to the document scroller. */
		scrollContainer?: HTMLElement | null;
		onNavigateStart?: (id: string) => void;
		onNavigateEnd?: (id: string) => void;
		/** Accessible name of the nav landmark. */
		label?: string;
	};

	let {
		ref = $bindable(null),
		class: className,
		items,
		activeId = $bindable(undefined),
		scrollSpy = true,
		offset = 0,
		scrollContainer = null,
		onNavigateStart,
		onNavigateEnd,
		label = 'Table of contents',
		...restProps
	}: OutlineProps = $props();

	let itemRefs: (HTMLAnchorElement | null)[] = $state([]);
	let rovingIndex = $state(0);
	let indicatorTop = $state(0);
	let indicatorHeight = $state(0);

	const minLevel = $derived(items.length ? Math.min(...items.map((item) => item.level)) : 1);

	// --- Navigation settle tracking (non-reactive on purpose) ---
	let cancelSettle: ((fire: boolean) => void) | null = null;
	let navigationPending = false;
	let refreshScrollSpy = () => {};

	function beginSettle(id: string) {
		// A new start interrupts the previous one; its end fires now (once).
		cancelSettle?.(true);
		let done = false;
		const scroller: EventTarget = scrollContainer ?? document;
		const onSettle = () => finish(true);
		const finish = (fire: boolean) => {
			if (done) return;
			done = true;
			cancelSettle = null;
			navigationPending = false;
			refreshScrollSpy();
			clearTimeout(fallbackTimer);
			clearTimeout(attachTimer);
			scroller.removeEventListener('scrollend', onSettle);
			window.removeEventListener('wheel', onSettle);
			window.removeEventListener('touchstart', onSettle);
			window.removeEventListener('keydown', onSettle);
			if (fire) onNavigateEnd?.(id);
		};
		// Fallback for browsers without `scrollend` (and for zero-distance scrolls).
		const fallbackTimer = setTimeout(onSettle, 1200);
		// Attach on the next task so the activating click/keydown cannot cancel itself.
		const attachTimer = setTimeout(() => {
			scroller.addEventListener('scrollend', onSettle);
			window.addEventListener('wheel', onSettle, { passive: true });
			window.addEventListener('touchstart', onSettle, { passive: true });
			window.addEventListener('keydown', onSettle);
		}, 0);
		navigationPending = true;
		cancelSettle = finish;
	}

	onDestroy(() => cancelSettle?.(false));

	function findTarget(id: string): HTMLElement | null {
		// Async route replacement can retain the previous page with the same IDs.
		// Prefer headings in this nav's own content branch, even before insertion.
		for (let scope = ref?.parentElement; scope; scope = scope.parentElement) {
			const target = scope.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
			if (target) return target;
		}
		return null;
	}

	function activate(id: string, index: number) {
		rovingIndex = index;
		onNavigateStart?.(id);
		activeId = id;
		history.replaceState(null, '', `#${id}`);
		const target = findTarget(id);
		if (!target) {
			onNavigateEnd?.(id);
			return;
		}
		target.style.scrollMarginTop = `${offset}px`;
		const reducedMotion = elementPrefersReducedMotion(ref);
		if (reducedMotion) {
			target.scrollIntoView({ behavior: 'auto', block: 'start' });
			onNavigateEnd?.(id);
			return;
		}
		beginSettle(id);
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function onItemKeydown(event: KeyboardEvent, index: number) {
		let next: number;
		if (event.key === 'ArrowDown') next = Math.min(index + 1, items.length - 1);
		else if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = items.length - 1;
		else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			activate(items[index].id, index);
			return;
		} else return;
		event.preventDefault();
		rovingIndex = next;
		itemRefs[next]?.focus();
	}

	// Track section starts on scroll: an intersecting section can cross the
	// activation line without triggering another IntersectionObserver entry.
	function observeSections() {
		if (!scrollSpy || !ref) return;
		const targets = items
			.map((item) => findTarget(item.id))
			.filter((element): element is HTMLElement => element !== null);
		if (targets.length === 0) return;
		const container = scrollContainer;
		const activationOffset = offset;
		const scroller = container ?? document;
		let frame = 0;
		const updateActive = () => {
			frame = 0;
			if (navigationPending) return;
			const scrollElement = container ?? document.documentElement;
			const viewportTop = container
				? container.getBoundingClientRect().top + container.clientTop
				: 0;
			const viewportHeight = container
				? container.clientHeight
				: document.documentElement.clientHeight;
			const line = viewportTop + activationOffset + 1;
			let current: HTMLElement | undefined;
			for (const target of targets) {
				if (target.getBoundingClientRect().top <= line) current = target;
				else break;
			}
			// Short final sections cannot always reach the activation line.
			const last = targets[targets.length - 1];
			if (
				scrollElement.scrollTop > 0 &&
				scrollElement.scrollHeight - scrollElement.scrollTop - viewportHeight <= 1 &&
				last.getBoundingClientRect().top < viewportTop + viewportHeight
			) {
				current = last;
			}
			activeId = (current ?? targets[0]).id;
		};
		const scheduleUpdate = () => {
			if (!frame) frame = requestAnimationFrame(updateActive);
		};
		refreshScrollSpy = scheduleUpdate;
		scroller.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		const observer = new IntersectionObserver(scheduleUpdate, {
			root: container,
			rootMargin: `${-activationOffset}px 0px 0px 0px`
		});
		const sizes = new ResizeObserver(scheduleUpdate);
		sizes.observe(container ?? document.documentElement);
		for (const target of targets) {
			observer.observe(target);
			sizes.observe(target);
		}
		scheduleUpdate();
		return () => {
			cancelAnimationFrame(frame);
			scroller.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			observer.disconnect();
			sizes.disconnect();
			refreshScrollSpy = () => {};
		};
	}
	$effect(observeSections);

	// Indicator geometry: the nav is the offsetParent of every item link.
	function measureIndicator() {
		const index = items.findIndex((item) => item.id === activeId);
		const element = index >= 0 ? itemRefs[index] : null;
		if (!element) {
			indicatorHeight = 0;
			return;
		}
		indicatorTop = element.offsetTop;
		indicatorHeight = element.offsetHeight;
	}

	function observeIndicator() {
		void activeId;
		void items;
		const links = itemRefs.slice(0, items.length);
		const nav = ref;
		untrack(measureIndicator);
		const sizes = new ResizeObserver(measureIndicator);
		if (nav) sizes.observe(nav);
		// Observe every link: wrapping and async fonts can move later items.
		for (const link of links) if (link) sizes.observe(link);
		return () => sizes.disconnect();
	}
	$effect(observeIndicator);
</script>

<nav
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="outline"
	aria-label={label}
	class={cn('relative text-sm', className)}
	{...restProps}
>
	<div
		data-slot="outline-indicator"
		aria-hidden="true"
		class="absolute start-0 w-0.5 rounded-full bg-primary"
		style:top={`${indicatorTop}px`}
		style:height={`${indicatorHeight}px`}
		style:opacity={indicatorHeight > 0 ? '1' : '0'}
	></div>
	<ul class="m-0 list-none space-y-1 border-s border-border p-0">
		{#each items as item, index (`${item.id}-${index}`)}
			<li>
				<a
					{@attach (node) => {
						itemRefs[index] = node;
						return () => {
							if (itemRefs[index] === node) itemRefs[index] = null;
						};
					}}
					href={`#${item.id}`}
					aria-current={activeId === item.id ? 'location' : undefined}
					tabindex={index === rovingIndex ? 0 : -1}
					data-active={activeId === item.id ? '' : undefined}
					class="block rounded-sm py-1 pe-2 text-muted-foreground motion-state hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[active]:font-medium data-[active]:text-foreground"
					style:padding-inline-start={`calc(${item.level - minLevel} * 0.75rem + 0.75rem)`}
					onclick={(event) => {
						event.preventDefault();
						activate(item.id, index);
					}}
					onkeydown={(event) => onItemKeydown(event, index)}>{item.label}</a
				>
			</li>
		{/each}
	</ul>
</nav>

<style>
	[data-slot='outline-indicator'] {
		pointer-events: none;
		transition:
			top var(--motion-layout) var(--motion-ease-enter),
			height var(--motion-layout) var(--motion-ease-enter),
			opacity var(--motion-state) var(--motion-ease-enter);
	}

	:global([data-bedrock-motion='reduced']) [data-slot='outline-indicator'] {
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-slot='outline-indicator'] {
			transition: none;
		}
	}
</style>
