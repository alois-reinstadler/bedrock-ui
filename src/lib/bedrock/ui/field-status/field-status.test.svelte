<script lang="ts">
	import FieldStatus from './field-status.svelte';
</script>

<FieldStatus status="error" message="The value is invalid." id="field-error" />
<FieldStatus status="success" message="The value is available." hideIcon />
<FieldStatus status="info" />
