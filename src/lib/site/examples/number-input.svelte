<script lang="ts">
	import { NumberInput } from '#lib/bedrock/ui/number-input';

	let storage = $state<number | null>(64);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Workspace storage estimate</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Bound the storage quantity and show its effect on the monthly estimate before the customer
			commits.
		</p>
	</header>
	<div class="space-y-3">
		<label for="estimate-storage" class="text-sm font-medium">Additional storage</label><NumberInput
			id="estimate-storage"
			bind:value={storage}
			steppers
			unit="GB"
			min={0}
			max={1000}
			step={10}
		/>
		<p role="status" class="text-sm">
			Estimated monthly total: {new Intl.NumberFormat('de-AT', {
				style: 'currency',
				currency: 'EUR'
			}).format((storage ?? 0) * 0.2)}
		</p>
		<p class="text-xs text-muted-foreground">
			Sample pricing: €0.20 per GB. Enter a value from 0 to 1,000 GB.
		</p>
	</div>
</section>
