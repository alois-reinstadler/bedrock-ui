<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { fullWidth = false }: { fullWidth?: boolean } = $props();

	const links = [
		{ href: '/', label: 'Bedrock' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/docs/components', label: 'Components' },
		{ href: '/docs/blocks', label: 'Blocks' },
		{ href: '/docs/shaders', label: 'Shaders' },
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

<header
	class="sticky top-0 z-40 h-14 shrink-0 border-b border-border/80 bg-background/80 backdrop-blur-md"
>
	<div
		class={[
			'mx-auto flex h-full items-center justify-between gap-2 px-4',
			!fullWidth && 'max-w-[1400px] md:px-8'
		]}
	>
		<a
			href={resolve('/')}
			class="hidden shrink-0 text-sm text-foreground sm:inline-flex"
			aria-label="Bedrock home"
		>
			<Logo />
		</a>
		<div class="flex min-w-0 items-center gap-1">
			<nav
				aria-label="Primary"
				class="no-scrollbar flex min-w-0 items-center gap-0.5 overflow-x-auto overflow-y-hidden p-1 sm:gap-1"
			>
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
			</nav>
			<div class="shrink-0"><ThemeToggle /></div>
		</div>
	</div>
</header>
