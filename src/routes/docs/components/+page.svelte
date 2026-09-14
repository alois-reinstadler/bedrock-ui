<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import TypeIcon from '@lucide/svelte/icons/type';
	import MousePointerIcon from '@lucide/svelte/icons/mouse-pointer-2';
	import PanelIcon from '@lucide/svelte/icons/panels-top-left';
	import MessageIcon from '@lucide/svelte/icons/message-square';
	import TableIcon from '@lucide/svelte/icons/table-2';
	import NavigationIcon from '@lucide/svelte/icons/navigation';
	import ImageIcon from '@lucide/svelte/icons/image';
	import SlidersIcon from '@lucide/svelte/icons/sliders-horizontal';
	import CalendarIcon from '@lucide/svelte/icons/calendar-days';
	import CheckIcon from '@lucide/svelte/icons/square-check';
	import PlayIcon from '@lucide/svelte/icons/play';
	import SearchIcon from '@lucide/svelte/icons/search';
	import LayersIcon from '@lucide/svelte/icons/layers';
	import ListIcon from '@lucide/svelte/icons/list-ordered';
	import FileIcon from '@lucide/svelte/icons/file-text';
	import CodeIcon from '@lucide/svelte/icons/code';
	import { Icon } from '#lib/bedrock/ui/icon';
	let query = $state('');
	let category = $state('all');
	const visible = $derived(
		components.filter(
			(item) =>
				(category === 'all' || category === item.category) &&
				`${item.title} ${item.slug} ${item.description} ${item.category}`
					.toLowerCase()
					.includes(query.trim().toLowerCase())
		)
	);
	function identifier(slug: string, group: string) {
		if (/button|toggle/.test(slug)) return MousePointerIcon;
		if (/calendar|date/.test(slug)) return CalendarIcon;
		if (/check|radio|switch/.test(slug)) return CheckIcon;
		if (/slider|resiz|progress|scroll|blur/.test(slug)) return SlidersIcon;
		if (/video|audio|carousel/.test(slug)) return PlayIcon;
		if (/search|command|combobox/.test(slug)) return SearchIcon;
		if (/step|list|tree|menu/.test(slug)) return ListIcon;
		if (/code|terminal/.test(slug)) return CodeIcon;
		if (/file|pdf|editor/.test(slug)) return FileIcon;
		if (/dialog|sheet|drawer|popover|tooltip/.test(slug)) return LayersIcon;
		return (
			{
				form: TypeIcon,
				layout: PanelIcon,
				overlay: MessageIcon,
				data: TableIcon,
				navigation: NavigationIcon,
				display: ImageIcon,
				content: FileIcon
			}[group as 'form'] ?? PanelIcon
		);
	}

	import { components } from '#lib/site/registry';

	const groups = [
		{ id: 'content', label: 'Content' },
		{ id: 'form', label: 'Form' },
		{ id: 'data', label: 'Data' },
		{ id: 'layout', label: 'Layout' },
		{ id: 'overlay', label: 'Overlay' },
		{ id: 'display', label: 'Display' },
		{ id: 'navigation', label: 'Navigation' }
	] as const;
</script>

<svelte:head>
	<title>Components — Bedrock</title>
	<meta name="description" content="Index of Bedrock UI primitives." />
</svelte:head>

<article class="mx-auto max-w-7xl px-4 py-10 md:px-8" data-doc-slug="components">
	<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
		The building blocks
	</p>
	<h1 class="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Components</h1>
	<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
		Focused primitives and component families, owned as source. Find the right interaction,
		understand its contract, and make it yours.
	</p>
	<div class="mt-8 max-w-md">
		<label for="component-search" class="mb-2 block text-sm font-medium">Find a component</label>
		<Input
			id="component-search"
			type="search"
			value={query}
			oninput={(event) => (query = event.currentTarget.value)}
			placeholder="Search names, behavior, or categories…"
		/>
	</div>
	<div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
		<Button
			variant={category === 'all' ? 'secondary' : 'ghost'}
			size="sm"
			aria-pressed={category === 'all'}
			onclick={() => (category = 'all')}>All components</Button
		>
		{#each groups as group (group.id)}
			<Button
				variant={category === group.id ? 'secondary' : 'ghost'}
				size="sm"
				aria-pressed={category === group.id}
				onclick={() => (category = group.id)}>{group.label}</Button
			>
		{/each}
	</div>
	<p class="mt-5 text-sm text-muted-foreground" role="status">
		{visible.length} of {components.length} components
	</p>
	<ul class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
		{#each visible as component (component.slug)}
			<li>
				<a
					href={resolve('/docs/components/[slug]', { slug: component.slug })}
					data-sveltekit-reload
					class="group flex h-full gap-4 rounded-xl border bg-card p-5 transition-colors duration-150 hover:border-foreground/30 hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
				>
					<span
						class="grid size-11 shrink-0 place-items-center rounded-lg border bg-background text-muted-foreground group-hover:text-foreground"
						aria-hidden="true"><Icon icon={identifier(component.slug, component.category)} /></span
					>
					<span class="min-w-0">
						<span class="block font-medium">{component.title}</span>
						<span class="mt-1 block text-sm leading-relaxed text-muted-foreground"
							>{component.description}</span
						>
						<Badge variant="outline" class="mt-3 text-[10px] capitalize">{component.category}</Badge
						>
					</span>
				</a>
			</li>
		{:else}
			<li class="col-span-full rounded-xl border border-dashed p-8 text-muted-foreground">
				No components match “{query}”. Try a broader term or choose another category.
			</li>
		{/each}
	</ul>
</article>
