<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import {
		Skeleton,
		SkeletonGroup,
		type SkeletonVariant,
		type SkeletonGroupDirection
	} from '#lib/bedrock/ui/skeleton';
	import { Button } from '#lib/bedrock/ui/button';
	import * as NativeSelect from '#lib/bedrock/ui/native-select';
	import { Label } from '#lib/bedrock/ui/label';

	let loading = $state(true);
	let variant = $state<SkeletonVariant>('shimmer');
	let duration = $state(2000);
	let direction = $state<SkeletonGroupDirection>('ltr');
	const variantId = $props.id();
</script>

<Card.Root class="block max-w-md gap-0 space-y-4 p-5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<h3 class="font-medium">Team directory</h3>
		<Button variant="outline" size="sm" onclick={() => (loading = !loading)}>
			{loading ? 'Show loaded content' : 'Show loading state'}
		</Button>
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<Label for={variantId}>Animation</Label>
		<NativeSelect.Root
			id={variantId}
			value={variant}
			onchange={(event) => (variant = event.currentTarget.value as SkeletonVariant)}
		>
			<NativeSelect.Option value="pulse">Pulse</NativeSelect.Option>
			<NativeSelect.Option value="shimmer">Shimmer</NativeSelect.Option>
			<NativeSelect.Option value="static">Static</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<div class="flex flex-wrap gap-4">
		<div class="space-y-2">
			<Label for={`${variantId}-duration`}>Sweep speed</Label>
			<NativeSelect.Root
				id={`${variantId}-duration`}
				value={String(duration)}
				disabled={variant !== 'shimmer'}
				onchange={(event) => (duration = Number(event.currentTarget.value))}
			>
				<NativeSelect.Option value="1000">Fast</NativeSelect.Option>
				<NativeSelect.Option value="2000">Normal</NativeSelect.Option>
				<NativeSelect.Option value="3200">Slow</NativeSelect.Option>
			</NativeSelect.Root>
		</div>
		<div class="space-y-2">
			<Label for={`${variantId}-direction`}>Sweep direction</Label>
			<NativeSelect.Root
				id={`${variantId}-direction`}
				value={direction}
				disabled={variant !== 'shimmer'}
				onchange={(event) => (direction = event.currentTarget.value as SkeletonGroupDirection)}
			>
				<NativeSelect.Option value="ltr">Left to right</NativeSelect.Option>
				<NativeSelect.Option value="rtl">Right to left</NativeSelect.Option>
			</NativeSelect.Root>
		</div>
	</div>
	<p role="status" class="text-sm text-muted-foreground">
		{loading ? 'Loading teammates…' : '2 teammates loaded.'}
	</p>
	<div aria-busy={loading} class="min-h-32 space-y-4">
		{#if loading}
			<SkeletonGroup {variant} {duration} {direction} aria-hidden="true" class="space-y-4">
				{#each [1, 2] as row (row)}
					<div class="flex items-center gap-3">
						<Skeleton class="size-10 shrink-0 rounded-full" />
						<div class="min-w-0 flex-1 space-y-2">
							<Skeleton class="h-4 w-32 max-w-full" />
							<Skeleton class="h-3 w-44 max-w-full" />
						</div>
					</div>
				{/each}
			</SkeletonGroup>
		{:else}
			{#each [{ name: 'Mara Chen', role: 'Product designer' }, { name: 'Ellis Ford', role: 'Frontend engineer' }] as person (person.name)}
				<div class="flex items-center gap-3">
					<span
						class="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm corner-theme"
					>
						{person.name[0]}
					</span>
					<div>
						<p class="text-sm font-medium">{person.name}</p>
						<p class="text-sm text-muted-foreground">{person.role}</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</Card.Root>
