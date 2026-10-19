<script lang="ts">
	import { usePlayer } from './player.svelte.js';
	let { label, detail }: { label: string; detail: string } = $props();
	const player = usePlayer();
</script>

<header class="listening-heading">
	<img src={player.current.artwork} alt="" />
	<div>
		<p>{label}</p>
		<h1>{player.current.title}</h1>
		<span>{player.current.artist}</span>
	</div>
	<small>{detail}</small>
</header>

<style>
	.listening-heading {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 28px 36px;
		flex: none;
	}
	img {
		width: 60px;
		height: 60px;
		object-fit: cover;
		border-radius: 8px;
		box-shadow: 0 8px 24px #0003;
	}
	div {
		min-width: 0;
	}
	p {
		font-size: 10px;
		letter-spacing: 2px;
		text-transform: uppercase;
		opacity: 0.65;
		margin-bottom: 5px;
	}
	.listening-heading h1 {
		font-size: 23px;
		font-weight: 700;
		letter-spacing: -0.7px;
		line-height: 1.2;
	}
	span {
		display: block;
		font-size: 12px;
		opacity: 0.65;
		margin-top: 5px;
	}
	small {
		margin-left: auto;
		font-size: 11px;
		opacity: 0.65;
	}
	@media (max-width: 680px) {
		.listening-heading {
			padding: 22px 20px;
			gap: 12px;
		}
		img {
			width: 48px;
			height: 48px;
		}
		.listening-heading h1 {
			font-size: 20px;
		}
		small {
			display: none;
		}
	}
</style>
