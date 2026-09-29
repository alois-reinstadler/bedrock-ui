<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Progress } from '#lib/bedrock/ui/progress';
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
	import { Icon } from '#lib/bedrock/ui/icon';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import ListChecksIcon from '@lucide/svelte/icons/list-checks';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
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

<div role="group" data-slot="chat-activity" aria-label={label} class={cn('min-w-0', className)}>
	<div class={cn('flex gap-1.5', layout === 'chips' ? 'flex-wrap items-start' : 'flex-col')}>
		{#each steps as step (step.id)}
			<Collapsible.Root
				data-slot="chat-activity-step"
				data-status={step.status}
				class={cn(
					'group/activity max-w-full min-w-0 rounded-xl text-sm',
					layout === 'chips' ? 'border bg-muted/30' : 'bg-muted/30'
				)}
			>
				<Collapsible.Trigger
					class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
				>
					<Icon
						icon={step.kind === 'tool'
							? TerminalIcon
							: step.kind === 'reasoning'
								? SparklesIcon
								: ListChecksIcon}
						class="size-3.5 text-muted-foreground"
					/>
					<span class="min-w-0 flex-1 text-xs font-medium break-words">{step.title}</span>
					{#if step.duration}<span class="shrink-0 text-[11px] text-muted-foreground tabular-nums"
							>{step.duration}</span
						>{/if}
					<span
						class="flex shrink-0 items-center gap-1.5 rounded-full bg-background px-2 py-1 text-[10px] text-muted-foreground"
					>
						<StatusDot
							size="sm"
							status={step.status === 'error'
								? 'destructive'
								: step.status === 'complete'
									? 'success'
									: step.status === 'running'
										? 'info'
										: 'neutral'}
							pulse={step.status === 'running'}
						/>{statuses[step.status]}
					</span>
					<Icon
						icon={ChevronDownIcon}
						class="size-3 text-muted-foreground transition-transform group-data-[state=open]/activity:rotate-180"
					/>
				</Collapsible.Trigger>
				<Collapsible.Content class="space-y-3 px-3 pt-1 pb-3">
					{#if step.progress !== undefined}<Progress
							value={progress(step.progress)}
							aria-label={step.title}
						/>{/if}
					{#if step.detail}<pre
							class="max-h-64 overflow-auto rounded-lg bg-background/70 p-3 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">{step.detail}</pre>{/if}
					{#if step.children?.length}<ul class="space-y-2 border-l border-border pl-3">
							{#each step.children as child (child.id)}<li
									class="flex flex-wrap justify-between gap-2 text-xs"
								>
									<span>{child.label}</span><span class="text-muted-foreground"
										>{child.detail ?? ''}</span
									>
								</li>{/each}
						</ul>{/if}
				</Collapsible.Content>
			</Collapsible.Root>
		{:else}<p class="text-sm text-muted-foreground">{emptyLabel}</p>{/each}
	</div>
</div>
