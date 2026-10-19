<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Label } from '#lib/bedrock/ui/label';
	import { Switch } from '#lib/bedrock/ui/switch';

	const id = $props.id();
	let edgeBlur = $state(true);
	let wheelToHorizontal = $state(true);

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

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Review a busy workspace</h3>
		<p class="text-sm text-muted-foreground">
			Scroll each panel to see the blur follow its hidden content. It clears at each boundary and
			while using the keyboard to focus a control.
		</p>
	</div>

	<div class="flex items-center justify-between gap-4 rounded-lg border p-3 corner-theme">
		<Label for={`${id}-blur`}>Progressive edge blur</Label>
		<Switch id={`${id}-blur`} bind:checked={edgeBlur} />
	</div>

	<div class="flex items-center justify-between gap-4">
		<Label for={`${id}-wheel`}>Mouse wheel scrolls horizontal panels</Label>
		<Switch id={`${id}-wheel`} bind:checked={wheelToHorizontal} />
	</div>
	<p class="text-sm text-muted-foreground">
		Hover a horizontal panel and use your mouse wheel. At either end, scrolling continues on the
		page.
	</p>

	<div data-blur-examples class="grid w-full min-w-0 gap-6">
		<div class="grid min-w-0 gap-6 md:grid-cols-2">
			<div class="min-w-0 space-y-2">
				<p class="text-sm font-medium">Vertical activity</p>
				<ScrollArea {edgeBlur} class="h-52 rounded-xl border bg-card">
					<div class="space-y-1 p-3" role="region" aria-label="Recent activity">
						{#each activity as entry (entry[0])}
							<div
								class="grid grid-cols-[3rem_1fr] gap-3 rounded-lg px-2 py-2 text-sm corner-theme hover:bg-muted"
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
					{wheelToHorizontal}
					{edgeBlur}
					class="h-52 rounded-xl border bg-muted"
				>
					<div class="flex w-max gap-3 p-3">
						{#each ['Starter', 'Studio', 'Business', 'Scale'] as plan, index (plan)}
							<Card.Root class="block w-44 shrink-0 gap-0 p-4 shadow-sm">
								<p class="font-medium">{plan}</p>
								<p class="mt-1 text-2xl font-semibold">${[12, 29, 64, 120][index]}</p>
								<p class="mt-6 text-xs text-muted-foreground">Per workspace, billed monthly</p>
							</Card.Root>
						{/each}
					</div>
				</ScrollArea>
			</div>
		</div>

		<div class="min-w-0 space-y-2">
			<p class="text-sm font-medium">Two-axis workspace</p>
			<ScrollArea
				orientation="both"
				{edgeBlur}
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
				{edgeBlur}
				class="h-48 rounded-xl border bg-muted"
				style="--progressive-blur-fallback: var(--muted)"
			>
				<div class="space-y-4 p-4">
					<p class="text-sm">
						Scroll the notes vertically and the attached milestones horizontally.
					</p>
					<ScrollArea
						orientation="horizontal"
						{wheelToHorizontal}
						{edgeBlur}
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
						Each scroll region tracks its own hidden edges. Focusing a milestone clears the
						decoration in both containing regions.
					</p>
				</div>
			</ScrollArea>
		</div>
	</div>
</section>
