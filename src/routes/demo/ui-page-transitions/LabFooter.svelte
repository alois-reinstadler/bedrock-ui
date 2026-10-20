<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
</script>

<footer class="lab-footer">
	<div>
		<span class="footer-label">Prinzipien</span>
		{#each ['Absicht vor Effekt', 'Kontinuität vor Spektakel', 'Reduzierte Bewegung respektieren'] as principle (principle)}
			<span class="principle"><CheckIcon class="size-3" /> {principle}</span>
		{/each}
	</div>
	<p>Same-document View Transitions / CSS / Svelte 5</p>
</footer>

<style>
	.lab-footer {
		width: min(100%, 92rem);
		margin-inline: auto;
	}
	.lab-footer {
		font-size: 0.64rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.lab-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid rgb(30 30 27 / 15%);
		color: #77746d;
	}
	.lab-footer > div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.footer-label {
		padding: 0.43rem 0;
	}
	.principle {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.6rem;
		border: 1px solid rgb(30 30 27 / 13%);
		border-radius: 999px;
		background: rgb(255 255 255 / 35%);
		letter-spacing: 0.03em;
		text-transform: none;
	}

	@media (max-width: 640px) {
		.lab-footer,
		.lab-footer > div {
			align-items: start;
			flex-direction: column;
		}
	}
</style>
