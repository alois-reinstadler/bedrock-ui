<script lang="ts">
	import { afterNavigate, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { dev } from '$app/env';
	import { Feedback, type FeedbackMode } from '#lib/bedrock/ui/feedback';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Popover from '#lib/bedrock/ui/popover';
	import MessageSquarePlus from '@lucide/svelte/icons/message-square-plus';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Check from '@lucide/svelte/icons/check';
	import type { TemplateDoc } from './templates.js';

	let { template, compact = false }: { template: TemplateDoc; compact?: boolean } = $props();
	let mode = $state<FeedbackMode | null>(dev ? 'developer' : null);
	let open = $state(false);
	let settingsOpen = $state(false);
	let trigger = $state<HTMLButtonElement | HTMLAnchorElement | null>(null);
	let initialized = false;
	const preferenceKey = 'bedrock:template-feedback:mode';
	const choices = [
		{ value: 'review', title: 'Customer review', description: 'Leave comments on the website.' },
		{
			value: 'developer',
			title: 'Developer annotations',
			description: 'Capture elements, selectors, and styles.'
		}
	] as const;

	afterNavigate(({ to }) => {
		const requested = to?.url.searchParams.get('feedback');
		if (requested === 'review' || requested === 'developer') {
			mode = requested;
			open = true;
		} else if (requested === 'off') {
			mode = null;
			open = false;
		} else if (!initialized) {
			try {
				const saved = sessionStorage.getItem(preferenceKey);
				if (saved === 'review' || saved === 'developer') mode = saved;
				else if (saved === 'off') mode = null;
			} catch {
				/* A blocked preference store does not prevent annotation. */
			}
		}
		initialized = true;
		rememberMode();
	});

	function rememberMode() {
		try {
			sessionStorage.setItem(preferenceKey, mode ?? 'off');
		} catch {
			/* Preferences are optional; notes have their own storage reporting. */
		}
	}

	function choose(value: FeedbackMode | null) {
		mode = value;
		open = value !== null;
		settingsOpen = false;
		const url = new URL(page.url.href);
		url.searchParams.set('feedback', value ?? 'off');
		replaceState(url, page.state);
		rememberMode();
	}

	function toggle() {
		if (mode === null) choose('review');
		else open = !open;
	}
</script>

<div class="flex items-center" data-feedback-ignore>
	<Button
		bind:ref={trigger}
		variant="ghost"
		size="sm"
		class="gap-2 px-2"
		aria-label="Template feedback"
		aria-expanded={open}
		onclick={toggle}
	>
		<MessageSquarePlus class="size-4" />
		{#if !compact}<span class="hidden sm:inline"
				>{mode === 'developer' ? 'Annotate' : mode === 'review' ? 'Review' : 'Feedback'}</span
			>
		{/if}
	</Button>
	<Popover.Root bind:open={settingsOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}<Button
					{...props}
					variant="ghost"
					size="sm"
					class="px-1.5"
					aria-label="Feedback options"><ChevronDown class="size-3.5" /></Button
				>{/snippet}
		</Popover.Trigger>
		<Popover.Content
			onCloseAutoFocus={(event) => {
				if (open) event.preventDefault();
			}}
			side="top"
			align="end"
			sideOffset={12}
			class="w-[min(20rem,calc(100vw-2rem))] p-2"
			data-feedback-ignore
		>
			<p class="px-3 pt-2 pb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
				Review this template
			</p>
			<div class="grid gap-1">
				{#each choices as choice (choice.value)}
					<Button
						variant="ghost"
						type="button"
						aria-pressed={mode === choice.value}
						onclick={() => choose(choice.value)}
						class={[
							'control-site-templatefeedback h-auto whitespace-normal',
							'flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted'
						]}
					>
						<span class="min-w-0 flex-1"
							><span class="block text-sm font-medium">{choice.title}</span><span
								class="mt-1 block text-xs text-muted-foreground">{choice.description}</span
							></span
						>
						{#if mode === choice.value}<Check class="mt-0.5 size-4 shrink-0" />{/if}
					</Button>
				{/each}
				<Button variant="ghost" class="justify-start px-3" onclick={() => choose(null)}
					>Turn feedback off</Button
				>
			</div>
			<p class="px-3 pt-3 pb-2 text-xs leading-relaxed text-muted-foreground">
				Notes stay in this browser, separately for each template and mode. Copy or export to share.
			</p>
		</Popover.Content>
	</Popover.Root>
</div>

{#if mode}
	{#key `${template.slug}:${mode}`}
		<Feedback
			bind:open
			{mode}
			{trigger}
			showLauncher={false}
			placement="top-right"
			project={`${template.title} template`}
			pageUrl={`${page.url.origin}${page.url.pathname}`}
			scope="[data-template-content]"
			storageKey={`bedrock:template-feedback:${template.slug}:${mode}:v1`}
		/>
	{/key}
{/if}
