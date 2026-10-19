<script lang="ts">
	import { TextReveal, TextSwap } from 'astra-motion/text';
	import AstraPolicy from '#lib/bedrock/motion/AstraPolicy.svelte';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';

	const messages = [
		'Make room for a little motion.',
		'Keep your place while a longer message wraps naturally onto another line.',
		'Hello, 世界. A new message, in the same space.'
	];
	let selected = $state(0);
	let reduced = $state(false);
	const id = $props.id();
</script>

<MotionProvider {reduced}>
	<AstraPolicy>
		<div class="w-full max-w-xl space-y-5" data-testid="motion-text-example">
			<TextReveal
				as="h3"
				text="Make it clear."
				effect="slide"
				split="words"
				stagger={0.04}
				class="text-xl font-medium"
				data-testid="text-reveal"
			/>
			<TextSwap
				as="p"
				text={messages[selected]}
				alternatives={messages}
				size="reserve"
				mode="wait"
				effect="blur"
				split="words"
				stagger={0.02}
				class="text-muted-foreground"
				data-testid="text-swap"
			/>
			<div class="space-y-2">
				<label for={id} class="text-sm font-medium">Your note</label>
				<Input {id} placeholder="Your note stays while the words change" data-testid="text-note" />
			</div>
			<div class="flex flex-wrap gap-2">
				<Button
					variant="outline"
					onclick={() => (selected = (selected + 1) % messages.length)}
					data-testid="text-next">Next message</Button
				>
				<Button
					variant="outline"
					aria-pressed={reduced}
					onclick={() => (reduced = !reduced)}
					data-testid="text-reduce">Reduce motion</Button
				>
			</div>
		</div>
	</AstraPolicy>
</MotionProvider>
