<script lang="ts">
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
</script>

<div class="grid max-w-sm gap-2">
	<Label for="preview-site-name">Site name</Label>
	<Input id="preview-site-name" placeholder="Rannoch Cut" />
	<Input disabled aria-label="Unavailable field" value="Locked collar" />
</div>
