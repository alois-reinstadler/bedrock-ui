<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/docs', label: 'Docs' },
		{ href: '/docs/components', label: 'Components' }
	] as const;

	let currentPath = $derived(page.url.pathname);
</script>

<header class="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 md:px-8">
		<a href={resolve('/')} class="text-sm text-foreground">
			<Logo />
		</a>
		<nav class="flex items-center gap-1">
			{#each links as link (link.href)}
				<Button
					href={resolve(link.href)}
					variant="ghost"
					size="sm"
					class={[
						'text-muted-foreground',
						currentPath === link.href || currentPath.startsWith(`${link.href}/`)
							? 'text-foreground'
							: ''
					]}
				>
					{link.label}
				</Button>
			{/each}
			<ThemeToggle />
		</nav>
	</div>
</header>
