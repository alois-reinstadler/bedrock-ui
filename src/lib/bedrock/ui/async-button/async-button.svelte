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
	import { Motion } from '#lib/bedrock/motion/css.js';
	import { createLayout } from '#lib/bedrock/motion/projection.js';
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

	let buttonState = $state<AsyncButtonState>('idle');
	let swapDirection = $state<'forward' | 'backward'>('forward');
	let run = 0;
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const text = $derived({
		pending: pendingLabel ?? labels.pending,
		success: successLabel ?? labels.success,
		error: errorLabel ?? labels.error
	});
	const locked = $derived(!interruptible && buttonState !== 'idle');
	const statusMessage = $derived(buttonState === 'idle' ? '' : text[buttonState]);
	const statusId = $props.id();

	// Intrinsic label dimensions need measured projection; entrances remain CSS.
	const labelLayout = createLayout({ transition: { duration: 0.18 } });
	const labelSize = labelLayout({ mode: 'size' });

	async function invoke() {
		clearTimeout(resetTimer);
		const id = ++run;
		swapDirection = 'forward';
		buttonState = 'pending';
		try {
			await action();
			if (id !== run) return;
			buttonState = 'success';
		} catch (error) {
			onError?.(error);
			if (id !== run) return;
			buttonState = 'error';
		}
		resetTimer = setTimeout(() => {
			swapDirection = 'backward';
			buttonState = 'idle';
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

	onDestroy(() => {
		run++;
		clearTimeout(resetTimer);
	});
</script>

<!-- Not natively disabled while pending: `aria-disabled` keeps the button
     focusable so keyboard users are never dropped mid-interaction. -->
<Button
	{@attach setRef}
	data-slot="async-button"
	data-state={buttonState}
	{disabled}
	class={cn(className)}
	aria-busy={buttonState === 'pending' || undefined}
	aria-disabled={!disabled && locked ? true : undefined}
	aria-describedby={statusId}
	onclick={handleClick}
	{...restProps}
>
	<span {@attach labelSize} class="inline-grid items-center justify-center overflow-hidden">
		{#key buttonState}
			<Motion
				as="span"
				class="col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap"
				motion={{
					initial: {
						opacity: 0,
						y: swapEffect === 'slide-up' ? (swapDirection === 'forward' ? 12 : -12) : 0
					},
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.18 }
				}}
			>
				{#if buttonState === 'idle'}
					{@render children?.()}
				{:else if buttonState === 'pending'}
					<Icon icon="loading" class="animate-spin motion-reduce:animate-none" />
					{text.pending}
				{:else if buttonState === 'success'}
					<Icon icon="success" />
					{text.success}
				{:else}
					<Icon icon="error" />
					{text.error}
				{/if}
			</Motion>
		{/key}
	</span>
</Button>
<span id={statusId} class="sr-only" role="status" data-slot="async-button-status">
	{statusMessage}
</span>
