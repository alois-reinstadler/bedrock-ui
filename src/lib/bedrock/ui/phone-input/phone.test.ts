import { describe, expect, it } from 'vitest';
import { changePhoneCountry, getPhoneCountries, getPhoneMetadata } from './phone.js';

describe('phone metadata', () => {
	it('normalizes national and international numbers with real country metadata', () => {
		expect(getPhoneMetadata('0664 1234567', 'AT')).toMatchObject({
			country: 'AT',
			e164: '+436641234567',
			valid: true
		});
		expect(getPhoneMetadata('+44 20 7946 0018', 'US')).toMatchObject({
			country: 'GB',
			e164: '+442079460018',
			valid: true
		});
	});
	it('keeps empty, incomplete and invalid values out of the E.164 field', () => {
		for (const value of ['', '+', '066', '+12001234567', 'Call: +1 213 373 4253']) {
			expect(getPhoneMetadata(value, 'AT').e164).toBeUndefined();
		}
		expect(getPhoneMetadata('+12001234567', 'US')).toMatchObject({ possible: true, valid: false });
	});
	it('reports international prefixes without guessing a country', () => {
		expect(getPhoneMetadata('+44', 'US')).toMatchObject({
			country: undefined,
			callingCode: '44',
			valid: false
		});
		expect(getPhoneMetadata('+80012345678', 'US')).toMatchObject({
			country: undefined,
			callingCode: '800',
			e164: '+80012345678'
		});
	});
	it('keeps extensions separate from the normalized number', () => {
		expect(getPhoneMetadata('+1 213 373 4253 ext. 23', 'AT')).toMatchObject({
			e164: '+12133734253',
			extension: '23'
		});
	});
	it('changes an explicit international prefix only on country selection', () => {
		expect(changePhoneCountry('+1 213 373 4253 ext. 23', 'US', 'AT')).toBe('+432133734253 ext. 23');
		expect(changePhoneCountry('0664 123', 'AT', 'DE')).toBe('0664 123');
	});
	it('switches incomplete international prefixes while preserving an entered national digit', () => {
		expect(changePhoneCountry('+', 'AT', 'DE')).toBe('+49');
		expect(changePhoneCountry('+4', 'AT', 'DE')).toBe('+49');
		expect(changePhoneCountry('+44', 'AT', 'DE')).toBe('+49');
		// A single national digit cannot be parsed as a complete PhoneNumber.
		expect(changePhoneCountry('+44 2', 'AT', 'DE')).toBe('+492');
	});
	it('uses metadata country codes and localized searchable labels', () => {
		expect(getPhoneCountries('de').find((entry) => entry.value === 'AT')?.label).toBe(
			'Österreich +43'
		);
		expect(
			getPhoneCountries('en', { AT: 'Austria override' }).find((entry) => entry.value === 'AT')
				?.label
		).toBe('Austria override +43');
		expect(getPhoneCountries().length).toBeGreaterThan(200);
	});
});
