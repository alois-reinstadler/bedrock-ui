<script lang="ts">
	import { resolve } from '$app/paths';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import {
		positionIndicator,
		isIndicatorTargetVisible,
		observeIndicatorSizes
	} from '#lib/bedrock/motion/shared-indicator.js';
	import {
		elementPrefersReducedMotion,
		observeMotionReduction
	} from '#lib/bedrock/motion/policy.js';
	import { motionPresets } from '#lib/bedrock/motion/tokens.js';
	import * as ScrollArea from '#lib/bedrock/ui/scroll-area';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
	import { blocks } from './blocks';
	import { shaders } from '#lib/bedrock/shaders/catalog.js';
	import { templates } from './templates.js';
	import { components, gettingStarted } from './registry';

	const catalogueLinks = [
		{ title: 'Shaders', href: '/docs/shaders', keywords: 'paper backgrounds text images effects' },
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
			...shaders.map((item) => ({
				title: item.title,
				href: `/docs/shaders/${item.slug}`,
				keywords: `${item.slug} ${item.description} ${item.category} paper shader`,
				kind: 'Shader'
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
	let activeVisible = $state(false);
	let hoverVisible = $state(false);

	function positionHighlight(root: HTMLElement, slot: string, link: HTMLElement, animate: boolean) {
		const mark = root.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
		if (mark) positionIndicator(root, mark, link, animate);
	}

	function observeLinkSizes(root: HTMLElement, measure: () => void) {
		return observeIndicatorSizes(root, '[data-sidebar="menu-button"]', measure);
	}

	function trackHoveredLink(root: HTMLElement) {
		const selector = '[data-sidebar="menu-button"]';
		let hovered: HTMLElement | null = null;
		const measure = () => {
			if (hovered && !root.contains(hovered)) hovered = null;
			untrack(() => {
				if (hovered) positionHighlight(root, 'docs-hover-highlight', hovered, hoverVisible);
				hoverVisible = Boolean(hovered);
			});
		};
		const enter = (event: PointerEvent) => {
			if (event.pointerType === 'touch') return;
			const next =
				event.target instanceof Element ? event.target.closest<HTMLElement>(selector) : null;
			// Keep the shared surface alive while crossing the gaps between rows.
			if (!next || next === hovered) return;
			hovered = next;
			measure();
		};
		const leave = () => {
			hovered = null;
			measure();
		};
		const scroll = () => {
			if (!hovered) return;
			hovered = root.querySelector<HTMLElement>(`${selector}:hover`);
			measure();
		};
		const viewport = root.closest('[data-slot="scroll-area-viewport"]');
		const sizes = observeLinkSizes(root, measure);
		const mutations = new MutationObserver(() => {
			sizes.refresh();
			measure();
		});
		mutations.observe(root, { subtree: true, childList: true, characterData: true });
		root.addEventListener('pointerover', enter);
		root.addEventListener('pointerleave', leave);
		viewport?.addEventListener('scroll', scroll, { passive: true });
		return () => {
			sizes.disconnect();
			mutations.disconnect();
			root.removeEventListener('pointerover', enter);
			root.removeEventListener('pointerleave', leave);
			viewport?.removeEventListener('scroll', scroll);
		};
	}

	function trackActiveLink(root: HTMLElement) {
		let previous: HTMLElement | null | undefined;
		let entry: Animation | undefined;
		const stopEntry = () => {
			entry?.cancel();
			entry = undefined;
		};
		const stopPolicy = observeMotionReduction(root, (reduced) => {
			if (reduced) stopEntry();
		});
		const measure = () => {
			const active = root.querySelector<HTMLElement>(
				'[data-sidebar="menu-button"][data-active="true"]'
			);
			untrack(() => {
				const changed = active !== previous;
				const move = activeVisible && (!changed || isIndicatorTargetVisible(previous));
				if (changed) stopEntry();
				if (active) {
					positionHighlight(root, 'docs-active-highlight', active, move);
					if (changed && previous !== undefined && !move && !elementPrefersReducedMotion(root)) {
						const mark = root.querySelector<HTMLElement>('[data-slot="docs-active-highlight"]');
						entry = mark?.animate(
							{ opacity: [0, 1], translate: ['0 3px', '0 0'] },
							{
								duration: motionPresets.enter.duration,
								easing: `cubic-bezier(${motionPresets.enter.easing.join(',')})`
							}
						);
					}
				}
				previous = active;
				activeVisible = Boolean(active);
			});
		};
		const sizes = observeLinkSizes(root, measure);
		const mutations = new MutationObserver(() => {
			sizes.refresh();
			measure();
		});
		mutations.observe(root, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['data-active']
		});
		measure();
		return () => {
			stopEntry();
			stopPolicy();
			mutations.disconnect();
			sizes.disconnect();
		};
	}
</script>

<Sidebar.Root highlights={false} class="md:top-14 md:h-[calc(100svh-3.5rem)]">
	<Sidebar.Header class="h-14 shrink-0 justify-center border-b py-0">
		<Sidebar.Input
			bind:value={query}
			name="docs-search"
			placeholder="Search documentation"
			aria-label="Search documentation"
		/>
	</Sidebar.Header>
	<Sidebar.Content class="overflow-hidden">
		<ScrollArea.Root
			edgeBlur
			class="min-h-0 flex-1"
			style="--progressive-blur-surface: var(--sidebar)"
		>
			<div
				data-docs-navigation
				class="relative isolate pe-2.5"
				{@attach trackActiveLink}
				{@attach trackHoveredLink}
			>
				<span
					data-slot="docs-hover-highlight"
					data-visible={hoverVisible}
					aria-hidden="true"
					class="pointer-events-none absolute z-1"
				>
					<span data-hover-surface class="absolute inset-0 rounded-md bg-sidebar-hover corner-theme"
					></span>
				</span>
				<span
					data-slot="docs-active-highlight"
					aria-hidden="true"
					class="pointer-events-none absolute rounded-md bg-sidebar-accent"
					style:visibility={activeVisible ? 'visible' : 'hidden'}
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
											class="relative z-10 hover:bg-transparent data-[active=false]:hover:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
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
											class="relative z-10 hover:bg-transparent data-[active=false]:hover:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
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
											class="relative z-10 hover:bg-transparent data-[active=false]:hover:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
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
											class="relative z-10 hover:bg-transparent data-[active=false]:hover:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
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

<style>
	[data-slot='docs-active-highlight'] {
		transition:
			left var(--motion-layout) var(--motion-ease-enter),
			top var(--motion-layout) var(--motion-ease-enter),
			width var(--motion-layout) var(--motion-ease-enter),
			height var(--motion-layout) var(--motion-ease-enter);
	}

	[data-slot='docs-hover-highlight'] {
		visibility: hidden;
		/* Keep painting the surface until its opacity transition has finished. */
		transition:
			left var(--motion-state) var(--motion-ease-enter),
			top var(--motion-state) var(--motion-ease-enter),
			width var(--motion-state) var(--motion-ease-enter),
			height var(--motion-state) var(--motion-ease-enter),
			visibility 0s linear var(--motion-state);
	}

	[data-slot='docs-hover-highlight'][data-visible='true'] {
		visibility: visible;
		transition-delay: 0s;
	}

	/* Re-enter at the new row; only continuous hover shares the previous layout. */
	[data-hover-surface] {
		opacity: 0;
		translate: 0 3px;
		transition:
			opacity var(--motion-state) var(--motion-ease-enter),
			translate var(--motion-state) var(--motion-ease-enter);
	}

	[data-visible='true'] > [data-hover-surface] {
		opacity: 1;
		translate: 0 0;
	}

	/* Keep exact zero motion above the global third-party completion fallback. */
	:global([data-bedrock-motion='reduced']) [data-slot='docs-active-highlight'],
	:global([data-bedrock-motion='reduced']) [data-slot='docs-hover-highlight'],
	:global([data-bedrock-motion='reduced']) [data-hover-surface] {
		transition: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-slot='docs-active-highlight'],
		[data-slot='docs-hover-highlight'],
		[data-hover-surface] {
			transition: none !important;
		}
	}
</style>
