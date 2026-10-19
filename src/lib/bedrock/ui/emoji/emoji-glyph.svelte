<script lang="ts">
	import { appleEmojiSource } from './source';
	let { value }: { value: string } = $props();
	const url = $derived(appleEmojiSource(value));
	const request = $derived({ url, value });
	let settled = $state.raw<{ request: typeof request; status: 'loaded' | 'error' }>();
	const status = $derived(
		!url ? 'native' : settled?.request === request ? settled.status : 'loading'
	);
	const showImage = $derived(Boolean(url) && status !== 'error');

	function observeImage() {
		const current = request;
		if (!current.url) return;
		// Probe loading without placing an image in the DOM, selection or clipboard.
		const image = new Image();
		let cancelled = false;
		image.onload = () => {
			if (!cancelled) settled = { request: current, status: 'loaded' };
		};
		image.onerror = () => {
			if (!cancelled) settled = { request: current, status: 'error' };
		};
		image.src = current.url;
		return () => {
			cancelled = true;
			image.onload = null;
			image.onerror = null;
		};
	}
</script>

<span
	class="glyph"
	data-renderer={showImage ? 'image' : 'native'}
	data-state={status}
	style:--emoji-image={showImage ? `url("${url}")` : undefined}
	{@attach observeImage}>{value}</span
>

<style>
	.glyph {
		position: relative;
		display: inline-block;
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		line-height: 1;
		white-space: nowrap;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', emoji, sans-serif;
	}

	/* Keep the real selectable text and its selection highlight; only hide its ink. */
	.glyph[data-renderer='image'],
	.glyph[data-renderer='image']::selection {
		color: transparent;
		-webkit-text-fill-color: transparent;
	}

	.glyph[data-renderer='image']::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--emoji-image) center / contain no-repeat;
		/* Painted artwork has no image node or drag target; selection hits real text. */
		pointer-events: none;
		-webkit-user-select: none;
		user-select: none;
	}
</style>
