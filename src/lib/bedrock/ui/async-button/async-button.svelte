<script lang="ts" module>
	const defaultLabels = {
		pending: 'Working…',
		success: 'Done',
		error: 'Failed'
	};

	export type AsyncButtonLabels = Partial<typeof defaultLabels>;

	export type AsyncButtonState = 'idle' | 'pending' | 'success' | 'error';
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Swap, autoSize, motionPresets } from '#lib/bedrock/motion/index.js';
	import { Button, type ButtonProps } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		action,
		labels: labelOverrides,
		pendingLabel,
		successLabel,
		errorLabel,
		resetAfter = 1600,
		swapEffect = 'slide-up',
		interruptible = false,
		onError,
		disabled = false,
		children,
		...restProps
	}: Omit<ButtonProps, 'onclick' | 'href' | 'type'> & {
		/** Invoked on click. The button shows `pending` until it settles. */
		action: () => Promise<void>;
		labels?: AsyncButtonLabels;
		/** Shorthand overrides for the corresponding `labels` entries. */
		pendingLabel?: string;
		successLabel?: string;
		errorLabel?: string;
		/** Milliseconds the success/error result stays before returning to idle.
		 * State timing, not animation timing — deliberately not a motion token. */
		resetAfter?: number;
		/** Label transition. `slide-up` (the /demo/ui polish) rolls the
		 * single-line content and keeps both copies crisp; `fade` crossfades,
		 * which momentarily overlays both labels. */
		swapEffect?: 'fade' | 'slide-up';
		/** By default only idle clicks invoke `action` (pending, success, and
		 * error states ignore clicks until the button resets). When `true` the
		 * button stays interactive in every state and each click calls `action`
		 * again immediately; the newest run wins the displayed result. */
		interruptible?: boolean;
		/** Called with the rejection reason when `action` rejects. The
		 * rejection itself is swallowed after the button enters `error`. */
		onError?: (error: unknown) => void;
	} = $props();

	let state = $state<AsyncButtonState>('idle');
	let run = 0;
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const text = $derived({
		pending: pendingLabel ?? labels.pending,
		success: successLabel ?? labels.success,
		error: errorLabel ?? labels.error
	});
	const locked = $derived(!interruptible && state !== 'idle');
	const statusMessage = $derived(state === 'idle' ? '' : text[state]);
	const statusId = $props.id();

	// Same shell pattern as AvatarStack's hover card: autoSize animates the
	// label area between intrinsic sizes while Swap crossfades the content.
	const shell = autoSize({ duration: motionPresets.swap.duration, axis: 'both' });

	async function invoke() {
		clearTimeout(resetTimer);
		const id = ++run;
		state = 'pending';
		try {
			await action();
			if (id !== run) return;
			state = 'success';
		} catch (error) {
			onError?.(error);
			if (id !== run) return;
			state = 'error';
		}
		resetTimer = setTimeout(() => {
			state = 'idle';
		}, resetAfter);
	}

	function handleClick() {
		if (disabled || locked) return;
		void invoke();
	}

	// The Bedrock Button wrapper spreads props without re-exposing `ref` as
	// bindable, so the ref is captured through an attachment instead.
	function setRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}

	onDestroy(() => clearTimeout(resetTimer));
</script>

<!-- Not natively disabled while pending: `aria-disabled` keeps the button
     focusable so keyboard users are never dropped mid-interaction. -->
<Button
	{@attach setRef}
	data-slot="async-button"
	data-state={state}
	{disabled}
	class={cn(className)}
	aria-busy={state === 'pending' || undefined}
	aria-disabled={!disabled && locked ? true : undefined}
	aria-describedby={statusId}
	onclick={handleClick}
	{...restProps}
>
	<span {@attach shell} class="inline-flex items-center justify-center">
		<Swap key={state} effect={swapEffect} class="whitespace-nowrap">
			{#if state === 'idle'}
				{@render children?.()}
			{:else if state === 'pending'}
				<Icon icon="loading" class="animate-spin motion-reduce:animate-none" />
				{text.pending}
			{:else if state === 'success'}
				<Icon icon="success" />
				{text.success}
			{:else}
				<Icon icon="error" />
				{text.error}
			{/if}
		</Swap>
	</span>
</Button>
<span id={statusId} class="sr-only" role="status" data-slot="async-button-status">
	{statusMessage}
</span>
