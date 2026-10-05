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
	import { autoSize } from '#lib/bedrock/motion/auto-size.js';
	import { motionPresets } from '#lib/bedrock/motion/tokens.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import AstraPolicy from '#lib/bedrock/motion/AstraPolicy.svelte';
	import { AnimatePresence } from 'astra-motion/presence';
	import { LazyMotion } from 'astra-motion/lazy';
	import { domAnimation } from 'astra-motion/features/dom-animation';
	import Label from './async-button-label.svelte';
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
		children: content,
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
	let disposed = false;
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
	const policy = useMotionPolicy();
	// Presence retains the previous record; its label cannot change to the next state.
	const labelItems = $derived([{ state: buttonState, text: statusMessage }]);

	// The shell performs real reflow; Astra owns only label opacity and translation.
	const shell = autoSize({ duration: motionPresets.swap.duration, axis: 'both' });

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
			if (disposed) return;
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
		disposed = true;
		run += 1;
		clearTimeout(resetTimer);
	});
</script>

<!-- Not natively disabled while pending: `aria-disabled` keeps the button
     focusable so keyboard users are never dropped mid-interaction. -->
<Button
	{@attach setRef}
	{@attach policy.attach}
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
	<AstraPolicy>
		<LazyMotion features={domAnimation}>
			<span
				{@attach shell}
				class="relative inline-flex items-center justify-center overflow-hidden"
				data-direction={swapDirection}
			>
				<AnimatePresence
					items={labelItems}
					key={(item) => item.state}
					initial={false}
					mode="popLayout"
				>
					{#snippet children(item)}
						<Label effect={swapEffect} direction={swapDirection}>
							{#if item.state === 'idle'}
								{@render content?.()}
							{:else if item.state === 'pending'}
								<Icon
									icon="loading"
									class={policy.reduced ? '' : 'animate-spin motion-reduce:animate-none'}
								/>
								{item.text}
							{:else if item.state === 'success'}
								<Icon icon="success" />
								{item.text}
							{:else}
								<Icon icon="error" />
								{item.text}
							{/if}
						</Label>
					{/snippet}
				</AnimatePresence>
			</span>
		</LazyMotion>
	</AstraPolicy>
</Button>
<span id={statusId} class="sr-only" role="status" data-slot="async-button-status">
	{statusMessage}
</span>
