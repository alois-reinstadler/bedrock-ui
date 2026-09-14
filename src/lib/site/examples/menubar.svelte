<script lang="ts">
	import * as Menubar from '#lib/bedrock/ui/menubar';

	let documentName = $state('Launch announcement');
	let compact = $state(false);
	let totals = $state(true);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Draft editor commands</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Menus organize document actions; view options change the editor without modifying its content.
		</p>
	</header>

	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item onSelect={() => (documentName = 'Untitled draft')}>New draft</Menubar.Item>
				<Menubar.Item onSelect={() => (documentName = 'Imported sample notes')}
					>Import sample notes</Menubar.Item
				>
				<Menubar.Separator />
				<Menubar.Item disabled>Print (unavailable in demo)</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>View</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.CheckboxItem checked={totals} onCheckedChange={(value) => (totals = value)}
					>Show word count</Menubar.CheckboxItem
				>
				<Menubar.CheckboxItem checked={compact} onCheckedChange={(value) => (compact = value)}
					>Compact spacing</Menubar.CheckboxItem
				>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
	<article class="rounded-lg border" class:p-3={compact} class:p-6={!compact}>
		<h4 class="font-medium">{documentName}</h4>
		<p class="mt-3 text-sm leading-relaxed">
			We are opening the new workspace to our first pilot teams. Your feedback will help us make
			everyday collaboration clearer.
		</p>
		{#if totals}<p class="mt-4 text-xs text-muted-foreground">23 words</p>{/if}
	</article>
</section>
