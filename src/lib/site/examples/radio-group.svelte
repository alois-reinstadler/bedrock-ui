<script lang="ts">
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';
	import { Label } from '#lib/bedrock/ui/label';
	let value = $state('standard');
</script>

<fieldset class="max-w-md space-y-4 rounded-xl border p-5">
	<legend class="px-2 font-medium">Delivery method</legend>
	<p class="text-sm text-muted-foreground">Choose speed before reviewing the order total.</p>
	<RadioGroup.Root {value} onValueChange={(next) => (value = next)} aria-label="Delivery method"
		>{#each [{ id: 'standard', label: 'Standard · 3–5 days', cost: 'Free' }, { id: 'express', label: 'Express · Next business day', cost: '$12' }] as option (option.id)}<div
				class="flex items-center gap-3 rounded-lg border p-3"
			>
				<RadioGroup.Item id={'delivery-' + option.id} value={option.id} /><Label
					for={'delivery-' + option.id}
					class="flex-1">{option.label}</Label
				><span class="text-sm">{option.cost}</span>
			</div>{/each}</RadioGroup.Root
	>
	<p role="status" class="text-sm font-medium">
		Order total: {value === 'express' ? '$60' : '$48'}
	</p>
</fieldset>
