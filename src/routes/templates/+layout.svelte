<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Popover from '#lib/bedrock/ui/popover';
	import ThemeToggle from '#lib/site/ThemeToggle.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Check from '@lucide/svelte/icons/check';
	import Minimize2 from '@lucide/svelte/icons/minimize-2';
	import PanelsTopLeft from '@lucide/svelte/icons/panels-top-left';
	import { templates } from '#lib/site/templates.js';
	let { children } = $props();
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	let collapsed = $state(false);
	let switcherOpen = $state(false);
	function templateFor(pathname: string) {
		return templates.find(
			(template) =>
				pathname === `/templates/${template.slug}` ||
				pathname.startsWith(`/templates/${template.slug}/`)
		);
	}
	const current = $derived(templateFor(page.url.pathname));
	onNavigate((navigation) => {
		if (
			!document.startViewTransition ||
			matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!navigation.from?.url.pathname.startsWith('/templates/') ||
			!navigation.to?.url.pathname.startsWith('/templates/') ||
			templateFor(navigation.from.url.pathname)?.slug ===
				templateFor(navigation.to.url.pathname)?.slug
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

<!-- These local workspaces own live state; speculative route forks must not replay it on hover. -->
<div class="template-screen" data-sveltekit-preload-data="off">
	{@render children()}

	<div
		class="preview-controls"
		class:music-preview={current?.slug === 'music-player'}
		class:social-preview={current?.slug === 'social-network'}
		class:watch-preview={page.url.pathname.startsWith('/templates/video-library/watch/')}
		role="region"
		aria-label="Template preview controls"
		data-ready={ready}
	>
		<Button
			variant="ghost"
			size="icon"
			aria-label={collapsed ? 'Show preview controls' : 'Minimize preview controls'}
			aria-expanded={!collapsed}
			onclick={() => {
				collapsed = !collapsed;
				switcherOpen = false;
			}}
		>
			{#if collapsed}<PanelsTopLeft class="size-4" />{:else}<Minimize2 class="size-4" />{/if}
		</Button>
		{#if !collapsed}
			<span class="h-5 w-px bg-border" aria-hidden="true"></span>
			<Button
				href={`/docs/templates${current ? `#${current.slug}` : ''}`}
				variant="ghost"
				size="icon"
				aria-label="Back to templates"
				title="Back to all templates"><ArrowLeft class="size-4" /></Button
			>
			<Popover.Root open={switcherOpen} onOpenChange={(open) => (switcherOpen = open)}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="sm"
							aria-label="Switch template"
							class="gap-2 px-2"
						>
							<span class="max-w-32 truncate">{current?.title ?? 'Templates'}</span>
							<ChevronDown class="size-3.5 text-muted-foreground" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content
					side="top"
					align="start"
					sideOffset={12}
					class="w-[min(22rem,calc(100vw-2rem))] p-2"
				>
					<p
						class="px-3 pt-2 pb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase"
					>
						Explore a template
					</p>
					<nav aria-label="Live templates" class="grid gap-1">
						{#each templates as template (template.slug)}
							<a
								href={`/templates/${template.slug}`}
								aria-current={current?.slug === template.slug ? 'page' : undefined}
								aria-label={template.title}
								onclick={() => (switcherOpen = false)}
								class="flex items-start gap-3 rounded-lg p-3 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-muted"
							>
								<span class="min-w-0 flex-1">
									<span class="block text-sm font-medium">{template.title}</span>
									<span class="mt-1 block text-xs leading-relaxed text-muted-foreground"
										>{template.description}</span
									>
								</span>
								{#if current?.slug === template.slug}<Check class="mt-0.5 size-4 shrink-0" />{/if}
							</a>
						{/each}
					</nav>
					<p class="px-3 pt-3 pb-2 text-xs text-muted-foreground">
						Interactive previews · local demo data
					</p>
				</Popover.Content>
			</Popover.Root>
			<span class="h-5 w-px bg-border" aria-hidden="true"></span>
			<ThemeToggle />
		{/if}
	</div>
</div>

<style>
	.preview-controls {
		view-transition-name: preview-controls;
		position: fixed;
		bottom: max(1rem, env(safe-area-inset-bottom));
		left: max(1rem, env(safe-area-inset-left));
		z-index: 45;
		display: flex;
		align-items: center;
		padding: 0.25rem;
		max-width: calc(100vw - 2rem);
		border: 1px solid var(--border);
		border-radius: 0.875rem;
		background: var(--background);
		box-shadow: 0 4px 24px #0002;
	}
	.watch-preview {
		bottom: calc(6rem + env(safe-area-inset-bottom));
	}
	.music-preview {
		bottom: 6.5rem;
	}
	@media (max-width: 767px) {
		.music-preview {
			bottom: calc(10rem + env(safe-area-inset-bottom));
		}
		.watch-preview {
			bottom: calc(9rem + env(safe-area-inset-bottom));
		}
		.social-preview {
			bottom: calc(5rem + env(safe-area-inset-bottom));
		}
	}
	.template-screen {
		min-height: 100dvh;
		view-transition-name: template-screen;
	}
	:global(::view-transition-group(preview-controls)) {
		animation: none;
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
