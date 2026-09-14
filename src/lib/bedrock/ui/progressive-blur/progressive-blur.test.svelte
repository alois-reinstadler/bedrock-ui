<script lang="ts">
	import { ProgressiveBlur } from './index.js';
	import * as ScrollArea from '../scroll-area/index.js';
</script>

<div data-testid="standalone" class="relative h-24 w-40">
	<ProgressiveBlur
		orientation="horizontal"
		edge="start"
		size="3rem"
		strength={20}
		visible={false}
	/>
</div>

<ScrollArea.Root
	data-testid="scroll-area"
	class="h-24 w-40"
	style="height: 96px; width: 160px"
	orientation="both"
	edgeBlur="both"
>
	<div style="height: 384px; width: 480px">Scrollable content</div>
</ScrollArea.Root>
