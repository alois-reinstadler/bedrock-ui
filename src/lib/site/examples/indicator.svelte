<script lang="ts">
	import { CheckboxIndicator } from '#lib/bedrock/ui/indicator';
	import { Button } from '#lib/bedrock/ui/button';
	let selected = $state<string[]>(['Design']);
	const teams = ['Design', 'Engineering', 'Support'];
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Audience selection</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			An indicator reflects its owning control; it does not replace keyboard handling or pressed
			state.
		</p>
	</header>
	<fieldset class="space-y-3">
		<legend class="mb-3 text-sm font-medium">Teams receiving the launch update</legend
		>{#each teams as team (team)}<Button
				variant="outline"
				class="w-full justify-start"
				aria-pressed={selected.includes(team)}
				onclick={() =>
					(selected = selected.includes(team)
						? selected.filter((value) => value !== team)
						: [...selected, team])}
				><CheckboxIndicator
					state={selected.includes(team) ? 'checked' : 'unchecked'}
				/>{team}</Button
			>{/each}
	</fieldset>
	<p role="status" class="text-sm text-muted-foreground">
		{selected.length} teams selected. The button owns interaction; the mark is decorative.
	</p>
</section>
