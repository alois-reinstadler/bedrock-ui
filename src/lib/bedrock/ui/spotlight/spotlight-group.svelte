<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { provideSpotlight } from './context.js';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	export type SpotlightGroupProps = HTMLAttributes<HTMLDivElement>;
	let { children, class: className, ...rest }: SpotlightGroupProps = $props();
	const group = provideSpotlight();
	const policy = useMotionPolicy();
	const pointer: Attachment<HTMLDivElement> = (node) => {
		if (policy.reduced) {
			group.move(null);
			return;
		}
		const move = (event: PointerEvent) => {
			if (event.pointerType === 'mouse') group.move({ x: event.clientX, y: event.clientY });
			else group.move(null);
		};
		const leave = () => group.move(null);
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerleave', leave);
		node.addEventListener('pointercancel', leave);
		window.addEventListener('scroll', leave, true);
		window.addEventListener('blur', leave);
		node.addEventListener('focusin', leave);
		return () => {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
			node.removeEventListener('pointercancel', leave);
			window.removeEventListener('scroll', leave, true);
			window.removeEventListener('blur', leave);
			node.removeEventListener('focusin', leave);
			group.move(null);
		};
	};
</script>

<div {...rest} data-slot="spotlight-group" class={cn('grid gap-4', className)} {@attach pointer}>
	{@render children?.()}
</div>
