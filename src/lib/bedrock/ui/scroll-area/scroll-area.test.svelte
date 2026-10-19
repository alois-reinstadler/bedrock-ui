<script lang="ts">
	import ScrollArea, { type ScrollAreaEdgeBlur } from './scroll-area.svelte';
	import '../../../../routes/layout.css';

	let {
		edgeBlur,
		orientation = 'vertical',
		wheelToHorizontal = false
	}: {
		edgeBlur?: ScrollAreaEdgeBlur;
		wheelToHorizontal?: boolean;
		orientation?: 'vertical' | 'horizontal' | 'both';
	} = $props();

	let rtl = $state(false);
	let expanded = $state(false);
</script>

<button onclick={() => (rtl = !rtl)}>Toggle direction</button>
<button onclick={() => (expanded = !expanded)}>Toggle async content</button>
<ScrollArea
	data-testid="direction"
	wheelToHorizontal
	dir={rtl ? 'rtl' : 'ltr'}
	orientation="both"
	edgeBlur="both"
	style="height: 100px; width: 160px"
>
	<div style="height: 300px; width: 480px">Wide content</div>
</ScrollArea>
<ScrollArea data-testid="async-content" edgeBlur style="height: 100px; width: 160px">
	<div style="height: 50px">
		{#if expanded}
			<div style="height: 300px">Asynchronously inserted content</div>
		{:else}
			Content fits
		{/if}
	</div>
</ScrollArea>

<ScrollArea data-testid="outer" edgeBlur="vertical" style="height: 100px; width: 160px">
	<div style="height: 400px">
		<ScrollArea data-testid="inner" edgeBlur="vertical" style="height: 60px; width: 140px">
			<div style="height: 180px"><button>Nested focus target</button></div>
		</ScrollArea>
	</div>
</ScrollArea>

<ScrollArea
	data-testid="automatic"
	{edgeBlur}
	{orientation}
	{wheelToHorizontal}
	style="height: 100px; width: 160px"
>
	<div style="height: 300px; width: 480px">Automatic blur content</div>
</ScrollArea>

<ScrollArea
	data-testid="wheel-outer"
	orientation="both"
	wheelToHorizontal
	style="height: 100px; width: 160px"
>
	<div style="height: 300px; width: 480px">
		<ScrollArea data-testid="wheel-inner" style="height: 60px; width: 140px">
			<div style="height: 180px">Nested native scroll</div>
		</ScrollArea>
	</div>
</ScrollArea>
