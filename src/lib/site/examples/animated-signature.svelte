<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	import { AnimatedSignature } from '#lib/bedrock/ui/animated-signature';
	let replay = $state(0);
	const paths = [
		'M20 78 Q42 15 58 20 Q70 30 40 65 L19 65 M29 61 Q52 58 69 77 M73 75 Q86 36 91 19 Q105 -1 99 26 Q86 58 76 69 Q74 83 91 68 M92 69 Q117 46 111 64 Q102 79 92 71 Q94 91 121 68 M122 61 Q131 72 138 83 M139 60 Q129 75 119 83',
		'M18 90 Q80 79 150 89'
	];
</script>

<Card.Root class="block w-full max-w-sm gap-0 space-y-5 p-6">
	<p class="text-xs tracking-widest text-muted-foreground uppercase">Made with care</p>
	{#key replay}<AnimatedSignature
			text="Alex"
			{paths}
			viewBox="0 0 170 105"
			strokeWidth={2}
			duration={2.4}
		/>{/key}
	<div class="flex items-center justify-between">
		<p class="text-sm text-muted-foreground">Prepared SVG strokes</p>
		<Button
			variant="ghost"
			type="button"
			class={[
				'control-site-examples-animated-signature h-auto whitespace-normal',
				'rounded-md border px-3 py-1 text-sm'
			]}
			onclick={() => replay++}>Replay</Button
		>
	</div>
</Card.Root>
