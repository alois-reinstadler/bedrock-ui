<script lang="ts">
	import ActivityItem from './chat-activity-item.svelte';
	import type { ChatActivityStep } from './agent-types';
	import type { ChatActivityStatusLabels } from './activity-types';
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
		statusLabels?: ChatActivityStatusLabels;
		class?: string;
	} = $props();
</script>

<div role="group" data-slot="chat-activity" aria-label={label} class={cn('min-w-0', className)}>
	<div class={cn('flex gap-1.5', layout === 'chips' ? 'flex-wrap items-start' : 'flex-col')}>
		{#each steps as step (step.id)}
			<ActivityItem
				title={step.title}
				kind={step.kind}
				status={step.status}
				duration={step.duration}
				progress={step.progress}
				detail={step.detail}
				items={step.children}
				{statusLabels}
				data-slot="chat-activity-step"
				class={layout === 'chips' ? 'max-w-full border' : undefined}
			/>
		{:else}<p class="text-sm text-muted-foreground">{emptyLabel}</p>{/each}
	</div>
</div>
