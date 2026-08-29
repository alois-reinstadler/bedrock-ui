<script lang="ts">
	import * as Tabs from '#lib/bedrock/ui/tabs';

	let value = $state('plan');
</script>

<Tabs.Root bind:value class="max-w-md">
	<Tabs.List>
		<Tabs.Trigger value="plan">Plan</Tabs.Trigger>
		<Tabs.Trigger value="log">Log</Tabs.Trigger>
		<Tabs.Trigger value="crew">Crew</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="plan" class="pt-3 text-sm text-muted-foreground">
		Open collar at 06:00. Map the 47m mark before the second blast.
	</Tabs.Content>
	<Tabs.Content value="log" class="pt-3 text-sm text-muted-foreground">
		02:14 hold. 03:02 pumps on. 04:18 face clear.
	</Tabs.Content>
	<Tabs.Content value="crew" class="pt-3 text-sm text-muted-foreground">
		Mira Voss on night lead. Kenji Hale on pumps.
	</Tabs.Content>
</Tabs.Root>
