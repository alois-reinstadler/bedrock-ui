<script lang="ts">
	import { Text } from '#lib/bedrock/ui/text';
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<Text type="display-1" as="div">Display one</Text>
		<Text type="display-2" as="div">Display two</Text>
		<Text type="display-3" as="div">Quarterly revenue</Text>
	</div>
	<div class="space-y-2">
		<Text as="p" type="large">Large text introduces a section or important idea.</Text>
		<Text as="p">Body text carries the primary reading experience.</Text>
		<Text as="p" type="label">Label text names controls and compact data.</Text>
		<Text as="p" type="supporting">Supporting text provides helpful secondary context.</Text>
		<Text as="span" type="code">pnpm check</Text>
	</div>
</div>
