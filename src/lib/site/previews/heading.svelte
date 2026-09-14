<script lang="ts">
	import { Heading } from '#lib/bedrock/ui/heading';
</script>

<div class="space-y-4">
	<Heading level={3} visual={1}>Large title scale</Heading>
	<Heading level={3} visual={2}>Page title scale</Heading>
	<Heading level={3} visual={3}>Section title scale</Heading>
	<Heading level={3} visual={4}>Subsection title scale</Heading>
	<Heading level={3} visual="display-2">Expressive display scale</Heading>
	<p class="text-sm text-muted-foreground">
		These samples share a semantic level within this page; visual sizing is independent.
	</p>
</div>
