<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/', label: 'Bedrock' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/docs/components', label: 'Components' },
		{ href: '/docs/blocks', label: 'Blocks' },
		{ href: '/docs/templates', label: 'Templates' }
	] as const;

	let currentPath = $derived(page.url.pathname);
	let activeHref = $derived(
		currentPath.startsWith('/templates')
			? '/docs/templates'
			: [...links]
					.reverse()
					.find(
						(link) =>
							currentPath === link.href ||
							(link.href !== '/' && currentPath.startsWith(`${link.href}/`))
					)?.href
	);
</script>

<header class="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 md:px-8">
		<a
			href={resolve('/')}
			class="hidden text-sm text-foreground sm:inline-flex"
			aria-label="Bedrock home"
		>
			<Logo />
		</a>
		<nav aria-label="Primary" class="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
			{#each links as link (link.href)}
				<Button
					href={link.href}
					data-sveltekit-reload={!link.href.startsWith('/docs')}
					variant="ghost"
					size="sm"
					aria-current={activeHref === link.href ? 'page' : undefined}
					class={[
						'shrink-0 px-2 text-muted-foreground sm:px-3',
						activeHref === link.href ? 'text-foreground' : ''
					]}
				>
					{link.label}
				</Button>
			{/each}
			<ThemeToggle />
		</nav>
	</div>
</header>
