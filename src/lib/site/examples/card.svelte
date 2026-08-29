<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
</script>

<Card.Root class="max-w-sm">
	<Card.Header>
		<Card.Title>Shift report</Card.Title>
		<Card.Description>East face, 02:14 to 06:40.</Card.Description>
	</Card.Header>
	<Card.Content>
		<p class="text-sm text-muted-foreground">Water ingress held at 31.8m. Crew rotated. Core sample 08 sealed.</p>
	</Card.Content>
	<Card.Footer class="justify-end gap-2">
		<Button variant="outline" size="sm">Dismiss</Button>
		<Button size="sm">File report</Button>
	</Card.Footer>
</Card.Root>
