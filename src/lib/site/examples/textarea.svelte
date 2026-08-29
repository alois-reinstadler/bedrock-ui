<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
</script>

<div class="grid max-w-md gap-2">
	<Label for="notes">Night notes</Label>
	<Textarea id="notes" placeholder="Face condition, pump status, crew changes." />
</div>
