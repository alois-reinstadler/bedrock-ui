<script lang="ts">
	import * as Tabs from '#lib/bedrock/ui/tabs';

	const orientations = ['horizontal', 'vertical'] as const;
	const variants = ['default', 'line'] as const;
</script>

<div class="grid w-full gap-8 sm:grid-cols-2">
	{#each orientations as orientation (orientation)}
		{#each variants as variant (variant)}
			<div class="min-w-0 space-y-3" data-tab-example="{variant}-{orientation}">
				<p class="text-xs font-medium text-muted-foreground capitalize">
					{variant} · {orientation}
				</p>
				<Tabs.Root value="plan" {orientation}>
					<Tabs.List {variant} aria-label="{variant} {orientation} example">
						<Tabs.Trigger value="plan">Plan</Tabs.Trigger>
						<Tabs.Trigger value="log">Activity log</Tabs.Trigger>
						<Tabs.Trigger value="crew">Crew</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="plan" class="text-sm text-muted-foreground">
						Map the 47m mark before the second blast.
					</Tabs.Content>
					<Tabs.Content value="log" class="text-sm text-muted-foreground">
						02:14 hold. 03:02 pumps on. 04:18 face clear.
					</Tabs.Content>
					<Tabs.Content value="crew" class="text-sm text-muted-foreground">
						Mira Voss on night lead. Kenji Hale on pumps.
					</Tabs.Content>
				</Tabs.Root>
			</div>
		{/each}
	{/each}
</div>
