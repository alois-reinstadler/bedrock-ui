<script lang="ts" module>
	export type AvatarStackItem = {
		src?: string | null;
		alt?: string;
		/** Short fallback text, e.g. initials. */
		fallback: string;
		/** Display name for the hover preview; falls back to `alt`, then `fallback`. */
		name?: string;
	};
</script>

<script lang="ts">
	import Fallback from './avatar-fallback.svelte';
	import GroupCount from './avatar-group-count.svelte';
	import Group from './avatar-group.svelte';
	import Image from './avatar-image.svelte';
	import Root from './avatar.svelte';
	import { onDestroy } from 'svelte';
	import Swap from '#lib/bedrock/motion/swap.svelte';
	import { autoSize } from '#lib/bedrock/motion/auto-size.js';
	import { motionPresets } from '#lib/bedrock/motion/tokens.js';
	import { createLayout } from 'astra-motion/layout';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		items,
		max = 4,
		animateLayout = false,
		moreLabel = (count: number) => `Show ${count} more`,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		items: AvatarStackItem[];
		/** Avatars shown before collapsing the rest into a "+n" count. */
		max?: number;
		/** Opt into position continuity for deliberate membership changes. */
		animateLayout?: boolean;
		/** Accessible label for the "+n" count. */
		moreLabel?: (count: number) => string;
	} = $props();

	const policy = useMotionPolicy();
	const visible = $derived(items.length > max ? items.slice(0, max) : items);
	// Preserve the name/source identity contract and disambiguate identical entries.
	const keyedVisible = $derived.by(() => {
		const occurrences: Record<string, number> = Object.create(null);
		return visible.map((item) => {
			const identity = JSON.stringify([displayName(item), item.src ?? '']);
			const occurrence = occurrences[identity] ?? 0;
			occurrences[identity] = occurrence + 1;
			return { item, key: JSON.stringify([identity, occurrence]) };
		});
	});
	const hidden = $derived(items.length > visible.length ? items.slice(visible.length) : []);

	function displayName(item: AvatarStackItem): string {
		return item.name ?? item.alt ?? item.fallback;
	}

	// One card, shared across all triggers: it slides between avatars instead
	// of closing and reopening, and swaps its content.
	let active = $state<string | null>(null);
	const overflowKey = 'overflow';
	const activeIndex = $derived(keyedVisible.findIndex((entry) => entry.key === active));
	const previewVisible = $derived(active === overflowKey ? hidden.length > 0 : activeIndex >= 0);
	let cardX = $state(0);
	let activeTrigger: HTMLElement | null = null;
	let focusedTrigger: HTMLElement | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function show(event: Event, key: string) {
		clearTimeout(closeTimer);
		const trigger = event.currentTarget as HTMLElement;
		activeTrigger = trigger;
		cardX = trigger.offsetLeft + trigger.offsetWidth / 2;
		active = key;
	}

	function focusTrigger(event: FocusEvent, key: string) {
		focusedTrigger = event.currentTarget as HTMLElement;
		show(event, key);
	}
	function blurTrigger(event: FocusEvent) {
		if (event.relatedTarget) focusedTrigger = null;
		scheduleHide();
	}
	function scheduleHide() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => (active = null), 150);
	}

	// Same shell pattern as the demo's async upload button: autoSize animates
	// the card between intrinsic sizes while Swap crossfades the content.
	const cardShell = autoSize({ duration: motionPresets.swap.duration, axis: 'both' });

	// Projection owns the native trigger transform; preview positioning stays separate.
	const stackLayout = createLayout({
		observationRoot: () => ref,
		get reducedMotion() {
			return policy.reduced ? 'always' : 'user';
		},
		get transition() {
			return policy.reduced
				? { duration: 0 }
				: { type: 'spring' as const, ...motionPresets.layout.spring };
		}
	});
	const memberLayout = stackLayout({ mode: 'position' });
	let disposed = false;
	// Refresh the public controller on live application reduction, settling existing travel.
	function refreshReducedLayout() {
		if (policy.reduced)
			queueMicrotask(() => {
				if (!disposed) stackLayout.update(() => {});
			});
	}
	$effect(refreshReducedLayout);
	function setRef(element: HTMLDivElement) {
		ref = element;
		function positionPreview() {
			if (!activeTrigger) return;
			if (!element.contains(activeTrigger)) {
				active = null;
				activeTrigger = null;
				return;
			}
			// Logical layout coordinates exclude Astra's temporary projection transform.
			cardX = activeTrigger.offsetLeft + activeTrigger.offsetWidth / 2;
		}
		const resize = new ResizeObserver(positionPreview);
		resize.observe(element);
		const membership = new MutationObserver((records) => {
			const movedFocus =
				focusedTrigger &&
				records.some((record) => [...record.addedNodes].includes(focusedTrigger!));
			if (
				movedFocus &&
				focusedTrigger?.isConnected &&
				element.contains(focusedTrigger) &&
				document.activeElement === document.body
			)
				focusedTrigger.focus({ preventScroll: true });
			positionPreview();
		});
		membership.observe(element, { childList: true, subtree: true });
		return () => {
			resize.disconnect();
			membership.disconnect();
			if (ref === element) ref = null;
		};
	}
	onDestroy(() => {
		disposed = true;
		clearTimeout(closeTimer);
	});

	const triggerClasses =
		'rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
