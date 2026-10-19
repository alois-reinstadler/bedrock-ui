<script lang="ts">
	import { Emoji } from '#lib/bedrock/ui/emoji';
</script>

<div class="flex flex-wrap items-center justify-center gap-5">
	{#each ['😊', '❤️', '🔥', '🎉', '👩🏽‍💻', '🇦🇹'] as value (value)}
		<Emoji {value} size={40} />
	{/each}
</div>
