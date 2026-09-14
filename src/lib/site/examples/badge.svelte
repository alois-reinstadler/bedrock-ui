<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	let approved = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Triage a release checklist</h3>
		<p class="text-sm text-muted-foreground">
			Combine text labels with state; color alone must never communicate whether work is ready.
		</p>
	</header>
	<div class="divide-y rounded-xl border bg-card">
		<div class="flex flex-wrap items-center justify-between gap-3 p-4">
			<div>
				<p class="font-medium">Keyboard navigation review</p>
				<p class="text-sm text-muted-foreground">Mara Vale · Accessibility</p>
			</div>
			<Badge>Complete</Badge>
		</div>
		<div class="flex flex-wrap items-center justify-between gap-3 p-4">
			<div>
				<p class="font-medium">Release notes</p>
				<p class="text-sm text-muted-foreground">Kai Holt · Documentation</p>
			</div>
			<Badge variant={approved ? 'default' : 'secondary'}
				>{approved ? 'Approved' : 'Needs review'}</Badge
			>
		</div>
		<div class="p-4">
			<Button size="sm" variant="outline" onclick={() => (approved = !approved)}
				>{approved ? 'Reopen review' : 'Approve release notes'}</Button
			>
			<p role="status" class="mt-2 text-sm text-muted-foreground">
				{approved ? 'All checklist items are ready.' : 'One item still needs review.'}
			</p>
		</div>
	</div>
</section>
