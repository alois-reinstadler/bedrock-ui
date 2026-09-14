<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as ScrollArea from '#lib/bedrock/ui/scroll-area';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
	import { blocks } from './blocks';
	import { templates } from './templates.js';
	import { components, gettingStarted } from './registry';
	import Logo from './Logo.svelte';

	const catalogueLinks = [
		{ title: 'Blocks', href: '/docs/blocks', keywords: 'patterns compositions' },
		{ title: 'Templates', href: '/docs/templates', keywords: 'full pages applications' }
	] as const;

	let query = $state('');
	let path = $derived(page.url.pathname);
	let filteredComponents = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return components;
		return components.filter(
			(component) =>
				component.title.toLowerCase().includes(needle) || component.slug.includes(needle)
		);
	});
	let searchResults = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return [];
		return [
			...gettingStarted.map((item) => ({ ...item, kind: 'Guide' })),
			...catalogueLinks.map((item) => ({ ...item, kind: 'Catalogue' })),
			...components.map((item) => ({
				title: item.title,
				href: `/docs/components/${item.slug}`,
				keywords: `${item.slug} ${item.description} ${item.category}`,
				kind: 'Component'
			})),
			...blocks.map((item) => ({
				title: item.title,
				href: `/docs/blocks/${item.slug}`,
				keywords: `${item.slug} ${item.description} ${item.category}`,
				kind: 'Block'
			})),
			...templates.map((item) => ({
				...item,
				href: `/templates/${item.slug}`,
				keywords: `${item.description} template full page`,
				kind: 'Template'
			}))
		].filter((item) =>
			`${item.title} ${'keywords' in item ? item.keywords : ''}`.toLowerCase().includes(needle)
		);
	});
</script>

<Sidebar.Root class="md:top-14 md:h-[calc(100svh-3.5rem)]">
	<Sidebar.Header>
		<a href={resolve('/')} class="flex h-8 items-center px-2 text-sm">
			<Logo />
		</a>
		<Sidebar.Input
			bind:value={query}
			name="docs-search"
			placeholder="Search documentation"
			aria-label="Search documentation"
		/>
	</Sidebar.Header>
	<Sidebar.Content class="overflow-hidden">
		<ScrollArea.Root edgeBlur="vertical" class="min-h-0 flex-1">
			{#if query.trim()}
				<Sidebar.Group>
					<Sidebar.GroupLabel>Search results</Sidebar.GroupLabel>
					<p role="status" class="sr-only">{searchResults.length} results</p>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each searchResults as result (result.href)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={path === result.href}>
										{#snippet child({ props })}
											<a href={result.href} data-sveltekit-reload {...props}>
												<span class="min-w-0 flex-1 truncate">{result.title}</span>
												<span class="text-[10px] text-muted-foreground">{result.kind}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
							{#if searchResults.length === 0}
								<li class="px-2 py-3 text-sm text-muted-foreground">No documentation found.</li>
							{/if}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{:else}
				<Sidebar.Group>
					<Sidebar.GroupLabel>Start</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each gettingStarted as item (item.href)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={path === item.href}>
										{#snippet child({ props })}
											<a href={resolve(item.href)} data-sveltekit-reload {...props}>{item.title}</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Explore</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each catalogueLinks as item (item.href)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton
										isActive={path === item.href || path.startsWith(`${item.href}/`)}
									>
										{#snippet child({ props })}
											<a href={item.href} data-sveltekit-reload {...props}>{item.title}</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Components</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each filteredComponents as component (component.slug)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={path === `/docs/components/${component.slug}`}>
										{#snippet child({ props })}
											<a
												href={resolve('/docs/components/[slug]', { slug: component.slug })}
												data-sveltekit-reload
												{...props}>{component.title}</a
											>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{/if}
		</ScrollArea.Root>
	</Sidebar.Content>
</Sidebar.Root>
