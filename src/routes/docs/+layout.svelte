<script lang="ts">
	import { page } from '$app/state';
	import * as Breadcrumb from '#lib/bedrock/ui/breadcrumb';
	import { Separator } from '#lib/bedrock/ui/separator';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
	import DocsSidebar from '#lib/site/DocsSidebar.svelte';
	import SiteHeader from '#lib/site/SiteHeader.svelte';
	import { getBlock } from '#lib/site/blocks.js';
	import { getComponent } from '#lib/site/registry';

	type Crumb = {
		href: string | null;
		label: string;
		current: boolean;
	};

	let { children } = $props();

	let path = $derived(page.url.pathname);
	let crumbs = $derived.by<Crumb[]>(() => {
		if (path === '/docs') {
			return [{ href: '/docs', label: 'Docs', current: true }];
		}
		if (/^\/docs\/(installation|theming|skills|forms|changelog)$/.test(path)) {
			const label = path.split('/').at(-1) ?? 'Docs';
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: path, label: label[0].toUpperCase() + label.slice(1), current: true }
			];
		}
		if (path === '/docs/components' || path === '/docs/blocks' || path === '/docs/templates') {
			const label = path.split('/').at(-1) ?? 'Docs';
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: path, label: label[0].toUpperCase() + label.slice(1), current: true }
			];
		}
		const blockMatch = path.match(/^\/docs\/blocks\/([^/]+)$/);
		if (blockMatch) {
			const block = getBlock(blockMatch[1]);
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: '/docs/blocks', label: 'Blocks', current: false },
				{ href: null, label: block?.title ?? blockMatch[1], current: true }
			];
		}
		const match = path.match(/^\/docs\/components\/([^/]+)$/);
		if (match) {
			const component = getComponent(match[1]);
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: '/docs/components', label: 'Components', current: false },
				{
					href: null,
					label: component?.title ?? match[1],
					current: true
				}
			];
		}
		return [{ href: '/docs', label: 'Docs', current: true }];
	});
</script>

<div class="flex min-h-dvh flex-col">
	<SiteHeader />
	<Sidebar.Provider class="min-h-0 flex-1">
		<DocsSidebar />
		<Sidebar.Inset>
			<header class="flex h-14 items-center gap-2 border-b px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="h-4" />
				<Breadcrumb.Root class="min-w-0 flex-1">
					<Breadcrumb.List>
						{#each crumbs as crumb, index (crumb.href)}
							<Breadcrumb.Item>
								{#if crumb.current}
									<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
								{:else if crumb.href}
									<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
								{/if}
							</Breadcrumb.Item>
							{#if index < crumbs.length - 1}
								<Breadcrumb.Separator />
							{/if}
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>
			<div class="flex-1">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>
