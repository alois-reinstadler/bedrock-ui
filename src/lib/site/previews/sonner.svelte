<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { toast } from 'svelte-sonner';
</script>

<Button
	variant="outline"
	onclick={() => toast('Sample 08 sealed', { description: 'Written to the night log at 04:18.' })}
>
	Show toast
</Button>
