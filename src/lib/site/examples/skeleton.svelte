<script lang="ts">
	import { Skeleton } from '#lib/bedrock/ui/skeleton';
	import { Button } from '#lib/bedrock/ui/button';
	let loading = $state(true);
</script>

<section class="max-w-md space-y-4 rounded-xl border p-5">
	<div class="flex items-center justify-between gap-3">
		<h3 class="font-medium">Team directory</h3>
		<Button variant="outline" size="sm" onclick={() => (loading = !loading)}
			>{loading ? 'Show loaded content' : 'Show loading state'}</Button
		>
	</div>
	<p role="status" class="text-sm text-muted-foreground">
		{loading ? 'Loading teammates…' : '2 teammates loaded.'}
	</p>
	<div aria-busy={loading} class="min-h-32 space-y-4">
		{#if loading}<div aria-hidden="true" class="space-y-4">
				{#each [1, 2] as row (row)}<div class="flex items-center gap-3">
						<Skeleton class="size-10 rounded-full" />
						<div class="flex-1 space-y-2">
							<Skeleton class="h-4 w-32" /><Skeleton class="h-3 w-44" />
						</div>
					</div>{/each}
			</div>{:else}{#each [{ name: 'Mara Chen', role: 'Product designer' }, { name: 'Ellis Ford', role: 'Frontend engineer' }] as person (person.name)}<div
					class="flex items-center gap-3"
				>
					<span class="flex size-10 items-center justify-center rounded-full bg-muted text-sm"
						>{person.name[0]}</span
					>
					<div>
						<p class="text-sm font-medium">{person.name}</p>
						<p class="text-sm text-muted-foreground">{person.role}</p>
					</div>
				</div>{/each}{/if}
	</div>
</section>
