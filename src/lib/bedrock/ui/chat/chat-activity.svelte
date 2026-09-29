<script lang="ts">
	import type { ChatActivityStep } from './agent-types';
	import { cn } from '#lib/utils.js';
	let {
		steps = [],
		layout = 'list',
		label = 'Activity',
		emptyLabel = 'No activity yet.',
		statusLabels = {},
		class: className
	}: {
		steps?: ChatActivityStep[];
		layout?: 'list' | 'chips';
		label?: string;
		emptyLabel?: string;
		statusLabels?: Partial<Record<ChatActivityStep['status'], string>>;
		class?: string;
	} = $props();
	const statuses = $derived({
		pending: 'Pending',
		running: 'Running',
		complete: 'Completed',
		error: 'Failed',
		...statusLabels
	});
	function progress(value: number) {
		return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
	}
</script>

<section data-slot="chat-activity" aria-label={label} class={cn('min-w-0 space-y-2', className)}>
	<div class={cn('flex gap-2', layout === 'chips' ? 'flex-wrap items-start' : 'flex-col')}>
		{#each steps as step (step.id)}
			<details
				data-slot="chat-activity-step"
				data-status={step.status}
				class="max-w-full min-w-0 rounded-lg border bg-background text-sm"
			>
				<summary
					class="cursor-pointer rounded-lg p-3 break-words focus-visible:outline-2 focus-visible:outline-ring"
				>
					<span class="font-medium">{step.title}</span>
					<span
						class={cn(
							'ml-2 text-xs text-muted-foreground',
							step.status === 'error' && 'text-destructive'
						)}>{statuses[step.status]}</span
					>
					{#if step.duration}<span class="ml-2 text-xs text-muted-foreground">{step.duration}</span
						>{/if}
				</summary>
				<div class="space-y-2 px-3 pb-3">
					{#if step.kind}<p class="text-xs text-muted-foreground">{step.kind}</p>{/if}
					{#if step.progress !== undefined}<progress
							max="100"
							value={progress(step.progress)}
							aria-label={step.title}
							class="h-2 w-full accent-primary"
						></progress>{/if}
					{#if step.detail}<pre
							class="max-h-64 overflow-auto text-xs break-words whitespace-pre-wrap">{step.detail}</pre>{/if}
					{#if step.children?.length}<ul class="space-y-1">
							{#each step.children as child (child.id)}<li
									class="flex flex-wrap justify-between gap-2"
								>
									<span>{child.label}</span><span class="text-muted-foreground"
										>{child.detail ?? ''}</span
									>
								</li>{/each}
						</ul>{/if}
				</div>
			</details>
		{:else}<p class="text-sm text-muted-foreground">{emptyLabel}</p>{/each}
	</div>
</section>
