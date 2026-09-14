<script lang="ts">
	import { Motion } from './index.js';
	let visible = $state(true);
	let label = $state<HTMLElement | null>(null);
	export function getRef() {
		return label;
	}
</script>

<button onclick={() => (visible = !visible)}>Toggle native label</button>
{#if visible}
	<Motion
		as="span"
		bind:ref={label}
		data-testid="native-label"
		style="color: rgb(12, 34, 56)"
		motion={{
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: 0.12 }
		}}
	>
		Native CSS label
	</Motion>
{/if}
<Motion
	as="input"
	aria-label="Native motion input"
	value="Read me"
	readonly
	motion={{ initial: false }}
/>
