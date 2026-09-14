<script lang="ts" module>
	import type { MotionProps, MotionTag } from 'astra-motion';
	import type { CssMotionOptions } from 'astra-motion/css';

	/** Astra's native-element API, restricted to its finite CSS backend. */
	export type CssMotionProps<Tag extends MotionTag = 'div'> = Omit<MotionProps<Tag>, 'motion'> & {
		motion?: CssMotionOptions;
	};
	const voidTags = new Set([
		'area',
		'base',
		'br',
		'col',
		'embed',
		'hr',
		'img',
		'input',
		'link',
		'meta',
		'param',
		'source',
		'track',
		'wbr'
	]);
</script>

<script lang="ts" generics="Tag extends MotionTag = 'div'">
	import { untrack } from 'svelte';
	import { createMotion } from 'astra-motion/css';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		as = 'div' as Tag,
		motion = { initial: false },
		ref = $bindable(null),
		style,
		children,
		...attributes
	}: CssMotionProps<Tag> = $props();
	const initialTag = untrack(() => as);
	const tag = $derived.by(() => {
		if (as !== initialTag)
			throw new Error(
				'Astra CSS: as must stay unchanged while mounted. Use {#key tag} when changing the element.'
			);
		return as;
	});
	const binding = createMotion(() => motion);
	const motionTransition = binding.transition;
	// Generic native event unions exceed TypeScript's forwarding limit.
	// @ts-expect-error TS2590: preserve precise caller attributes, widen only at the DOM boundary.
	const elementAttributes = $derived(attributes as unknown as HTMLAttributes<HTMLElement>);
	function attachRef(node: HTMLElement) {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}
</script>

{#if voidTags.has(tag)}
	<svelte:element
		this={tag}
		{...elementAttributes}
		{...binding.props}
		{@attach attachRef}
		style={`${style ?? ''};${binding.props.style}`}
		transition:motionTransition|global
	/>
{:else}
	<svelte:element
		this={tag}
		{...elementAttributes}
		{...binding.props}
		{@attach attachRef}
		style={`${style ?? ''};${binding.props.style}`}
		transition:motionTransition|global
	>
		{@render children?.()}
	</svelte:element>
{/if}
