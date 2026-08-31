<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import type { RunTransition } from './types';

	let { runTransition }: { runTransition: RunTransition } = $props();

	let complete = $state(false);

	function confirm() {
		runTransition('commit', () => (complete = true));
	}

	function reset() {
		runTransition('reset', () => (complete = false));
	}
</script>

<section class="transition-stage checkout" class:complete aria-label="Kaufabschluss-Beispiel">
	{#if complete}
		<div class="success-page">
			<div class="success-orbit" aria-hidden="true"><span></span></div>
			<div class="success-copy">
				<div class="success-check"><CheckIcon class="size-5" strokeWidth={2.5} /></div>
				<p>Bestellung #BR-2048</p>
				<h3>Ist unterwegs.</h3>
				<span>Wir haben alles. Ab jetzt übernehmen wir.</span>
			</div>
			<div class="success-footer">
				<div><small>Voraussichtliche Zustellung</small><strong>02.–04. September</strong></div>
				<button type="button" onclick={reset}><RotateCcwIcon class="size-4" /> Noch einmal</button>
			</div>
		</div>
	{:else}
		<div class="checkout-page">
			<header class="checkout-header">
				<div class="checkout-brand">Form / 04</div>
				<div class="secure"><ShieldCheckIcon class="size-4" /> Sicher bezahlen</div>
			</header>

			<div class="checkout-grid">
				<div class="product-visual">
					<div class="lamp">
						<span class="lamp-shade"></span>
						<span class="lamp-stem"></span>
						<span class="lamp-base"></span>
					</div>
					<span class="edition">Edition 08 / 100</span>
				</div>

				<div class="order-copy">
					<p class="order-kicker">Ihre Auswahl</p>
					<h3>Leuchte<br />No. 04</h3>
					<div class="order-line"><span>Ausführung</span><strong>Graphit / Messing</strong></div>
					<div class="order-line"><span>Versand</span><strong>Klimaneutral</strong></div>
					<div class="order-total"><span>Gesamt</span><strong>€ 480,00</strong></div>
					<button type="button" class="confirm-button" onclick={confirm}>
						<span>Zahlung bestätigen</span>
						<ArrowRightIcon class="size-4" />
					</button>
					<p class="order-note">Mit der Bestätigung wird die Bestellung verbindlich aufgegeben.</p>
				</div>
			</div>
		</div>
	{/if}
</section>

<style>
	.checkout {
		min-height: 34rem;
		background: #efece6;
		color: #211f1b;
	}

	.checkout-page,
	.success-page {
		min-height: 34rem;
		padding: clamp(1.2rem, 3vw, 2.25rem);
	}

	.checkout-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1rem;
		border-bottom: 1px solid #d2cdc3;
	}

	.checkout-brand,
	.secure,
	.order-kicker,
	.order-line,
	.order-total,
	.order-note,
	.edition,
	.success-copy p,
	.success-footer small {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.secure {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: #78736a;
	}

	.checkout-grid {
		display: grid;
		grid-template-columns: minmax(15rem, 1.15fr) minmax(15rem, 0.85fr);
		gap: clamp(1.5rem, 5vw, 5rem);
		align-items: center;
		min-height: 28rem;
	}

	.product-visual {
		position: relative;
		display: grid;
		min-height: 24rem;
		place-items: center;
		overflow: hidden;
		border-radius: 50% 50% 1rem 1rem;
		background: #d7d0c4;
	}

	.product-visual::before {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 48%, rgb(255 244 206 / 60%), transparent 35%);
		content: '';
	}

	.lamp {
		position: relative;
		width: 13rem;
		height: 17rem;
		filter: drop-shadow(1rem 1.8rem 1.2rem rgb(40 33 24 / 20%));
	}

	.lamp-shade,
	.lamp-stem,
	.lamp-base {
		position: absolute;
		display: block;
		left: 50%;
		transform: translateX(-50%);
	}

	.lamp-shade {
		top: 1rem;
		width: 12rem;
		height: 7.4rem;
		border-radius: 50% 50% 42% 42% / 18% 18% 12% 12%;
		background: linear-gradient(90deg, #38352f, #696259 48%, #292824);
		clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
	}

	.lamp-stem {
		top: 7.5rem;
		width: 0.52rem;
		height: 7.3rem;
		background: linear-gradient(90deg, #997c42, #e3c880, #8c6e35);
	}

	.lamp-base {
		bottom: 1rem;
		width: 6.3rem;
		height: 1.25rem;
		border-radius: 50%;
		background: linear-gradient(90deg, #39362f, #6d665c, #2c2a26);
	}

	.edition {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		color: #6f695f;
	}

	.order-copy h3 {
		margin: 0.55rem 0 1.65rem;
		font-size: clamp(3rem, 7vw, 6rem);
		font-weight: 500;
		line-height: 0.79;
		letter-spacing: -0.075em;
	}

	.order-line,
	.order-total {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 0;
		border-top: 1px solid #d2cdc3;
	}

	.order-line strong,
	.order-total strong {
		font-weight: 650;
		color: #34312c;
	}

	.order-total {
		margin-top: 0.7rem;
		font-size: 0.72rem;
	}

	.confirm-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 1.1rem;
		padding: 0.9rem 1rem;
		border-radius: 999px;
		background: #24231f;
		font-size: 0.72rem;
		font-weight: 650;
		color: white;
		transition: transform 200ms ease;
	}

	.confirm-button:hover {
		transform: translateY(-2px);
	}

	.order-note {
		margin-top: 0.65rem;
		line-height: 1.5;
		letter-spacing: 0.04em;
		text-transform: none;
		color: #8a847a;
	}

	.success-page {
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		overflow: hidden;
		background: #d9ff73;
	}

	.success-orbit {
		position: absolute;
		top: 50%;
		left: 55%;
		width: min(48vw, 26rem);
		aspect-ratio: 1;
		border: 1px solid rgb(33 31 27 / 25%);
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.success-orbit::before,
	.success-orbit::after,
	.success-orbit span {
		position: absolute;
		inset: 18%;
		border: 1px solid rgb(33 31 27 / 20%);
		border-radius: 50%;
		content: '';
	}

	.success-orbit::after {
		inset: 36%;
	}
	.success-orbit span {
		inset: -28%;
	}

	.success-copy,
	.success-footer {
		position: relative;
		z-index: 1;
	}

	.success-check {
		display: grid;
		width: 3rem;
		aspect-ratio: 1;
		place-items: center;
		margin-bottom: 1rem;
		border-radius: 50%;
		background: #211f1b;
		color: #d9ff73;
	}

	.success-copy h3 {
		max-width: 8ch;
		margin-top: 0.8rem;
		font-size: clamp(4rem, 10vw, 8.5rem);
		font-weight: 500;
		line-height: 0.78;
		letter-spacing: -0.08em;
	}

	.success-copy > span {
		display: block;
		margin-top: 1.2rem;
		font-size: 0.84rem;
		color: rgb(33 31 27 / 65%);
	}

	.success-footer {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
	}

	.success-footer div {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.success-footer strong {
		font-size: 0.9rem;
	}

	.success-footer button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid rgb(33 31 27 / 30%);
		border-radius: 999px;
		font-size: 0.68rem;
		font-weight: 650;
	}

	@media (max-width: 640px) {
		.checkout,
		.checkout-page,
		.success-page {
			min-height: 40rem;
		}

		.checkout-grid {
			grid-template-columns: 1fr;
			gap: 1.2rem;
			padding-top: 1.2rem;
		}

		.product-visual {
			min-height: 15rem;
		}

		.lamp {
			transform: scale(0.7);
		}

		.order-copy h3 {
			font-size: 3.4rem;
		}
	}
</style>
