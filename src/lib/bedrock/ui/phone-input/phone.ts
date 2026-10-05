import {
	AsYouType,
	getCountries,
	getCountryCallingCode,
	parsePhoneNumberFromString,
	type CountryCode,
	type E164Number
} from 'libphonenumber-js/max';

export type PhoneCountry = CountryCode;
export type PhoneInputMetadata = {
	/** Only populated for a valid number. Extensions are returned separately. */
	e164: E164Number | undefined;
	country: CountryCode | undefined;
	callingCode: string | undefined;
	extension: string | undefined;
	valid: boolean;
	possible: boolean;
};

/** Strict whole-field parsing; never extracts a phone number from surrounding prose. */
export function getPhoneMetadata(value: string, country: CountryCode): PhoneInputMetadata {
	const parsed = parsePhoneNumberFromString(value, { defaultCountry: country, extract: false });
	const partial = new AsYouType(country);
	if (value.trimStart().startsWith('+')) partial.input(value);
	const valid = parsed?.isValid() ?? false;
	return {
		e164: valid ? parsed?.number : undefined,
		country: parsed?.country ?? partial.getCountry(),
		callingCode: parsed?.countryCallingCode ?? partial.getCallingCode(),
		extension: parsed?.ext,
		valid,
		possible: parsed?.isPossible() ?? false
	};
}

/** Country selection is the only operation that may rewrite an international prefix. */
export function changePhoneCountry(value: string, current: CountryCode, next: CountryCode): string {
	if (!value.trimStart().startsWith('+')) return value;
	const parsed = parsePhoneNumberFromString(value, { defaultCountry: current, extract: false });
	if (!parsed) {
		const partial = new AsYouType(current);
		partial.input(value);
		return `+${getCountryCallingCode(next)}${partial.getNumber()?.nationalNumber ?? ''}`;
	}
	return `+${getCountryCallingCode(next)}${parsed.nationalNumber}${parsed.ext ? ` ext. ${parsed.ext}` : ''}`;
}

export function getPhoneCountries(
	locale = 'en',
	labels: Partial<Record<CountryCode, string>> = {}
) {
	const names = new Intl.DisplayNames([locale], { type: 'region' });
	return getCountries()
		.map((country) => ({
			value: country,
			label: `${labels[country] ?? names.of(country) ?? country} +${getCountryCallingCode(country)}`,
			description: country
		}))
		.sort((a, b) => a.label.localeCompare(b.label, locale));
}
