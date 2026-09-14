<script lang="ts">
	import { SettingsSection } from '#lib/bedrock/blocks/settings-section/index.js';
	import { Switch } from '#lib/bedrock/ui/switch';
	let fail = $state(false);
	let updates = $state(true);
	let savedUpdates = $state(true);
	async function save() {
		await new Promise((resolve) => setTimeout(resolve, 450));
		if (fail) throw new Error('Demo failure');
		savedUpdates = updates;
	}
</script>

<SettingsSection
	title="Notifications"
	description="Changes take effect after saving."
	dirty={updates !== savedUpdates}
	onSave={save}
>
	<div class="flex items-center justify-between gap-4">
		<span class="text-sm font-medium">Product updates</span><Switch
			bind:checked={updates}
			aria-label="Product updates"
		/>
	</div>
</SettingsSection>
<div class="flex items-center justify-between gap-4 text-sm">
	<span>Simulate a server error</span><Switch
		bind:checked={fail}
		aria-label="Simulate a server error"
	/>
</div>
