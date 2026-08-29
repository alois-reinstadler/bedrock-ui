<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import { Toaster } from '#lib/bedrock/ui/sonner';
	import { TooltipProvider } from '#lib/bedrock/ui/tooltip';
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
</svelte:head>

<ModeWatcher />
<TooltipProvider>
	{@render children()}
</TooltipProvider>
<Toaster />
