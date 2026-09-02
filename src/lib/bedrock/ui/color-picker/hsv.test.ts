import { describe, expect, it } from 'vitest';
import { hsvToHex, hsvToHsl, hsvToRgb, parseColor, rgbToHsv } from './hsv.js';

describe('HSV conversion', () => {
	it.each(['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#808080', '#123456', '#abcdef'])(
		'round-trips %s',
		(hex) => expect(hsvToHex(parseColor(hex)!)).toBe(hex)
	);

	it('preserves the last hue for greys, black, and white', () => {
		expect(rgbToHsv(0, 0, 0, 1, 217).h).toBe(217);
		expect(rgbToHsv(255, 255, 255, 1, 217).h).toBe(217);
		expect(rgbToHsv(128, 128, 128, 1, 217).h).toBe(217);
	});

	it('round-trips alpha edges', () => {
		expect(hsvToHex(parseColor('#ff000000')!, true)).toBe('#ff000000');
		expect(hsvToHex(parseColor('#ff0000ff')!, true)).toBe('#ff0000ff');
	});

	it('parses HSL and HSLA input', () => {
		expect(hsvToHex(parseColor('hsl(0, 100%, 50%)')!)).toBe('#ff0000');
		expect(hsvToHex(parseColor('hsla(120, 100%, 25%, .5)')!, true)).toBe('#00800080');
	});

	it('parses RGB and RGBA input', () => {
		expect(hsvToHex(parseColor('rgb(255, 0, 0)')!)).toBe('#ff0000');
		expect(hsvToHex(parseColor('rgba(0, 128, 0, 0.5)')!, true)).toBe('#00800080');
		expect(parseColor('rgb(999, 0, 0)')).toBeUndefined();
	});

	it('rejects invalid input', () => {
		expect(parseColor('')).toBeUndefined();
		expect(parseColor('#ff')).toBeUndefined();
		expect(parseColor('not-a-color')).toBeUndefined();
		expect(parseColor('hsl(0, 200%, 50%)')).toBeUndefined();
	});
});

describe('hsvToHsl', () => {
	it('renders primaries and mid greys', () => {
		expect(hsvToHsl(parseColor('#ff0000')!)).toBe('hsl(0, 100%, 50%)');
		expect(hsvToHsl(parseColor('#00ff00')!)).toBe('hsl(120, 100%, 50%)');
		expect(hsvToHsl(parseColor('#0000ff')!)).toBe('hsl(240, 100%, 50%)');
	});

	it('reports zero saturation at the lightness extremes', () => {
		expect(hsvToHsl({ h: 217, s: 0, v: 0, a: 1 })).toBe('hsl(217, 0%, 0%)');
		expect(hsvToHsl({ h: 217, s: 0, v: 1, a: 1 })).toBe('hsl(217, 0%, 100%)');
	});

	it('normalizes out-of-range hues', () => {
		expect(hsvToHsl({ h: 360, s: 1, v: 1, a: 1 })).toBe('hsl(0, 100%, 50%)');
		expect(hsvToHsl({ h: -120, s: 1, v: 1, a: 1 })).toBe('hsl(240, 100%, 50%)');
	});

	it('round-trips through parseColor within rounding error', () => {
		const hsv = parseColor('#6e56cf')!;
		const back = hsvToRgb(parseColor(hsvToHsl(hsv), hsv.h)!);
		const original = hsvToRgb(hsv);
		expect(Math.abs(back.r - original.r)).toBeLessThanOrEqual(3);
		expect(Math.abs(back.g - original.g)).toBeLessThanOrEqual(3);
		expect(Math.abs(back.b - original.b)).toBeLessThanOrEqual(3);
	});
});
