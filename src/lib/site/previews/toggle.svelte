<script lang="ts">
	import { Toggle } from '#lib/bedrock/ui/toggle';
	import { Icon } from '#lib/bedrock/ui/icon';

	let pressed = $state(false);
</script>

<Toggle
	{pressed}
	onPressedChange={(next) => (pressed = next)}
	aria-label="Preview filters"
	variant="outline"
>
	<Icon icon="funnel" />
	Filters
</Toggle>
