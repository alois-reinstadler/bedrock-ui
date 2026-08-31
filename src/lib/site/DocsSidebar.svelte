<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
	import { components, gettingStarted } from './registry';
	import Logo from './Logo.svelte';

	let query = $state('');
	let path = $derived(page.url.pathname);
	let filtered = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return components;
		return components.filter(
			(component) =>
				component.title.toLowerCase().includes(needle) || component.slug.includes(needle)
		);
	});
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<a href={resolve('/')} class="flex h-8 items-center px-2 text-sm">
			<Logo />
		</a>
		<Sidebar.Input
			bind:value={query}
			placeholder="Find a component"
			aria-label="Find a component"
		/>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Start</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each gettingStarted as item (item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={path === item.href}>
								{#snippet child({ props })}
									<a href={resolve(item.href)} {...props}>{item.title}</a>
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
					{#each filtered as component (component.slug)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={path === `/docs/components/${component.slug}`}>
								{#snippet child({ props })}
									<a href={resolve('/docs/components/[slug]', { slug: component.slug })} {...props}
										>{component.title}</a
									>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
