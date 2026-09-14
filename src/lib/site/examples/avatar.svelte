<script lang="ts">
	import * as Avatar from '#lib/bedrock/ui/avatar';
	import { Button } from '#lib/bedrock/ui/button';
	let assigned = $state('Mara Vale');
	const reviewers = [
		{ name: 'Mara Vale', initials: 'MV', role: 'Design lead' },
		{ name: 'Kai Holt', initials: 'KH', role: 'Engineering' },
		{ name: 'Ari Lane', initials: 'AL', role: 'Content design' }
	];
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Project reviewers</h3>
		<p class="text-sm text-muted-foreground">
			Keep a visible name beside each avatar; initials remain useful when a teammate has no photo.
		</p>
	</header>
	<div class="divide-y rounded-xl border bg-card">
		{#each reviewers as reviewer (reviewer.name)}<div class="flex flex-wrap items-center gap-3 p-4">
				<Avatar.Root><Avatar.Fallback>{reviewer.initials}</Avatar.Fallback></Avatar.Root>
				<div class="min-w-32 flex-1">
					<p class="font-medium">{reviewer.name}</p>
					<p class="text-sm text-muted-foreground">{reviewer.role}</p>
				</div>
				<Button
					variant={assigned === reviewer.name ? 'secondary' : 'outline'}
					size="sm"
					aria-pressed={assigned === reviewer.name}
					onclick={() => (assigned = reviewer.name)}
					>{assigned === reviewer.name ? 'Assigned' : 'Assign reviewer'}</Button
				>
			</div>{/each}
	</div>
	<p role="status" class="text-sm text-muted-foreground">Next review: {assigned}</p>
</section>
