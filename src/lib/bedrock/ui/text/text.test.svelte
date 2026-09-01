<script lang="ts">
	import Text from './text.svelte';
</script>

<Text data-testid="default">Default body</Text>
<Text data-testid="paragraph" as="p">Paragraph</Text>
<Text data-testid="division" as="div">Division</Text>
<Text data-testid="label-element" as="label" for="field">Label</Text>

<Text data-testid="body" type="body">Body</Text>
<Text data-testid="large" type="large">Large</Text>
<Text data-testid="label" type="label">Label type</Text>
<Text data-testid="supporting" type="supporting">Supporting</Text>
<Text data-testid="code" type="code">Code</Text>
<Text data-testid="display-1" type="display-1">Display one</Text>
<Text data-testid="display-2" type="display-2">Display two</Text>
<Text data-testid="display-3" type="display-3">Display three</Text>

<Text data-testid="muted" color="muted">Muted</Text>
<Text data-testid="accent" color="accent">Accent</Text>
<Text data-testid="destructive" color="destructive">Destructive</Text>
<Text data-testid="inherit" color="inherit">Inherited</Text>
<Text data-testid="supporting-accent" type="supporting" color="accent">Explicit accent</Text>
<Text data-testid="truncate" truncate>Truncated</Text>
<Text data-testid="clamp" truncate maxLines={3}>Clamped</Text>
