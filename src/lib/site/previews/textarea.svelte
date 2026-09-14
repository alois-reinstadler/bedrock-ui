<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
</script>

<div class="grid max-w-md gap-2">
	<Label for="preview-notes">Night notes</Label>
	<Textarea id="preview-notes" placeholder="Face condition, pump status, crew changes." />
</div>

<div class="mt-4 grid max-w-md gap-2">
	<Label for="preview-notes-disabled">Read-only record</Label><Textarea
		id="preview-notes-disabled"
		disabled
		value="This record is locked."
	/>
</div>
