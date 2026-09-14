<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import SiteHeader from '#lib/site/SiteHeader.svelte';
	import { templates } from '#lib/site/templates.js';
	let { children } = $props();
	onNavigate((navigation) => {
		if (
			!document.startViewTransition ||
			matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!navigation.from?.url.pathname.startsWith('/templates/') ||
			!navigation.to?.url.pathname.startsWith('/templates/') ||
			navigation.from.url.pathname === navigation.to.url.pathname
		)
			return;
		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// A skipped transition must never leave routing waiting on an animation.
			void transition.finished.catch(() => resolve());
		});
	});
</script>

<SiteHeader />
<div
	class="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-2 text-xs md:px-8"
>
	<Button href="/docs/templates" data-sveltekit-reload variant="ghost" size="sm"
		>Back to templates</Button
	>
	<nav aria-label="Live templates" class="flex max-w-full gap-1 overflow-x-auto">
		{#each templates as template (template.slug)}
			<a
				href={`/templates/${template.slug}`}
				aria-current={page.url.pathname === `/templates/${template.slug}` ? 'page' : undefined}
				class="rounded-md px-2.5 py-2 whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
				>{template.title}</a
			>
		{/each}
	</nav>
	<p class="text-muted-foreground">Interactive demo · fictional local data</p>
</div>
<div class="template-screen">{@render children()}</div>

<style>
	.template-screen {
		view-transition-name: template-screen;
	}
	:global(::view-transition-old(template-screen)),
	:global(::view-transition-new(template-screen)) {
		animation-duration: var(--motion-swap);
		animation-timing-function: var(--motion-ease-move);
	}
	@media (prefers-reduced-motion: reduce) {
		.template-screen {
			view-transition-name: none;
		}
		:global(::view-transition-group(*)),
		:global(::view-transition-old(*)),
		:global(::view-transition-new(*)) {
			animation: none !important;
		}
	}
</style>
