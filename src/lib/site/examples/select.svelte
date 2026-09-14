<script lang="ts">
	import * as Select from '#lib/bedrock/ui/select';
	import { Label } from '#lib/bedrock/ui/label';
	let value = $state('weekly');
	const options = [
		{ value: 'daily', label: 'Every day' },
		{ value: 'weekly', label: 'Every Monday' },
		{ value: 'never', label: 'Never' }
	];
	const label = $derived(options.find((option) => option.value === value)?.label);
</script>

<section class="max-w-md space-y-4 rounded-xl border p-5">
	<h3 class="font-medium">Workspace digest</h3>
	<p class="text-sm text-muted-foreground">
		Bundle project updates into one email. Urgent security alerts are sent separately.
	</p>
	<Label for="digest-frequency">Email frequency</Label><Select.Root type="single" bind:value
		><Select.Trigger id="digest-frequency" class="w-full">{label}</Select.Trigger><Select.Content
			>{#each options as option (option.value)}<Select.Item
					value={option.value}
					label={option.label}
				/>{/each}</Select.Content
		></Select.Root
	>
	<p class="text-sm" role="status">
		{value === 'never'
			? 'Digest emails are paused.'
			: value === 'daily'
				? 'Your digest arrives each morning at 09:00.'
				: 'Your digest arrives on Monday at 09:00.'}
	</p>
</section>
