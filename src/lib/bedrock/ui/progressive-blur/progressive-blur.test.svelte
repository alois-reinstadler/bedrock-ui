<script lang="ts">
	import { ProgressiveBlur } from './index.js';
	import * as ScrollArea from '../scroll-area/index.js';
</script>

<div data-testid="standalone" class="relative h-24 w-40">
	<ProgressiveBlur side="left" size="3rem" strength={20} visible={false} />
</div>

<div data-testid="legacy" class="relative h-24 w-40">
	<button type="button" data-testid="standalone-focus">Inspect surface</button>
	<ProgressiveBlur orientation="vertical" edge="start" />
</div>

<ScrollArea.Root
	data-testid="scroll-area"
	class="h-24 w-40"
	style="height: 96px; width: 160px"
	orientation="both"
	edgeBlur="both"
>
	<div style="height: 384px; width: 480px">
		<button type="button" data-testid="focus-target">Focusable content</button>
	</div>
</ScrollArea.Root>

<ScrollArea.Root
	data-testid="no-overflow"
	class="h-24 w-40"
	style="height: 96px; width: 160px"
	edgeBlur="both"
>
	<div style="height: 48px; width: 80px">Content fits</div>
</ScrollArea.Root>
