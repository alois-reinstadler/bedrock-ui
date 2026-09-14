<script lang="ts">
	import * as Command from '#lib/bedrock/ui/command';
	let result = $state('No action selected.');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Workspace action finder</h3>
		<p class="text-sm text-muted-foreground">
			Filtering narrows real actions; selecting a result updates the local workspace activity.
		</p>
	</header>
	<Command.Root class="rounded-xl border shadow-sm"
		><Command.Input placeholder="Find a workspace action…" /><Command.List
			><Command.Empty>No matching action. Try “note” or “report”.</Command.Empty><Command.Group
				heading="Create"
				><Command.Item
					value="create research note"
					onSelect={() => (result = 'A blank research note was created in this demo.')}
					>Create research note</Command.Item
				><Command.Item
					value="create review checklist"
					onSelect={() => (result = 'A review checklist was added to the project.')}
					>Create review checklist</Command.Item
				></Command.Group
			><Command.Separator /><Command.Group heading="Reports"
				><Command.Item
					value="prepare activity report"
					onSelect={() => (result = 'The local activity report is ready for review.')}
					>Prepare activity report</Command.Item
				></Command.Group
			></Command.List
		></Command.Root
	>
	<p role="status" class="text-sm">{result}</p>
</section>
