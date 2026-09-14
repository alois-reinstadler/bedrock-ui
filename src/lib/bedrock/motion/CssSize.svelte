<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { createMotion } from 'astra-motion/css';
	import { untrack } from 'svelte';

	let {
		as = 'div',
		axis = 'both',
		duration = 0.18,
		class: className,
		contentClass,
		style,
		children,
		...attributes
	}: HTMLAttributes<HTMLElement> & {
		as?: 'span' | 'div';
		axis?: 'both' | 'block';
		/** Astra timing, in seconds. */
		duration?: number;
		contentClass?: string;
	} = $props();
	const initialAxis = untrack(() => axis);
	const stableAxis = $derived.by(() => {
		if (axis !== initialAxis)
			throw new Error('Size axis is immutable; remount with {#key axis} to change it.');
		return axis;
	});
	let size = $state<{ width: number; height: number } | null>(null);
	const binding = createMotion(() => ({
		initial: false,
		animate: size
			? { height: size.height, ...(stableAxis === 'both' ? { width: size.width } : {}) }
			: {},
		transition: { duration, ease: 'easeOut' }
	}));
	function measure(node: HTMLElement) {
		const update = () => {
			const next = { width: node.offsetWidth, height: node.offsetHeight };
			untrack(() => {
				if (!size || next.width !== size.width || next.height !== size.height) size = next;
			});
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(node);
		return () => observer.disconnect();
	}
</script>

<svelte:element
	this={as}
	{...attributes}
	{...binding.props}
	data-slot="motion-size"
	class={className}
	style={`display:inline-block;vertical-align:top;overflow:hidden;box-sizing:content-box;${style ?? ''};${binding.props.style}`}
>
	<svelte:element
		this={as}
		{@attach measure}
		class={contentClass}
		style={stableAxis === 'both'
			? 'display:inline-grid;width:max-content'
			: 'display:flow-root;width:100%'}
	>
		{@render children?.()}
	</svelte:element>
</svelte:element>
