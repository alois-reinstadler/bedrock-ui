<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<span class={['inline-flex items-center gap-2 font-medium tracking-tight', className]}>
	<svg aria-hidden="true" viewBox="0 0 24 24" class="size-[1.15em] shrink-0" fill="currentColor">
		<rect x="3" y="14" width="14" height="7" rx="1.25" class="opacity-90" />
		<rect x="7" y="8" width="14" height="7" rx="1.25" class="opacity-70" />
		<rect x="5" y="3" width="12" height="6" rx="1.25" class="opacity-45" />
	</svg>
	Bedrock
</span>
