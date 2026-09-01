<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLTimeAttributes } from 'svelte/elements';

	const MINUTE = 60_000;
	const HOUR = 60 * MINUTE;
	const DAY = 24 * HOUR;
	const WEEK = 7 * DAY;

	let {
		ref = $bindable(null),
		class: className,
		date,
		mode = 'auto',
		locale = 'en-US',
		...restProps
	}: WithElementRef<HTMLTimeAttributes, HTMLTimeElement> & {
		date: Date | string | number;
		/** `relative` = "5 minutes ago", `absolute` = "Aug 31, 2026, 2:05 PM",
		 * `auto` = relative within seven days, absolute beyond. */
		mode?: 'auto' | 'relative' | 'absolute';
		locale?: string;
	} = $props();

	const value = $derived(date instanceof Date ? date : new Date(date));

	// Coarse clock: ticks once a minute so relative output stays current
	// without per-second re-renders or hydration churn.
	let now = $state(Date.now());
	$effect(() => {
		if (mode === 'absolute') return;
		const interval = setInterval(() => (now = Date.now()), MINUTE);
		return () => clearInterval(interval);
	});

	const absoluteFormat = $derived(
		new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
	);
	const titleFormat = $derived(
		new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'medium' })
	);
	const relativeFormat = $derived(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }));

	function formatRelative(diff: number): string {
		const abs = Math.abs(diff);
		if (abs < MINUTE) return relativeFormat.format(0, 'minute');
		if (abs < HOUR) return relativeFormat.format(Math.trunc(diff / MINUTE), 'minute');
		if (abs < DAY) return relativeFormat.format(Math.trunc(diff / HOUR), 'hour');
		return relativeFormat.format(Math.trunc(diff / DAY), 'day');
	}

	const text = $derived.by(() => {
		if (Number.isNaN(value.getTime())) return '–';
		const diff = value.getTime() - now;
		if (mode === 'absolute') return absoluteFormat.format(value);
		if (mode === 'relative') return formatRelative(diff);
		return Math.abs(diff) < WEEK ? formatRelative(diff) : absoluteFormat.format(value);
	});
</script>

<time
	bind:this={ref}
	data-slot="timestamp"
	datetime={Number.isNaN(value.getTime()) ? undefined : value.toISOString()}
	title={Number.isNaN(value.getTime()) ? undefined : titleFormat.format(value)}
	class={cn('tabular-nums', className)}
	{...restProps}
>
	{text}
</time>
