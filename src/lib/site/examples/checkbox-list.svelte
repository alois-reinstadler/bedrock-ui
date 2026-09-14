<script lang="ts">
	import { CheckboxList, CheckboxListItem } from '#lib/bedrock/ui/checkbox-list';
	import { Button } from '#lib/bedrock/ui/button';
	let value = $state(['prototype']);
	let summary = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Prepare a client handover</h3>
		<p class="text-sm text-muted-foreground">
			Selection changes the export summary; unavailable material explains why it cannot be included.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<CheckboxList bind:value label="Include in the handover" dividers
			><CheckboxListItem
				value="prototype"
				label="Interactive prototype"
				description="A review link and notes for the current version."
			/><CheckboxListItem
				value="research"
				label="Research summary"
				description="Anonymized findings and design decisions."
			/><CheckboxListItem
				value="assets"
				label="Production assets"
				description="Unavailable until the final artwork is approved."
				disabled
			/></CheckboxList
		><Button
			disabled={value.length === 0}
			onclick={() => (summary = `Prepared a local handover with ${value.length} sections.`)}
			>Prepare handover ({value.length})</Button
		>
		<p role="status" class="text-sm">{summary}</p>
	</div>
</section>
