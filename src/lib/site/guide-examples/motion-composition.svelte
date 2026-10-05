<script lang="ts">
	import { AnimatePresence, LayoutGroup, motion, useMotionValue } from 'astra-motion';
	import { settleOnReducedMotion } from '#lib/bedrock/motion/settle-motion.svelte.js';
	import AstraPolicy from '#lib/bedrock/motion/AstraPolicy.svelte';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';

	const policy = useMotionPolicy();
	const id = $props.id();
	const projects = [
		{
			id: 'research',
			name: 'Research',
			summary: 'Make room for the right questions.',
			detail: 'Collect interviews, compare observations, and decide what to explore next.'
		},
		{
			id: 'design',
			name: 'Design',
			summary: 'Give the next idea a useful shape.',
			detail:
				'Review the prototype with your team, record decisions, and prepare the next iteration.'
		},
		{
			id: 'delivery',
			name: 'Delivery',
			summary: 'Turn a decision into something useful.',
			detail: 'Track the remaining work, check the details, and share the finished result.'
		}
	];
	const opacity = Object.fromEntries(
		projects.map((project) => {
			const value = useMotionValue(1);
			settleOnReducedMotion(value);
			return [project.id, value];
		})
	);
	let expanded = $state<string | null>(null);
	let reversed = $state(false);
	const items = $derived(reversed ? [...projects].reverse() : projects);
	const transition = $derived(
		policy.reduced ? { duration: 0, delay: 0 } : { duration: 0.24, ease: 'easeInOut' as const }
	);

	function close(itemId: string) {
		document.getElementById(`${id}-${itemId}-trigger`)?.focus();
		expanded = null;
	}
</script>

<AstraPolicy>
	<div class="mb-4 flex items-center justify-between gap-4">
		<p class="text-sm text-muted-foreground">Open a project or change the order.</p>
		<Button
			variant="outline"
			size="sm"
			data-testid="composition-reorder"
			onclick={() => (reversed = !reversed)}>Reverse order</Button
		>
	</div>
	<LayoutGroup {id}>
		<div class="grid gap-3 sm:grid-cols-2" data-testid="motion-composition" {@attach policy.attach}>
			{#each items as project (project.id)}
				<motion.article
					layout
					{transition}
					data-testid={`project-${project.id}`}
					class={`rounded-xl border bg-background p-5 ${expanded === project.id ? 'sm:col-span-2' : ''}`}
				>
					<motion.div layout="position" {transition}>
						<h3 class="font-medium">{project.name}</h3>
						<p class="mt-1 mb-4 text-sm text-muted-foreground">{project.summary}</p>
						<Button
							id={`${id}-${project.id}-trigger`}
							variant="outline"
							size="sm"
							aria-expanded={expanded === project.id}
							aria-controls={`${id}-${project.id}-details`}
							onclick={() => (expanded = expanded === project.id ? null : project.id)}
							>{expanded === project.id ? 'Hide' : 'View'}
							{project.name.toLowerCase()} details</Button
						>
						<AnimatePresence present={expanded === project.id} mode="popLayout" initial={false}>
							<motion.div
								id={`${id}-${project.id}-details`}
								style={{ opacity: opacity[project.id] }}
								class="mt-4 border-t pt-4"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								{transition}
								inert={expanded !== project.id}
								aria-hidden={expanded !== project.id}
							>
								<p class="mb-4 max-w-xl text-sm leading-relaxed">{project.detail}</p>
								<Button size="sm" onclick={() => close(project.id)}
									>Done with {project.name.toLowerCase()}</Button
								>
							</motion.div>
						</AnimatePresence>
					</motion.div>
				</motion.article>
			{/each}
		</div>
	</LayoutGroup>
</AstraPolicy>
