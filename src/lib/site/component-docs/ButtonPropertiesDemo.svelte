<script lang="ts">
	import { Button, type ButtonSize, type ButtonVariant } from '#lib/bedrock/ui/button';
	import { Label } from '#lib/bedrock/ui/label';
	import { Switch } from '#lib/bedrock/ui/switch';

	const variants: ButtonVariant[] = [
		'default',
		'outline',
		'secondary',
		'ghost',
		'destructive',
		'link'
	];
	const sizes: ButtonSize[] = ['xs', 'sm', 'default', 'lg'];

	let variant = $state<ButtonVariant>('default');
	let size = $state<ButtonSize>('default');
	let disabled = $state(false);
</script>

<div
	class="grid gap-6 rounded-xl border bg-card p-5 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.6fr)]"
>
	<div class="flex min-h-32 items-center justify-center rounded-lg bg-muted/35 p-6">
		<Button {variant} {size} {disabled}>Save changes</Button>
	</div>
	<div class="space-y-4">
		<label class="grid gap-1.5 text-sm font-medium">
			Variant
			<select
				name="variant"
				bind:value={variant}
				class="h-9 rounded-lg border bg-background px-3 font-normal"
			>
				{#each variants as option (option)}<option value={option}>{option}</option>{/each}
			</select>
		</label>
		<label class="grid gap-1.5 text-sm font-medium">
			Size
			<select
				name="size"
				bind:value={size}
				class="h-9 rounded-lg border bg-background px-3 font-normal"
			>
				{#each sizes as option (option)}<option value={option}>{option}</option>{/each}
			</select>
		</label>
		<div class="flex items-center justify-between gap-4">
			<Label for="button-demo-disabled">Disabled</Label>
			<Switch id="button-demo-disabled" bind:checked={disabled} />
		</div>
	</div>
</div>
