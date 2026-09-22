<script lang="ts">
	let { src }: { src: string } = $props();
	let loaded = $state('');
	function observe(image: HTMLImageElement) {
		const captured = src;
		const ready = () => {
			if (image.naturalWidth) loaded = captured;
		};
		if (image.complete) ready();
		image.addEventListener('load', ready);
		return () => image.removeEventListener('load', ready);
	}
</script>

<img
	{@attach observe}
	{src}
	alt=""
	width="1600"
	height="900"
	data-loading={loaded !== src || undefined}
/>
