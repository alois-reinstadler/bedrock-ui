<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import * as Empty from '#lib/bedrock/ui/empty';
	import { Button } from '#lib/bedrock/ui/button';
	let created = $state(false);
</script>

<Card.Root class="block w-full max-w-2xl gap-0 space-y-5 p-5">
	<header>
		<h3 class="text-lg font-semibold">First project onboarding</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Give an empty workspace one useful next action instead of a dead end.
		</p>
	</header>
	{#if created}<div class="rounded-lg border p-4 corner-theme">
			<h4 class="font-medium">Spring launch</h4>
			<p class="text-sm text-muted-foreground">Draft project · No tasks yet</p>
			<Button variant="ghost" class="mt-3" onclick={() => (created = false)}
				>Reset demonstration</Button
			>
		</div>{:else}<Empty.Root
			><Empty.Header
				><Empty.Title>Your workspace is ready</Empty.Title><Empty.Description
					>Create a project to give tasks, documents, and decisions a shared home.</Empty.Description
				></Empty.Header
			><Empty.Content
				><Button onclick={() => (created = true)}>Create sample project</Button></Empty.Content
			></Empty.Root
		>{/if}
	<p role="status" class="text-sm">{created ? 'Sample project created locally.' : ''}</p>
</Card.Root>
