<script lang="ts">
	import { resolve } from '$app/paths';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onDestroy, untrack } from 'svelte';
	import { createLayoutGroup, layout } from '#lib/bedrock/motion/index.js';
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

	const sidebar = Sidebar.useSidebar();
	beforeNavigate(() => sidebar.setOpenMobile(false));

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
	const highlightGroup = createLayoutGroup();
	const highlightLayout = layout();
	onDestroy(() => highlightGroup.destroy());
	let highlight = $state({ x: 0, y: 0, width: 0, height: 0, visible: false });

	function trackActiveLink(root: HTMLElement) {
		const measure = () => {
			const active = root.querySelector<HTMLElement>(
				'[data-sidebar="menu-button"][data-active="true"]'
			);
			const box = active?.getBoundingClientRect();
			const origin = root.getBoundingClientRect();
			const next = box
				? {
						x: box.left - origin.left,
						y: box.top - origin.top,
						width: box.width,
						height: box.height,
						visible: true
					}
				: untrack(() => ({ ...highlight, visible: false }));
			untrack(() => {
				if (
					Object.keys(next).some(
						(key) => next[key as keyof typeof next] !== highlight[key as keyof typeof highlight]
					)
				)
					highlight = next;
			});
		};
		const mutations = new MutationObserver(measure);
		mutations.observe(root, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ['data-active']
		});
		const sizes = new ResizeObserver(measure);
		sizes.observe(root);
		measure();
		return () => {
			mutations.disconnect();
			sizes.disconnect();
		};
	}
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
			<div
				data-docs-navigation
				class="relative isolate"
				{@attach highlightGroup.bindRoot}
				{@attach trackActiveLink}
			>
				<span
					data-slot="docs-active-highlight"
					aria-hidden="true"
					class="pointer-events-none absolute rounded-md bg-sidebar-accent"
					style:visibility={highlight.visible ? 'visible' : 'hidden'}
					style:left="{highlight.x}px"
					style:top="{highlight.y}px"
					style:width="{highlight.width}px"
					style:height="{highlight.height}px"
					{@attach highlightLayout}
				></span>
				{#if query.trim()}
					<Sidebar.Group>
						<Sidebar.GroupLabel>Search results</Sidebar.GroupLabel>
						<p role="status" class="sr-only">{searchResults.length} results</p>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each searchResults as result (result.href)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton
											class="relative z-10 data-active:bg-transparent"
											isActive={path === result.href}
											aria-current={path === result.href ? 'page' : undefined}
										>
											{#snippet child({ props })}
												<a
													href={result.href}
													data-sveltekit-reload={result.href.startsWith('/docs') ? 'false' : 'true'}
													{...props}
												>
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
										<Sidebar.MenuButton
											class="relative z-10 data-active:bg-transparent"
											isActive={path === item.href}
											aria-current={path === item.href ? 'page' : undefined}
										>
											{#snippet child({ props })}
												<a href={resolve(item.href)} data-sveltekit-reload="false" {...props}
													>{item.title}</a
												>
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
											class="relative z-10 data-active:bg-transparent"
											isActive={path === item.href || path.startsWith(`${item.href}/`)}
											aria-current={path === item.href || path.startsWith(`${item.href}/`)
												? 'page'
												: undefined}
										>
											{#snippet child({ props })}
												<a href={item.href} data-sveltekit-reload="false" {...props}>{item.title}</a
												>
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
										<Sidebar.MenuButton
											class="relative z-10 data-active:bg-transparent"
											isActive={path === `/docs/components/${component.slug}`}
											aria-current={path === `/docs/components/${component.slug}`
												? 'page'
												: undefined}
										>
											{#snippet child({ props })}
												<a
													href={resolve('/docs/components/[slug]', { slug: component.slug })}
													data-sveltekit-reload="false"
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
			</div>
		</ScrollArea.Root>
	</Sidebar.Content>
</Sidebar.Root>
