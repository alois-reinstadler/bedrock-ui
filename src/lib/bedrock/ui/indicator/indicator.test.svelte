<script lang="ts">
	import Check from './check-indicator.svelte';
	import Checkbox from './checkbox-indicator.svelte';
	import Radio from './radio-indicator.svelte';
</script>

<div data-testid="checkbox-unchecked"><Checkbox state="unchecked" /></div>
<div data-testid="checkbox-checked"><Checkbox state="checked" /></div>
<div data-testid="checkbox-indeterminate"><Checkbox state="indeterminate" /></div>
<div data-testid="checkbox-busy">
	<Checkbox state="checked">
		<span data-testid="busy-mark">busy</span>
	</Checkbox>
</div>
<div data-testid="check-unchecked"><Check state="unchecked" /></div>
<div data-testid="check-checked"><Check state="checked" /></div>
<div data-testid="radio-unchecked"><Radio state="unchecked" /></div>
<div data-testid="radio-checked"><Radio state="checked" /></div>
