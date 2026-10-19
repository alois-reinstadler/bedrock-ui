<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	import { ButtonGroup } from '#lib/bedrock/ui/button-group';
	let status = $state('Awaiting review');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Review an incoming request</h3>
		<p class="text-sm text-muted-foreground">
			Group related actions while keeping the decision result visible. A group is not a selection
			widget.
		</p>
	</header>
	<Card.Root class="block gap-0 space-y-4 p-5">
		<div>
			<p class="font-medium">Access request from Ari Lane</p>
			<p class="text-sm text-muted-foreground">
				Requests editor access to the Field journal project.
			</p>
		</div>
		<ButtonGroup
			><Button variant="outline" onclick={() => (status = 'Request approved in this demo')}
				>Approve</Button
			><Button variant="outline" onclick={() => (status = 'Request deferred until tomorrow')}
				>Review later</Button
			></ButtonGroup
		>
		<p role="status" class="text-sm">{status}</p>
	</Card.Root>
</section>
