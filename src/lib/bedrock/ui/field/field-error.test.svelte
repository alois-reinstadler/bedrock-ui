<script lang="ts">
	import FieldError from './field-error.svelte';

	let { errors = [] }: { errors?: { message?: string }[] } = $props();
</script>

<div data-testid="field-stack" style="display: flex; flex-direction: column; gap: 16px">
	<div style="height: 20px">Input</div>
	<FieldError {errors} />
	<div style="height: 20px">Next field</div>
</div>
