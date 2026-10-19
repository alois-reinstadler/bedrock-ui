<script lang="ts">
	import { Skeleton, SkeletonGroup, type SkeletonVariant } from '#lib/bedrock/ui/skeleton';

	const variants: { value: SkeletonVariant; label: string; description: string }[] = [
		{ value: 'pulse', label: 'Pulse', description: 'A gentle fade. The default.' },
		{ value: 'shimmer', label: 'Shimmer', description: 'A continuous diagonal sheen.' },
		{ value: 'static', label: 'Static', description: 'A still placeholder.' }
	];
</script>

<div class="grid w-full gap-6 sm:grid-cols-3" data-skeleton-variants>
	{#each variants as variant (variant.value)}
		<div class="min-w-0 space-y-3">
			<div>
				<p class="text-sm font-medium">{variant.label}</p>
				<p class="text-xs text-muted-foreground">{variant.description}</p>
			</div>
			<div class="space-y-3" aria-hidden="true">
				<Skeleton variant={variant.value} class="h-20 w-full" />
				<div class="flex items-center gap-3">
					<Skeleton variant={variant.value} class="size-8 shrink-0 rounded-full" />
					<div class="grid flex-1 gap-2">
						<Skeleton variant={variant.value} class="h-3 w-2/5" />
						<Skeleton variant={variant.value} class="h-3 w-4/5" />
					</div>
				</div>
			</div>
		</div>
	{/each}
	<div class="space-y-3 sm:col-span-3">
		<div>
			<p class="text-sm font-medium">Shared shimmer</p>
			<p class="text-xs text-muted-foreground">
				One sweep across the whole layout. Only the placeholders catch the light.
			</p>
		</div>
		<SkeletonGroup class="grid grid-cols-[4rem_1fr] gap-4" aria-hidden="true" data-shared-preview>
			<Skeleton class="size-16 rounded-full" />
			<div class="space-y-3">
				<Skeleton class="h-4 w-2/5" />
				<Skeleton class="h-3 w-full" />
				<Skeleton class="h-3 w-3/4" />
			</div>
			<Skeleton class="col-span-2 h-24 w-full" />
			<Skeleton class="col-start-2 h-3 w-1/2" />
		</SkeletonGroup>
	</div>
</div>