</script>

{#snippet memberRow(item: AvatarStackItem)}
	<span class="flex items-center gap-2 text-sm whitespace-nowrap" data-slot="avatar-stack-member">
		<Root class="size-6">
			{#if item.src}
				<Image src={item.src} alt={displayName(item)} />
			{/if}
			<Fallback class="text-[10px]">{item.fallback}</Fallback>
		</Root>
		{displayName(item)}
	</span>
{/snippet}

<div
	{@attach setRef}
	{@attach policy.attach}
	data-slot="avatar-stack"
	class={cn('relative inline-block', className)}
	{...restProps}
>
	<Group>
		{#each keyedVisible as { item, key } (key)}
			<button
				{@attach animateLayout && memberLayout}
				type="button"
				aria-label={displayName(item)}
				class={triggerClasses}
				onmouseenter={(event) => show(event, key)}
				onmouseleave={scheduleHide}
				onfocus={(event) => focusTrigger(event, key)}
				onblur={blurTrigger}
			>
				<Root class="ring-2 ring-background">
					{#if item.src}
						<Image src={item.src} alt={displayName(item)} />
					{/if}
					<Fallback>{item.fallback}</Fallback>
				</Root>
			</button>
		{/each}
		{#if hidden.length > 0}
			<button
				{@attach animateLayout && memberLayout}
				type="button"
				aria-label={moreLabel(hidden.length)}
				class={triggerClasses}
				onmouseenter={(event) => show(event, overflowKey)}
				onmouseleave={scheduleHide}
				onfocus={(event) => focusTrigger(event, overflowKey)}
				onblur={blurTrigger}
			>
				<GroupCount>+{hidden.length}</GroupCount>
			</button>
		{/if}
	</Group>
	{#if previewVisible}
		<div
			{@attach cardShell}
			data-slot="avatar-stack-card"
			role="status"
			class="bedrock-avatar-card absolute bottom-full z-50 mb-2 w-max rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md"
			style:left="{cardX}px"
			onmouseenter={() => clearTimeout(closeTimer)}
			onmouseleave={scheduleHide}
		>
			<Swap key={active} effect="fade">
				{#if activeIndex >= 0}
					{@render memberRow(visible[activeIndex])}
				{:else}
					<span class="flex flex-col gap-1.5">
						{#each hidden as item, index (index)}
							{@render memberRow(item)}
						{/each}
					</span>
				{/if}
			</Swap>
		</div>
	{/if}
</div>

<style>
	.bedrock-avatar-card {
		transform: translateX(-50%);
		transition:
			left var(--motion-enter) var(--motion-ease-move),
			opacity var(--motion-state) var(--motion-ease-enter);
	}

	:global([data-bedrock-motion='reduced']) .bedrock-avatar-card {
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.bedrock-avatar-card {
			transition: none;
		}
	}

	@starting-style {
		.bedrock-avatar-card {
			opacity: 0;
		}
	}
</style>
