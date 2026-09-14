<script lang="ts" module>
	/** One table-of-contents entry; matches `outlineFromMarkdown` output. */
	export type OutlineItem = { id: string; label: string; level: number };
</script>

<script lang="ts">
	import { createMotion } from '#lib/bedrock/motion/css.js';
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
		/** Set false to disable the IntersectionObserver and control `activeId` yourself. */
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

	$effect(() => () => cancelSettle?.(false));

	function activate(id: string, index: number) {
		rovingIndex = index;
		onNavigateStart?.(id);
		activeId = id;
		history.replaceState(null, '', `#${id}`);
		const target = document.getElementById(id);
		if (!target) {
			onNavigateEnd?.(id);
			return;
		}
		target.style.scrollMarginTop = `${offset}px`;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

	// Scroll-spy: the observer only triggers re-evaluation; the winner is the
	// heading nearest the activation line (offset below the scroller top).
	$effect(() => {
		if (!scrollSpy) return;
		const targets = items
			.map((item) => document.getElementById(item.id))
			.filter((element): element is HTMLElement => element !== null);
		if (targets.length === 0) return;
		const container = scrollContainer;
		const updateActive = () => {
			if (navigationPending) return;
			const line = (container ? container.getBoundingClientRect().top : 0) + offset + 1;
			let current: HTMLElement | undefined;
			for (const target of targets) {
				if (target.getBoundingClientRect().top <= line) current = target;
				else break;
			}
			activeId = (current ?? targets[0]).id;
		};
		const observer = new IntersectionObserver(updateActive, {
			root: container,
			rootMargin: `${-offset}px 0px 0px 0px`
		});
		for (const target of targets) observer.observe(target);
		return () => observer.disconnect();
	});

	const indicatorMotion = createMotion(() => ({
		animate: { y: indicatorTop, height: indicatorHeight, opacity: indicatorHeight > 0 ? 1 : 0 },
		transition: { duration: 0.2 }
	}));

	// Indicator geometry: the nav is the offsetParent of every item link.
	$effect(() => {
		const index = items.findIndex((item) => item.id === activeId);
		const element = index >= 0 ? itemRefs[index] : null;
		if (!element) {
			indicatorHeight = 0;
			return;
		}
		indicatorTop = element.offsetTop;
		indicatorHeight = element.offsetHeight;
	});
</script>

<nav
	bind:this={ref}
	data-slot="outline"
	aria-label={label}
	class={cn('relative text-sm', className)}
	{...restProps}
>
	<div
		{...indicatorMotion.props}
		data-slot="outline-indicator"
		aria-hidden="true"
		class="absolute start-0 top-0 w-0.5 rounded-full bg-primary"
	></div>
	<ul class="m-0 list-none space-y-1 border-s border-border p-0">
		{#each items as item, index (`${item.id}-${index}`)}
			<li>
				<a
					bind:this={itemRefs[index]}
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
	/* Movement comes from the shared-layout engine; only visibility fades. */
	[data-slot='outline-indicator'] {
		transition-property: opacity;
		transition-duration: var(--motion-state);
		transition-timing-function: var(--motion-ease-enter);
	}
</style>
