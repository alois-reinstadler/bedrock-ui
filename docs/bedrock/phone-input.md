# PhoneInput

A country-aware telephone field with a searchable calling-code selector. Uses `libphonenumber-js/max` metadata for country lists, parsing, and validation. No WebGL is needed.

```svelte
<script lang="ts">
	import { PhoneInput, type PhoneInputMetadata } from '#lib/bedrock/ui/phone-input';
	let value = $state('');
	let metadata = $state<PhoneInputMetadata>();
</script>

<label for="phone">Phone number</label>
<PhoneInput
	id="phone"
	name="phone"
	e164Name="phoneE164"
	defaultCountry="AT"
	bind:value
	onValueChange={(_, next) => (metadata = next)}
/>
```

## Value contract

`value` is bindable raw text. Typing, pasting, deleting, and moving the caret never trigger automatic formatting. National numbers use `country` (bindable) or `defaultCountry` (`US` by default). A complete international prefix takes precedence and updates the displayed country. Changing country preserves national text; for a number beginning with `+`, selecting a country explicitly replaces its calling code and preserves the national digits and extension.

`onValueChange(raw, metadata)` runs on user edits and country selection, not initial render or programmatic prop updates. `metadata` contains `e164`, `country`, `callingCode`, `extension`, `valid`, and `possible`. `e164` is `undefined` until the entire value is valid; extensions remain separate. Use exported `getPhoneMetadata(value, country)` for initial or externally controlled values. Parsing rejects surrounding prose instead of extracting a number from it. Metadata validity does not prove a number is assigned or reachable.

## Forms and accessibility

`name` submits the exact raw text through the native `type="tel"` input. Optional `e164Name` adds a hidden field with a valid normalized value or an empty string. Disabled fields submit neither. Pass standard input attributes (`id`, `required`, `form`, `aria-describedby`, `aria-label`, event handlers) directly. `ref` references the telephone input. `autocomplete="tel"` and `inputmode="tel"` are the defaults.

Use an associated label. The country selector has its own accessible name and searchable keyboard navigation. `readonly` prevents both typing and country changes. `required` enables native empty-value validation; `invalid` or `aria-invalid` communicates application validation. The component does not block partial input or impose phone validity on every keystroke. Validate the normalized metadata at your chosen interaction point and on the server.

## Localization and styling

`locale` defaults to `en` and localizes country names using `Intl.DisplayNames`. Override names with `countryLabels: Partial<Record<PhoneCountry, string>>`. `labels` overrides `country`, `international`, `search`, and `empty`. `class` styles the outer field; `inputClass` styles the telephone input. Standard Bedrock border, muted, focus, and destructive tokens apply.

Country and validation metadata comes from the installed dependency; update it regularly as numbering plans change. The component imports the full validation metadata only in routes that use this component.
