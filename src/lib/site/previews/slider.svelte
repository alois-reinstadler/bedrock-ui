<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Slider } from '#lib/bedrock/ui/slider';

	let value = $state(47);
</script>

<div class="grid max-w-sm gap-2">
	<Label>Depth {value}m</Label>
	<Slider type="single" {value} onValueChange={(next) => (value = next)} min={8} max={92} />
</div>

<div class="mt-4 grid max-w-sm gap-2">
	<Label>Disabled slider</Label><Slider type="single" value={30} disabled />
</div>
