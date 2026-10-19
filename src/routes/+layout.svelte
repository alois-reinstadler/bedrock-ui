<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/env';
	import { onMount, type Component } from 'svelte';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';
	import favicon from '#lib/assets/favicon.svg';
	import { Toaster } from '#lib/bedrock/ui/sonner';
	import { TooltipProvider } from '#lib/bedrock/ui/tooltip';
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';

	let { children } = $props();
	let FeedbackTool = $state<Component | null>(null);
	onMount(() => {
		let disposed = false;
		// Keep the entire developer integration out of production route chunks.
		if (dev) {
			void import('#lib/site/DevFeedback.svelte').then((module) => {
				if (!disposed) FeedbackTool = module.default;
			});
		}
		return () => {
			disposed = true;
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
</svelte:head>

<ModeWatcher />
<MotionProvider>
	<TooltipProvider>
		{@render children()}
	</TooltipProvider>
	<Toaster />
</MotionProvider>

{#if FeedbackTool && !page.url.pathname.startsWith('/docs/components/feedback') && !page.url.pathname.startsWith('/templates/')}
	<FeedbackTool />
{/if}
