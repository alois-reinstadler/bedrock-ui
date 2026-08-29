<script lang="ts">
	import * as Field from '#lib/bedrock/ui/field';
	import { Input } from '#lib/bedrock/ui/input';
</script>

<Field.Field class="max-w-sm">
	<Field.Label for="collar">Collar id</Field.Label>
	<Input id="collar" placeholder="RC-08" />
	<Field.Description>Used in the night log and the sample crate label.</Field.Description>
</Field.Field>
