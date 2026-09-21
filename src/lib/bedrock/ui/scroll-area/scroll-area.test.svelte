<script lang="ts">
	import ScrollArea from './scroll-area.svelte';
	import '../../../../routes/layout.css';

	let rtl = $state(false);
	let expanded = $state(false);
</script>

<button onclick={() => (rtl = !rtl)}>Toggle direction</button>
<button onclick={() => (expanded = !expanded)}>Toggle async content</button>
<ScrollArea
	data-testid="direction"
	dir={rtl ? 'rtl' : 'ltr'}
	orientation="both"
	edgeBlur="both"
	style="height: 100px; width: 160px"
>
	<div style="height: 300px; width: 480px">Wide content</div>
</ScrollArea>
<ScrollArea data-testid="async-content" edgeBlur="vertical" style="height: 100px; width: 160px">
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
