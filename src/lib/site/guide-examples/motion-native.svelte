<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { reveal } from '#lib/bedrock/motion/presence.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	const policy = useMotionPolicy();
	let open = $state(true);
	let moved = $state(false);
	let pressed = $state(0);
	const id = $props.id();
</script>

<div {@attach policy.attach}>
	<div class="mb-5 flex flex-wrap gap-2">
		<Button
			data-testid="bedrock-css-toggle"
			aria-controls={id}
			aria-expanded={open}
			onclick={() => (open = !open)}>Toggle CSS panel</Button
		>
		<Button variant="outline" data-testid="bedrock-css-retarget" onclick={() => (moved = !moved)}
			>Retarget</Button
		>
	</div>
	<div class="min-h-36 overflow-clip">
		{#if open}
			<div transition:reveal {id} inert={!open} aria-hidden={!open}>
				<div
					data-testid="bedrock-css-panel"
					class="native-surface rounded-lg bg-muted p-5"
					style:translate={moved ? '32px' : '0px'}
				>
					<p class="mb-3 font-medium">A native Bedrock surface</p>
					<Button data-testid="bedrock-native-action" variant="outline" onclick={() => pressed++}
						>Pressed {pressed} times</Button
					>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.native-surface {
		transition: translate var(--motion-state) var(--motion-ease-enter);
	}
	:global([data-bedrock-motion='reduced']) .native-surface {
		transition: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.native-surface {
			transition: none;
		}
	}
</style>
