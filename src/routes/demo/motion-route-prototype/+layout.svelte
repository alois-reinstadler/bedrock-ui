<script lang="ts">
	import { page } from '$app/state';
	import { installRoutePrototype } from '#lib/site/motion-route-prototype/coordinator.js';
	import { Button } from '#lib/bedrock/ui/button';

	let { children } = $props();
	let reduced = $state(false);
	let slow = $state(false);
	let events = $state<string[]>([]);
	let dialog: HTMLDialogElement;
	const coordinator = installRoutePrototype({
		getReduced: () => reduced,
		getSlow: () => slow,
		identity: (from, to) => {
			const prefix = '/demo/motion-route-prototype/';
			if (!from?.pathname.startsWith(prefix) || !to?.pathname.startsWith(prefix)) return;
			return (
				/\/detail\/([^/]+)$/.exec(to.pathname)?.[1] ?? /\/detail\/([^/]+)$/.exec(from.pathname)?.[1]
			);
		},
		onEvent: (event) => {
			events = [...events.slice(-159), JSON.stringify(event)];
		}
	});
</script>

<svelte:head><title>Route motion evaluation — Bedrock</title></svelte:head>

<header class="prototype-toolbar">
	<a href="/demo/motion-route-prototype/list">Collection</a>
	<nav aria-label="Prototype navigation">
		<a href="/demo/motion-route-prototype/detail/a">Open A</a>
		<a href="/demo/motion-route-prototype/detail/b">Open B</a>
		<Button variant="outline" size="sm" onclick={() => history.back()}>Browser back</Button>
		<Button variant="outline" size="sm" onclick={() => history.forward()}>Browser forward</Button>
	</nav>
	<label><input type="checkbox" bind:checked={slow} /> Slow inspection</label>
	<label
		><input type="checkbox" bind:checked={reduced} onchange={() => coordinator.settle()} /> Reduce motion</label
	>
	<Button variant="outline" size="sm" onclick={() => dialog.showModal()}>Open modal</Button>
</header>
<dialog
	{@attach (node) => {
		dialog = node;
	}}
	class="prototype-dialog"
>
	<h2>Modal above the moving scene</h2>
	<p>Route motion continues behind this top-layer dialog.</p>
	<Button onclick={() => dialog.close()}>Close modal</Button>
</dialog>
<main class="prototype-main" data-route-scope="stories" data-motion-reduced={reduced || undefined}>
	<p class="prototype-kicker">Route continuity evaluation · scroll and interrupt freely</p>
	{@render children()}
	<details class="prototype-events">
		<summary>Evaluation events — {page.url.pathname}</summary>
		<pre data-prototype-events>{events.join('\n')}</pre>
	</details>
</main>

<style>
	.prototype-toolbar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		padding: 1rem 2rem;
		border-bottom: 1px solid #ddd;
		background: #fff;
		color: #182027;
	}
	.prototype-toolbar nav {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.prototype-toolbar a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.prototype-toolbar label {
		display: flex;
		gap: 0.4rem;
		align-items: center;
		font-size: 0.8rem;
	}
	.prototype-main {
		max-width: 1100px;
		margin: auto;
		padding: 2rem;
	}
	.prototype-kicker {
		color: #697078;
		font-size: 0.8rem;
		margin-bottom: 2rem;
	}
	.prototype-events {
		margin-top: 3rem;
		border-top: 1px solid #ddd;
		padding-top: 1rem;
	}
	.prototype-events pre {
		overflow: auto;
		max-height: 250px;
		font-size: 11px;
	}
	.prototype-dialog {
		margin: auto;
		padding: 2rem;
		max-width: 26rem;
		border-radius: 16px;
		background: white;
		color: #182027;
	}
	.prototype-dialog::backdrop {
		background: rgb(0 0 0 / 35%);
	}
	.prototype-dialog p {
		margin: 1rem 0;
	}
	:global(.prototype-card) {
		position: relative;
		isolation: isolate;
		color: #182027;
	}
	:global(.prototype-surface) {
		position: absolute;
		inset: 0;
		border: 1px solid #d7d4d0;
		border-radius: 22px;
		z-index: -1;
	}
	:global(.prototype-image) {
		overflow: hidden;
		border-radius: 16px;
	}
	:global(.prototype-image img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 35%;
		transition: opacity 140ms cubic-bezier(0.2, 0, 0, 1);
	}
	:global(.prototype-image img[data-loading]) {
		opacity: 0;
	}
	:global(.prototype-image) {
		background: #c7c4be;
	}
	:global([data-motion-reduced] .prototype-image img) {
		transition: none;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.prototype-image img) {
			transition: none;
		}
	}
	:global(.prototype-title) {
		font-weight: 600;
		letter-spacing: -0.035em;
		margin: 0;
	}
	@media (max-width: 600px) {
		.prototype-toolbar {
			padding: 0.75rem;
			gap: 0.65rem;
		}
		.prototype-toolbar nav {
			gap: 0.6rem;
			flex-wrap: wrap;
		}
		.prototype-main {
			padding: 1rem;
		}
	}
</style>
