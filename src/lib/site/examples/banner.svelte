<script lang="ts">
	import * as Banner from '#lib/bedrock/ui/banner';
	import { Button } from '#lib/bedrock/ui/button';

	let open = $state(true);
</script>

{#if open}
	<Banner.Root variant="info">
		<Banner.Content>
			Scheduled maintenance on Saturday from 22:00 UTC. Saving is briefly unavailable.
		</Banner.Content>
		<Banner.Close onclick={() => (open = false)} />
	</Banner.Root>
{:else}
	<Button variant="outline" size="sm" onclick={() => (open = true)}>Show banner again</Button>
{/if}
