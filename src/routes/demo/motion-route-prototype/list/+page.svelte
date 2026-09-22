<script lang="ts">
	import { records } from '#lib/site/motion-route-prototype/data.js';
</script>

<h1 class="collection-heading">A small collection.<br />A continuous journey.</h1>
<p class="collection-description">
	Scroll, open a story, and return with browser back. The image, surface and title each have their
	own visual treatment.
</p>
<div class="collection-window">
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users must be able to focus and scroll this viewport.) -->
	<section
		class="collection-viewport"
		data-route-scroll="collection"
		aria-label="Scrollable collection"
		tabindex="0"
	>
		<div class="collection-sticky">Stories · independently scrollable</div>
		<div class="collection-grid">
			{#each records as record (record.id)}
				<a
					href={`/demo/motion-route-prototype/detail/${record.id}`}
					class="prototype-card collection-card"
					data-route-entity={record.id}
				>
					<div
						data-route-part="surface"
						class="prototype-surface"
						style:background-color={record.color}
					></div>
					<div data-route-part="image" class="prototype-image collection-image">
						<img src={record.image} alt="" width="1600" height="900" />
					</div>
					<h2 data-route-part="title" class="prototype-title collection-title">{record.title}</h2>
					<p>Open story →</p>
				</a>
			{/each}
		</div>
		<div class="inner-spacer" aria-hidden="true"></div>
	</section>
</div>
<div class="collection-notes" data-route-remainder>
	<h2>Try a delayed route</h2>
	<p>
		These links simulate slow route data and media readiness. The layout dimensions remain reserved.
	</p>
	<a
		href="/demo/motion-route-prototype/detail/a?delay=650&ready=650"
		data-sveltekit-preload-data="off">Open A with delayed data and media readiness</a
	>
	<a href="/demo/motion-route-prototype/detail/a?ready=1400" data-sveltekit-preload-data="off"
		>Open A beyond the readiness budget</a
	>
	<p>
		Use Slow inspection to interrupt the journey with browser back, forward or another story. Use
		Reduce motion during playback to settle immediately.
	</p>
</div>
<div class="collection-spacer" aria-hidden="true"></div>

<style>
	.collection-window {
		overflow: hidden;
		border-radius: 28px;
	}
	.collection-viewport {
		height: 480px;
		overflow: auto;
		background: #edece9;
	}
	.collection-sticky {
		position: sticky;
		top: 0;
		z-index: 20;
		padding: 12px;
		background: #e2e0db;
	}
	.inner-spacer {
		height: 320px;
	}
	.collection-grid {
		padding: 16px;
	}
	.collection-heading {
		font-size: clamp(2rem, 5vw, 4rem);
		line-height: 1.08;
		letter-spacing: -0.05em;
		margin-bottom: 1.5rem;
	}
	.collection-description {
		max-width: 600px;
		color: #697078;
		margin-bottom: 3rem;
	}
	.collection-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem;
	}
	.collection-card {
		display: block;
		padding: 1rem;
	}
	.collection-card:focus-visible {
		outline: 3px solid #3873b0;
		outline-offset: 4px;
	}
	.collection-image {
		height: 260px;
	}
	.collection-title {
		font-size: 26px;
		line-height: 1.15;
		margin-top: 1rem;
	}
	.collection-card p {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
	.collection-notes {
		margin-top: 3rem;
		max-width: 650px;
		display: grid;
		gap: 1rem;
	}
	.collection-notes a {
		text-decoration: underline;
	}
	.collection-notes h2 {
		font-size: 1.5rem;
	}
	.collection-spacer {
		height: 50vh;
	}
	@media (max-width: 600px) {
		.collection-grid {
			grid-template-columns: 1fr;
		}
		.collection-image {
			height: 230px;
		}
	}
</style>
