<script lang="ts">
	import { motion } from 'astra-motion';
	import { motionValue } from 'astra-motion/values';
	import { onDestroy } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import MotionProvider from '../MotionProvider.svelte';
	import AstraPolicy from '../AstraPolicy.svelte';
	import Swap from '../swap.svelte';
	import { useMotionPolicy } from '../policy.svelte.js';
	import { settleOnReducedMotion } from '../settle-motion.svelte.js';
	import { reveal } from '../presence.js';
	import Browser from './Browser.svelte';
	import '../tokens.css';

	let {
		inner = false,
		providerFree = false,
		moving = false
	}: { inner?: boolean; providerFree?: boolean; moving?: boolean } = $props();
	let reduced = $state(false);
	let started = $state(false);
	const policy = useMotionPolicy();
	const opacity = motionValue(1);
	const x = motionValue(0);
	settleOnReducedMotion(opacity);
	settleOnReducedMotion(x);
	onDestroy(() => {
		opacity.destroy();
		x.destroy();
	});

	const portal: Attachment<HTMLElement> = (element) => {
		document.body.appendChild(element);
		return () => element.remove();
	};
</script>

{#if inner}
	<div data-testid="policy-inner" data-policy={policy.reduced ? 'reduced' : 'full'}>
		<div
			data-testid="policy-css"
			style:transform={moving ? 'translateX(100px)' : 'translateX(0px)'}
			style="transition: transform var(--motion-reveal) linear"
		>
			CSS feedback
		</div>
		<div
			data-testid="policy-portal"
			{@attach policy.attach}
			{@attach portal}
			style="transition: opacity var(--motion-reveal) linear"
		>
			Portalled content
		</div>
		{#if moving}
			<div data-testid="policy-reveal" in:reveal={{ duration: 2000 }} style="height: 40px">
				Essential disclosure content
			</div>
		{/if}
		<div data-testid="policy-swap">
			<Swap key={moving} duration={2000} effect="slide-up">
				<span>{moving ? 'Current content' : 'Previous content'}</span>
			</Swap>
		</div>
		<AstraPolicy>
			<motion.div
				data-testid="policy-astra"
				style={{ opacity, x }}
				initial={false}
				animate={{ x: moving ? 100 : 0, opacity: moving ? 0.35 : 1 }}
				transition={{ duration: policy.reduced ? 0 : 2, ease: 'linear' }}
				reducedMotion={policy.reduced ? 'always' : 'user'}>Engine content</motion.div
			>
		</AstraPolicy>
	</div>
{:else}
	<button onclick={() => (reduced = !reduced)}>Toggle application reduction</button>
	<button onclick={() => (started = !started)}>Start movement</button>
	{#if providerFree}
		<Browser inner moving={started} />
	{:else}
		<MotionProvider {reduced}>
			<MotionProvider reduced={false}>
				<Browser inner moving={started} />
			</MotionProvider>
		</MotionProvider>
	{/if}
{/if}
