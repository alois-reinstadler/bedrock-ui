<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input } from '#lib/bedrock/ui/input';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import {
		createColorState,
		colorText,
		type ColorControlProps,
		type ColorFormat
	} from '../color-picker/color-state.svelte.js';
	import { parseColor } from '../color-picker/hsv.js';
	export type ColorFieldProps = Omit<
		WithElementRef<HTMLInputAttributes>,
		'value' | 'oninput' | 'type' | 'files'
	> &
		ColorControlProps & { format?: ColorFormat; label?: string; invalidMessage?: string };
	let {
		value = $bindable(undefined),
		onValueChange,
		alpha,
		disabled,
		name,
		ref = $bindable(null),
		class: className,
		format = 'hex',
		label = 'Color value',
		invalidMessage = 'Enter a valid HEX, RGB, or HSL color.',
		...rest
	}: ColorFieldProps = $props();
	const control = createColorState({
		value: () => value,
		alpha: () => alpha,
		disabled: () => disabled,
		change: (next) => {
			value = next;
			onValueChange?.(next);
		}
	});
	const uid = $props.id();
	let draft = $state<{ text: string; source: string; format: ColorFormat } | undefined>();
	const activeDraft = $derived(
		draft?.source === control.value && draft.format === format ? draft : undefined
	);
	const invalid = $derived(Boolean(activeDraft && !parseColor(activeDraft.text, control.hsv.h)));
	function change(event: Event) {
		const text = (event.currentTarget as HTMLInputElement).value;
		const parsed = parseColor(text, control.hsv.h);
		if (parsed) control.commit(parsed);
		draft = { text, source: control.value, format };
	}
	function finish() {
		if (!invalid) draft = undefined;
	}
</script>

<Input
	data-slot="color-field"
	type="text"
	bind:ref
	class={cn('font-code', className)}
	value={activeDraft?.text ?? colorText(control.hsv, format, control.alpha)}
	disabled={control.disabled}
	aria-label={label}
	aria-invalid={invalid}
	aria-describedby={invalid ? `${uid}-invalid` : undefined}
	oninput={change}
	onblur={finish}
	onkeydown={(event) => {
		if (event.key === 'Escape') draft = undefined;
		if (event.key === 'Enter') finish();
	}}
	{...rest}
/>
{#if invalid}<small
		id={`${uid}-invalid`}
		role="alert"
		class="col-span-full text-xs text-destructive">{invalidMessage}</small
	>{/if}
{#if name}<input type="hidden" {name} value={control.value} disabled={control.disabled} />{/if}
