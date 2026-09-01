<script lang="ts">
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
</script>

<div class="grid max-w-sm gap-3">
	<FieldStatus status="info" message="Use the identifier printed on the sample crate." />
	<FieldStatus status="success" message="The identifier is available." />
	<FieldStatus status="warning" message="This sample will expire soon." variant="detached" />
	<FieldStatus status="error" message="Enter a valid sample identifier." />
</div>
