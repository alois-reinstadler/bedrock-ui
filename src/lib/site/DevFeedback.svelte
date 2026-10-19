<script lang="ts">
	import { page } from '$app/state';
	import { Feedback } from '#lib/bedrock/ui/feedback';
</script>

<Feedback
	project="Bedrock UI"
	pageUrl={`${page.url.origin}${page.url.pathname}`}
	storageKey="bedrock:developer-feedback:v1"
/>
