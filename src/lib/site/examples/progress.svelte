<script lang="ts">
	import { Progress } from '#lib/bedrock/ui/progress';
	import { Button } from '#lib/bedrock/ui/button';
	let completed = $state(2);
	const total = 5;
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Workspace preparation</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Show a determinate bar only when total work is known, and accompany it with a useful status
			message.
		</p>
	</header>
	<div class="space-y-3">
		<div class="flex justify-between text-sm">
			<span>Preparing your workspace</span><span>{completed} of {total} tasks</span>
		</div>
		<Progress value={(completed / total) * 100} aria-label="Workspace preparation" />
		<p role="status" class="text-sm text-muted-foreground">
			{completed === total
				? 'Your workspace is ready to open.'
				: 'Importing sample documents. You can keep working while this finishes.'}
		</p>
		<div class="flex flex-wrap gap-2">
			<Button disabled={completed === total} onclick={() => (completed += 1)}
				>Complete next sample task</Button
			><Button variant="ghost" onclick={() => (completed = 0)}>Restart demonstration</Button>
		</div>
	</div>
</section>
