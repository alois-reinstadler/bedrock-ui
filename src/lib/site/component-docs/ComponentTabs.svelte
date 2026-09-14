<script lang="ts">
	import type { ComponentDoc } from '#lib/site/registry';
	import type { ComponentDocTab } from '#lib/site/component-guides/index.js';

	let { component, active }: { component: ComponentDoc; active: ComponentDocTab } = $props();

	const tabs: { value: ComponentDocTab; label: string }[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'properties', label: 'Properties' },
		{ value: 'accessibility', label: 'Accessibility' }
	];

	function href(value: ComponentDocTab) {
		return value === 'overview'
			? `/docs/components/${component.slug}`
			: `/docs/components/${component.slug}?tab=${value}`;
	}
</script>

<nav aria-label={`${component.title} documentation`} class="border-b">
	<ul class="flex gap-6 overflow-x-auto" data-doc-tabs>
		{#each tabs as tab (tab.value)}
			<li>
				<a
					href={href(tab.value)}
					aria-current={active === tab.value ? 'page' : undefined}
					class="relative block py-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:text-foreground"
				>
					{tab.label}
					{#if active === tab.value}
						<span
							aria-hidden="true"
							class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
						></span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>
