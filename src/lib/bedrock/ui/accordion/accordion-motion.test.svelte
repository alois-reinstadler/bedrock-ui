<script lang="ts">
	import * as Accordion from './index.js';

	let { initial = '', forceMount = false }: { initial?: string; forceMount?: boolean } = $props();
</script>

<div style="width: 300px">
	<Accordion.Root type="single" value={initial}>
		<Accordion.Item value="details">
			<Accordion.Trigger>Details</Accordion.Trigger>
			<Accordion.Content {forceMount}>
				<div style="height: 180px">A stable panel height for frame-by-frame geometry checks.</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
	<div data-testid="following-content">Following content</div>
</div>
