<script lang="ts">
	import RouteImage from '#lib/site/motion-route-prototype/route-image.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let expanded = $state(false);
	let largeType = $state(false);
</script>

<div class="detail-controls">
	<button onclick={() => (expanded = !expanded)}>Toggle late content</button><button
		onclick={() => (largeType = !largeType)}>Change typography</button
	>
</div>
<div class="detail-window">
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users must be able to focus and scroll this viewport.) -->
	<section
		class="detail-viewport"
		data-route-scroll="detail"
		aria-label="Scrollable story"
		tabindex="0"
	>
		<div class="detail-sticky">Story · independently scrollable</div>
		<article class="prototype-card detail-card" data-route-entity={data.record.id}>
			<div
				data-route-part="surface"
				class="prototype-surface"
				style:background-color={data.record.color}
			></div>
			{#if expanded}<p class="late-content" data-route-remainder>
					Late content changes the destination geometry while the visual transition is running.
				</p>{/if}
			<div
				data-route-part="image"
				data-ready-delay={data.ready}
				class="prototype-image detail-image"
			>
				<RouteImage src={data.image} />
			</div>
			<h1 data-route-part="title" class="prototype-title detail-title" class:large-type={largeType}>
				{data.record.title}
			</h1>
			<div class="detail-copy" data-route-remainder>
				<p>
					The story opens into a wider frame. Its surface changes shape, the image reveals a
					different crop, and the title stays typeset at its natural size.
				</p>
				<p>
					This is a route transition evaluation, with deliberately different proportions at either
					end. Browser history remains available while the visual journey is running.
				</p>
				<button type="button" onclick={() => history.back()}>Back to previous route</button>
				<a href="/demo/motion-route-prototype/list">Go to collection</a>
			</div>
		</article>
	</section>
</div>

<style>
	.detail-window {
		overflow: hidden;
		border-radius: 32px;
	}
	.detail-viewport {
		height: 660px;
		overflow: auto;
	}
	.detail-sticky {
		position: sticky;
		top: 0;
		z-index: 20;
		background: #e2e0db;
		padding: 12px;
	}
	.detail-controls {
		display: flex;
		gap: 24px;
		margin-bottom: 16px;
	}
	.detail-controls button {
		text-decoration: underline;
	}
	.late-content {
		padding: 48px 0;
	}
	.detail-title.large-type {
		font-family: serif;
		font-size: 72px;
	}
	.detail-card {
		padding: 1.5rem;
	}
	.detail-image {
		height: 330px;
	}
	.detail-title {
		font-size: clamp(36px, 5vw, 60px);
		line-height: 1.06;
		max-width: 850px;
		margin: 2rem 0;
	}
	.detail-copy {
		max-width: 650px;
		display: grid;
		gap: 1rem;
		line-height: 1.6;
		padding-bottom: 3rem;
	}
	.detail-copy button,
	.detail-copy a {
		text-align: left;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	@media (max-width: 600px) {
		.detail-card {
			padding: 1rem;
		}
		.detail-image {
			height: 190px;
		}
	}
</style>
