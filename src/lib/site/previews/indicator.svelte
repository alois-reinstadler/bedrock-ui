<script lang="ts">
	import { CheckboxIndicator, CheckIndicator, RadioIndicator } from '#lib/bedrock/ui/indicator';
	import { Spinner } from '#lib/bedrock/ui/spinner';
</script>

<!-- Indicators are purely decorative: each row's text carries the name here;
     in real usage the owner control does. -->
<div class="grid gap-2 text-sm">
	<span class="flex items-center gap-2">
		<CheckboxIndicator state="unchecked" /> Unchecked
	</span>
	<span class="flex items-center gap-2">
		<CheckboxIndicator state="checked" /> Checked
	</span>
	<span class="flex items-center gap-2">
		<CheckboxIndicator state="indeterminate" /> Indeterminate
	</span>
	<span class="flex items-center gap-2">
		<CheckboxIndicator state="checked">
			<Spinner class="size-3.5" />
		</CheckboxIndicator>
		Busy (custom mark)
	</span>
	<span class="flex items-center gap-2">
		<CheckIndicator state="checked" /> Menu checkmark
	</span>
	<span class="flex items-center gap-2">
		<RadioIndicator state="unchecked" /> Radio, unchecked
	</span>
	<span class="flex items-center gap-2">
		<RadioIndicator state="checked" /> Radio, checked
	</span>
</div>
