<script lang="ts">
	import { QRCode } from '#lib/bedrock/ui/qr-code';
</script>

<div class="flex flex-wrap items-center justify-center gap-8">
	<div class="space-y-3 text-center">
		<QRCode value="https://example.com/welcome" label="Open the welcome page" />
		<p class="text-sm text-muted-foreground">Classic modules</p>
	</div>
	<div class="space-y-3 text-center">
		<QRCode
			value="https://example.com/welcome"
			label="Open the welcome page"
			modules="dots"
			finder="rounded"
			foreground="#4338ca"
		/>
		<p class="text-sm text-muted-foreground">Rounded and dotted</p>
	</div>
</div>
