<script lang="ts">
	import * as Accordion from '#lib/bedrock/ui/accordion';

	let value = $state('a');
</script>

<Accordion.Root type="single" bind:value class="max-w-md">
	<Accordion.Item value="a">
		<Accordion.Trigger>Where do the files live?</Accordion.Trigger>
		<Accordion.Content>
			Under <code class="font-mono">src/lib/bedrock</code>. App code should import from that alias only.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="b">
		<Accordion.Trigger>Can I restyle a primitive?</Accordion.Trigger>
		<Accordion.Content>
			Yes. Open the Svelte file and change it. Tokens in <code class="font-mono">layout.css</code> cover color and radius.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="c">
		<Accordion.Trigger>What about accessibility?</Accordion.Trigger>
		<Accordion.Content>
			Focus, keyboard, and ARIA behavior come from bits-ui. Keep those contracts if you restyle.
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
