<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Step, Stepper } from '#lib/bedrock/ui/stepper';
	import Package from '@lucide/svelte/icons/package';
	const stages = [
		{
			label: 'Confirmed',
			title: 'Order confirmed',
			detail: 'We have received your order and sent a confirmation to your inbox.',
			date: 'Today, 09:41'
		},
		{
			label: 'Preparing',
			title: 'Getting your order ready',
			detail:
				'Your items are being carefully packed. We will let you know when they are on their way.',
			date: 'Today, 10:15'
		},
		{
			label: 'Shipped',
			title: 'On its way to you',
			detail:
				'Your parcel has left our studio. Follow its progress with the tracking number in your email.',
			date: 'Tomorrow'
		},
		{
			label: 'Delivered',
			title: 'A good delivery day',
			detail: 'Your parcel has arrived. We hope you enjoy your new essentials.',
			date: 'Estimated Thursday'
		}
	];
	let activeStep = $state(1);
	const current = $derived(stages[activeStep]);
</script>

<div class="w-full max-w-2xl rounded-xl border bg-card p-5 corner-theme sm:p-7">
	<div class="mb-8 flex items-start justify-between gap-4">
		<div>
			<p class="text-xs text-muted-foreground">ORDER #BR-2048</p>
			<h3 class="mt-1 text-lg font-semibold">From our studio to your door</h3>
		</div>
		<Package class="size-5 shrink-0 text-muted-foreground" />
	</div>
	<Stepper {activeStep} label="Order progress"
		>{#each stages as stage, i (stage.label)}<Step step={i} label={stage.label} />{/each}</Stepper
	>
	<div class="my-6 rounded-lg bg-muted/50 p-5" aria-live="polite">
		<p class="text-xs text-muted-foreground">{current.date}</p>
		<h4 class="mt-2 font-medium">{current.title}</h4>
		<p class="mt-2 min-h-15 text-sm leading-relaxed text-muted-foreground">{current.detail}</p>
	</div>
	<div class="flex items-center justify-between gap-3">
		<span class="text-xs text-muted-foreground">Preview each stage</span>
		<div class="flex gap-2">
			<Button size="sm" variant="outline" disabled={activeStep === 0} onclick={() => activeStep--}
				>Previous</Button
			><Button size="sm" disabled={activeStep === stages.length - 1} onclick={() => activeStep++}
				>Next</Button
			>
		</div>
	</div>
</div>
