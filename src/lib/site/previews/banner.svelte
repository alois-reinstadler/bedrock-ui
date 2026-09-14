<script lang="ts">
	import * as Banner from '#lib/bedrock/ui/banner';
</script>

<div class="space-y-3">
	<Banner.Root
		><Banner.Content>Information · Maintenance begins Saturday.</Banner.Content></Banner.Root
	><Banner.Root variant="success"
		><Banner.Content>Success · Your changes are saved.</Banner.Content></Banner.Root
	><Banner.Root variant="warning"
		><Banner.Content>Warning · Your session ends soon.</Banner.Content></Banner.Root
	><Banner.Root variant="destructive"
		><Banner.Content>Error · Changes could not be saved.</Banner.Content></Banner.Root
	>
</div>
