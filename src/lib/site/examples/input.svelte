<script lang="ts">
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
</script>

<div class="grid max-w-sm gap-2">
	<Label for="site-name">Site name</Label>
	<Input id="site-name" placeholder="Rannoch Cut" />
	<Input disabled value="Locked collar" />
</div>
