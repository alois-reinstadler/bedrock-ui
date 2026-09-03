<script lang="ts">
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';

	const image =
		'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"%3E%3Crect width="160" height="120" fill="%23cbd5e1"/%3E%3Ccircle cx="52" cy="48" r="20" fill="%236366f1"/%3E%3Cpath d="M0 100 60 60l40 30 30-20 30 30v20H0z" fill="%2394a3b8"/%3E%3C/svg%3E';
</script>

<div class="flex items-center gap-3">
	<Thumbnail src={image} alt="Site photo" size="lg" />
	<Thumbnail src={image} alt="Site photo" />
	<Thumbnail src={image} alt="Site photo" size="sm" shape="square" />
	<Thumbnail alt="Missing file" />
</div>
