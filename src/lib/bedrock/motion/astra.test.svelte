<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { CssButton, CssPanel } from './css.js';

	let {
		disabled = false,
		href,
		onactivate = () => {},
		onpointer = () => {},
		onattach = () => {},
		ondetach = () => {}
	}: {
		disabled?: boolean;
		href?: string;
		onactivate?: () => void;
		onpointer?: () => void;
		onattach?: (node: Element) => void;
		ondetach?: () => void;
	} = $props();
	let button = $state<HTMLButtonElement | HTMLAnchorElement | null>(null);
	let panel = $state<HTMLDivElement | null>(null);
	const consumerAttachment: Attachment = (node) => {
		onattach(node);
		return () => ondetach();
	};
	export function getRefs() {
		return [button, panel];
	}
</script>

<CssButton
	bind:ref={button}
	data-testid="astra-button"
	{disabled}
	{href}
	class="consumer-button"
	style="color: rgb(12, 34, 56); --consumer-token: 7"
	onclick={onactivate}
	onpointerenter={onpointer}
	{@attach consumerAttachment}
	motion={{
		initial: false,
		animate: { scale: 1 },
		whileHover: { scale: 1.05 },
		transition: { duration: 0.01 }
	}}>Consumer action</CssButton
>
<CssPanel
	bind:ref={panel}
	data-testid="astra-panel"
	class="consumer-panel"
	style="padding: 13px; --consumer-token: 9"
	{@attach consumerAttachment}
	motion={{
		initial: { opacity: 0.4, y: 12 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.01 }
	}}>Server-rendered panel content</CssPanel
>
