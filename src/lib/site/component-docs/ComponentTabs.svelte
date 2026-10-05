<script lang="ts">
	import {
		positionIndicator,
		observeIndicatorSizes
	} from '#lib/bedrock/motion/shared-indicator.js';
	import type { ComponentDoc } from '#lib/site/registry';
	import type { ComponentDocTab } from '#lib/site/component-guides/index.js';

	let { component, active }: { component: ComponentDoc; active: ComponentDocTab } = $props();

	const tabs: { value: ComponentDocTab; label: string }[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'properties', label: 'Properties' },
		{ value: 'accessibility', label: 'Accessibility' }
	];

	function trackIndicator(root: HTMLElement) {
		const mark = root.querySelector<HTMLElement>('[data-slot="doc-tabs-indicator"]')!;
		let visible = false;
		const measure = () => {
			const selected = root.querySelector<HTMLElement>('a[aria-current="page"]');
			if (selected) positionIndicator(root, mark, selected, visible);
			visible = Boolean(selected);
			mark.style.visibility = visible ? 'visible' : 'hidden';
			root.toggleAttribute('data-shared-indicator', visible);
		};
		const sizes = observeIndicatorSizes(root, 'a', measure);
		const mutations = new MutationObserver(measure);
		mutations.observe(root, {
			subtree: true,
			attributes: true,
			attributeFilter: ['aria-current'],
			childList: true
		});
		measure();
		return () => {
			sizes.disconnect();
			mutations.disconnect();
			root.removeAttribute('data-shared-indicator');
		};
	}

	function href(value: ComponentDocTab) {
		return value === 'overview'
			? `/docs/components/${component.slug}`
			: `/docs/components/${component.slug}?tab=${value}`;
	}
</script>

<nav aria-label={`${component.title} documentation`} class="border-b">
	<ul class="relative flex gap-6 overflow-x-auto" data-doc-tabs {@attach trackIndicator}>
		<li
			data-slot="doc-tabs-indicator"
			aria-hidden="true"
			role="presentation"
			class="pointer-events-none absolute"
			style="visibility: hidden"
		>
			<span class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"></span>
		</li>
		{#each tabs as tab (tab.value)}
			<li>
				<a
					href={href(tab.value)}
					data-sveltekit-reload
					aria-current={active === tab.value ? 'page' : undefined}
					class="relative block py-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:text-foreground"
				>
					{tab.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	[data-slot='doc-tabs-indicator'] {
		transition:
			left var(--motion-layout) var(--motion-ease-enter),
			top var(--motion-layout) var(--motion-ease-enter),
			width var(--motion-layout) var(--motion-ease-enter),
			height var(--motion-layout) var(--motion-ease-enter);
	}
	ul:not([data-shared-indicator]) a[aria-current='page']::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		height: 2px;
		border-radius: 999px;
		background: var(--primary);
	}
	:global([data-bedrock-motion='reduced']) [data-slot='doc-tabs-indicator'] {
		transition: none !important;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-slot='doc-tabs-indicator'] {
			transition: none !important;
		}
	}
</style>
