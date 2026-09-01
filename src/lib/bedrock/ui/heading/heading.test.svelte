<script lang="ts">
	import Heading from './heading.svelte';
</script>

<Heading data-testid="level-1" level={1}>One</Heading>
<Heading data-testid="level-2" level={2}>Two</Heading>
<Heading data-testid="level-3" level={3}>Three</Heading>
<Heading data-testid="level-4" level={4}>Four</Heading>
<Heading data-testid="level-5" level={5}>Five</Heading>
<Heading data-testid="level-6" level={6}>Six</Heading>
<Heading data-testid="display-1" level={2} visual="display-1">Display one</Heading>
<Heading data-testid="display-2" level={2} visual="display-2">Display two</Heading>
<Heading data-testid="display-3" level={2} visual="display-3">Display three</Heading>
<Heading data-testid="same-aria" level={3} accessibilityLevel={3}>Same level</Heading>
<Heading data-testid="different-aria" level={3} accessibilityLevel={2}>Different level</Heading>
<Heading data-testid="muted" level={2} color="muted">Muted</Heading>
<Heading data-testid="accent" level={2} color="accent">Accent</Heading>
<Heading data-testid="destructive" level={2} color="destructive">Destructive</Heading>
<Heading data-testid="inherit" level={2} color="inherit">Inherited</Heading>
<Heading data-testid="truncate" level={2} truncate>Truncated</Heading>
<Heading data-testid="clamp" level={2} truncate maxLines={2}>Clamped</Heading>
