<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { PhoneCountry, PhoneInputMetadata } from './phone.js';

	const defaultLabels = {
		country: 'Country calling code',
		international: 'International',
		search: 'Search countries or calling codes…',
		empty: 'No countries found.'
	};
	export type PhoneInputLabels = Partial<typeof defaultLabels>;
	export type PhoneInputProps = Omit<HTMLInputAttributes, 'value' | 'type' | 'size'> & {
		ref?: HTMLInputElement | null;
		/** The exact editable text. Never reformatted while typing or pasting. */
		value?: string;
		/** Country used to interpret national numbers. */
		country?: PhoneCountry;
		defaultCountry?: PhoneCountry;
		onValueChange?: (value: string, metadata: PhoneInputMetadata) => void;
		onCountryChange?: (country: PhoneCountry) => void;
		/** Optional additional native form field containing a valid E.164 value or an empty string. */
		e164Name?: string;
		invalid?: boolean;
		locale?: string;
		labels?: PhoneInputLabels;
		countryLabels?: Partial<Record<PhoneCountry, string>>;
		inputClass?: string;
	};
</script>

<script lang="ts">
	import { getCountryCallingCode } from 'libphonenumber-js/max';
	import { Selector } from '#lib/bedrock/ui/selector';
	import { cn } from '#lib/utils.js';
	import { changePhoneCountry, getPhoneCountries, getPhoneMetadata } from './phone.js';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		country = $bindable(),
		defaultCountry = 'US',
		onValueChange,
		onCountryChange,
		e164Name,
		invalid = false,
		locale = 'en',
		labels: labelOverrides,
		countryLabels,
		class: className,
		inputClass,
		disabled = false,
		readonly = false,
		autocomplete = 'tel',
		inputmode = 'tel',
		oninput,
		'aria-invalid': ariaInvalid,
		...restProps
	}: PhoneInputProps = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const metadata = $derived(getPhoneMetadata(value, country ?? defaultCountry));
	const selectedCountry = $derived(metadata.country ?? country ?? defaultCountry);
	const international = $derived(
		!!metadata.callingCode && !metadata.country && value.trimStart().startsWith('+')
	);
	const countries = $derived([
		...(international
			? [
					{
						value: 'international',
						label: labels.international,
						description: `+${metadata.callingCode}`,
						disabled: true
					}
				]
			: []),
		...getPhoneCountries(locale, countryLabels)
	]);
	const isInvalid = $derived(ariaInvalid ?? invalid);

	function setRef(element: HTMLInputElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}

	function updateValue(next: string) {
		value = next;
		onValueChange?.(next, getPhoneMetadata(next, country ?? defaultCountry));
	}

	function selectCountry(next: string) {
		const selected = next as PhoneCountry;
		const nextValue = changePhoneCountry(value, selectedCountry, selected);
		country = selected;
		onCountryChange?.(selected);
		updateValue(nextValue);
	}
</script>

<div
	data-slot="phone-input"
	data-disabled={disabled || undefined}
	data-readonly={readonly || undefined}
	data-invalid={isInvalid || undefined}
	class={cn(
		'flex h-9 w-full min-w-0 items-center rounded-lg border border-input bg-transparent shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-[invalid=true]:border-destructive data-[invalid=true]:ring-3 data-[invalid=true]:ring-destructive/20 dark:bg-input/30 data-disabled:cursor-not-allowed data-disabled:bg-input/50 data-disabled:opacity-50',
		className
	)}
>
	<Selector
		items={countries}
		value={international ? 'international' : selectedCountry}
		onValueChange={selectCountry}
		searchable
		disabled={!!(disabled || readonly)}
		aria-label={labels.country}
		{labels}
		variant="ghost"
		dataSlot="phone-input-country"
		class="h-8 w-auto min-w-25 rounded-md border-0 px-2.5 text-xs shadow-none focus-visible:ring-2"
	>
		{#snippet selected()}
			<span class="font-medium">{international ? labels.international : selectedCountry}</span>
			<span class="text-muted-foreground tabular-nums"
				>+{metadata.callingCode ?? getCountryCallingCode(selectedCountry)}</span
			>
		{/snippet}
	</Selector>
	<span aria-hidden="true" class="h-4 w-px shrink-0 bg-border"></span>
	<input
		{...restProps}
		{@attach setRef}
		bind:value={() => value, updateValue}
		{oninput}
		type="tel"
		{autocomplete}
		{inputmode}
		{disabled}
		{readonly}
		aria-invalid={isInvalid || undefined}
		data-slot="phone-input-field"
		class={cn(
			'h-full w-full min-w-0 rounded-r-lg bg-transparent px-2.5 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm',
			inputClass
		)}
	/>
	{#if e164Name}
		<input
			type="hidden"
			name={e164Name}
			value={metadata.e164 ?? ''}
			{disabled}
			form={restProps.form}
		/>
	{/if}
</div>
