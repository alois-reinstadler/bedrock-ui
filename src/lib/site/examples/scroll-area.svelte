<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';

	const activity = [
		['09:42', 'Invoice #1048 was approved'],
		['09:31', 'Mara updated the delivery address'],
		['09:18', 'Payment reconciliation completed'],
		['08:56', 'Three line items were imported'],
		['08:41', 'Invoice #1047 was sent'],
		['08:24', 'A new customer note was added'],
		['08:03', 'Monthly report was generated'],
		['07:48', 'Workspace permissions changed']
	];
</script>

<div data-blur-examples class="grid w-full min-w-0 gap-6">
	<div class="grid min-w-0 gap-6 md:grid-cols-2">
		<div class="min-w-0 space-y-2">
			<p class="text-sm font-medium">Vertical activity</p>
			<ScrollArea edgeBlur="vertical" class="h-52 rounded-xl border bg-card">
				<div class="space-y-1 p-3" role="region" aria-label="Recent activity">
					{#each activity as entry (entry[0])}
						<div
							class="grid grid-cols-[3rem_1fr] gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted"
						>
							<time class="font-mono text-xs text-muted-foreground">{entry[0]}</time>
							<Button
								variant="ghost"
								class="h-auto justify-start p-0 text-left whitespace-normal"
								onclick={(event) =>
									event.currentTarget.setAttribute(
										'aria-pressed',
										event.currentTarget.getAttribute('aria-pressed') !== 'true' ? 'true' : 'false'
									)}
								aria-pressed="false">{entry[1]}</Button
							>
						</div>
					{/each}
				</div>
			</ScrollArea>
		</div>

		<div class="min-w-0 space-y-2">
			<p class="text-sm font-medium">Horizontal comparison</p>
			<ScrollArea
				orientation="horizontal"
				edgeBlur="horizontal"
				class="h-52 rounded-xl border bg-muted"
			>
				<div class="flex w-max gap-3 p-3">
					{#each ['Starter', 'Studio', 'Business', 'Scale'] as plan, index (plan)}
						<div class="w-44 shrink-0 rounded-lg border bg-card p-4 shadow-sm">
							<p class="font-medium">{plan}</p>
							<p class="mt-1 text-2xl font-semibold">${[12, 29, 64, 120][index]}</p>
							<p class="mt-6 text-xs text-muted-foreground">Per workspace, billed monthly</p>
						</div>
					{/each}
				</div>
			</ScrollArea>
		</div>
	</div>

	<div class="min-w-0 space-y-2">
		<p class="text-sm font-medium">Two-axis workspace</p>
		<ScrollArea
			orientation="both"
			edgeBlur="both"
			edgeBlurSize={56}
			class="h-56 rounded-xl border bg-card"
		>
			<div class="min-w-[56rem] p-3">
				<div class="grid grid-cols-[9rem_repeat(5,7rem)] gap-2 text-sm">
					{#each ['Project', 'Owner', 'Status', 'Budget', 'Updated', 'Risk'] as heading (heading)}
						<div class="rounded-md bg-foreground px-3 py-2 font-medium text-background">
							{heading}
						</div>
					{/each}
					{#each Array.from({ length: 30 }, (_, index) => index) as cell (cell)}
						<div class="rounded-md border bg-background px-3 py-3">
							{['Atlas', 'Mara', 'Active', '$42k', 'Today', 'Low'][cell % 6]}
						</div>
					{/each}
				</div>
			</div>
		</ScrollArea>
	</div>
	<div class="min-w-0 space-y-2">
		<p class="text-sm font-medium">Nested project notes</p>
		<ScrollArea
			edgeBlur="vertical"
			class="h-48 rounded-xl border bg-muted"
			style="--progressive-blur-fallback: var(--muted)"
		>
			<div class="space-y-4 p-4">
				<p class="text-sm">Scroll the notes vertically and the attached milestones horizontally.</p>
				<ScrollArea
					orientation="horizontal"
					edgeBlur="horizontal"
					class="h-24 rounded-lg border bg-card"
				>
					<div class="flex w-max gap-3 p-3">
						{#each ['Discover', 'Prototype', 'Review', 'Deliver'] as milestone (milestone)}
							<Button variant="outline" class="w-40">{milestone}</Button>
						{/each}
					</div>
				</ScrollArea>
				<p class="text-sm">
					The review includes keyboard navigation, responsive layouts, and clear status feedback.
				</p>
				<p class="text-sm">
					Each scroll region tracks its own hidden edges. Focusing a milestone clears the decoration
					in both containing regions.
				</p>
			</div>
		</ScrollArea>
	</div>
</div>
