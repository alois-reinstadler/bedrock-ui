<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Breadcrumb from '#lib/bedrock/ui/breadcrumb';
	import { Separator } from '#lib/bedrock/ui/separator';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
	import DocsSidebar from '#lib/site/DocsSidebar.svelte';
	import ThemeToggle from '#lib/site/ThemeToggle.svelte';
	import { getComponent } from '#lib/site/registry';

	let { children } = $props();

	let path = $derived(page.url.pathname);
	let crumbs = $derived.by(() => {
		if (path === '/docs') {
			return [{ href: '/docs', label: 'Docs', current: true }];
		}
		if (path === '/docs/installation') {
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: '/docs/installation', label: 'Installation', current: true }
			];
		}
		if (path === '/docs/components') {
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: '/docs/components', label: 'Components', current: true }
			];
		}
		const match = path.match(/^\/docs\/components\/([^/]+)$/);
		if (match) {
			const component = getComponent(match[1]);
			return [
				{ href: '/docs', label: 'Docs', current: false },
				{ href: '/docs/components', label: 'Components', current: false },
				{
					href: path,
					label: component?.title ?? match[1],
					current: true
				}
			];
		}
		return [{ href: '/docs', label: 'Docs', current: true }];
	});
</script>

<Sidebar.Provider>
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
							{:else}
								<Breadcrumb.Link href={resolve(crumb.href)}>{crumb.label}</Breadcrumb.Link>
							{/if}
						</Breadcrumb.Item>
						{#if index < crumbs.length - 1}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<ThemeToggle />
		</header>
		<div class="flex-1">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
