<script lang="ts">
	import { Heading } from '#lib/bedrock/ui/heading';
</script>

<div class="space-y-4">
	<Heading level={1}>Heading level one</Heading>
	<Heading level={2}>Heading level two</Heading>
	<Heading level={3}>Heading level three</Heading>
	<Heading level={4}>Heading level four</Heading>
	<Heading level={5}>Heading level five</Heading>
	<Heading level={6}>Heading level six</Heading>
	<Heading level={2} visual="display-2">A visually expressive section</Heading>
	<Heading level={3} accessibilityLevel={2} visual={4}>
		A level-two concept rendered as a smaller heading
	</Heading>
</div>
