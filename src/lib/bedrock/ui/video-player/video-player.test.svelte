<script lang="ts">
	import VideoPlayer from './video-player.svelte';
</script>

<VideoPlayer
	src="/missing-fixture.mp4"
	label="Feature walkthrough"
	captions={[{ src: '/missing.vtt', srclang: 'en', label: 'English' }]}
	preload="none"
/>
