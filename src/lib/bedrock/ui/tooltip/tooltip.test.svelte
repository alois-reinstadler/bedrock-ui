<script lang="ts">
	import * as Tooltip from './index';
	import { Button } from '#lib/bedrock/ui/button';
</script>

<Tooltip.Provider delayDuration={0}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}<Button {...props}>First hint</Button>{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content data-testid="first-content">First description</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>Second hint</Tooltip.Trigger>
		<Tooltip.Content id="caller-tooltip-id" data-testid="second-content">
			Second description
		</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>Custom hint</Tooltip.Trigger>
		<Tooltip.Content id="custom-tooltip-id">
			{#snippet child({ props, wrapperProps })}
				<div {...wrapperProps}>
					<div {...props} data-testid="custom-content">Custom description</div>
				</div>
			{/snippet}
		</Tooltip.Content>
	</Tooltip.Root>
	<button type="button">Outside tooltip</button>
</Tooltip.Provider>
