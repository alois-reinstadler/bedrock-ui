export interface HsvColor {
	h: number;
	s: number;
	v: number;
	a: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function rgbToHsv(r: number, g: number, b: number, a = 1, lastHue = 0): HsvColor {
	const red = clamp(r / 255),
		green = clamp(g / 255),
		blue = clamp(b / 255);
	const max = Math.max(red, green, blue),
		min = Math.min(red, green, blue),
		delta = max - min;
	let h = lastHue;
	if (delta !== 0) {
		if (max === red) h = 60 * (((green - blue) / delta) % 6);
		else if (max === green) h = 60 * ((blue - red) / delta + 2);
		else h = 60 * ((red - green) / delta + 4);
		if (h < 0) h += 360;
	}
	return { h, s: max === 0 ? 0 : delta / max, v: max, a: clamp(a) };
}

export function hsvToRgb({ h, s, v, a }: HsvColor) {
	const hue = ((h % 360) + 360) % 360,
		saturation = clamp(s),
		value = clamp(v);
	const chroma = value * saturation,
		x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1)),
		m = value - chroma;
	let channels: [number, number, number];
	if (hue < 60) channels = [chroma, x, 0];
	else if (hue < 120) channels = [x, chroma, 0];
	else if (hue < 180) channels = [0, chroma, x];
	else if (hue < 240) channels = [0, x, chroma];
	else if (hue < 300) channels = [x, 0, chroma];
	else channels = [chroma, 0, x];
	return {
		r: Math.round((channels[0] + m) * 255),
		g: Math.round((channels[1] + m) * 255),
		b: Math.round((channels[2] + m) * 255),
		a: clamp(a)
	};
}

export function hsvToHex(hsv: HsvColor, alpha = false): string {
	const rgb = hsvToRgb(hsv);
	const byte = (value: number) => Math.round(value).toString(16).padStart(2, '0');
	return `#${byte(rgb.r)}${byte(rgb.g)}${byte(rgb.b)}${alpha ? byte(rgb.a * 255) : ''}`;
}

/** Renders an HSV color as a CSS `hsl()` string (alpha is ignored). */
export function hsvToHsl({ h, s, v }: HsvColor): string {
	const hue = ((Math.round(h) % 360) + 360) % 360;
	const lightness = v * (1 - s / 2);
	const saturation =
		lightness === 0 || lightness === 1 ? 0 : (v - lightness) / Math.min(lightness, 1 - lightness);
	return `hsl(${hue}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
}

export function parseColor(value: string, lastHue = 0): HsvColor | undefined {
	const input = value.trim();
	const hex = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.exec(input);
	if (hex) {
		let raw = hex[1];
		if (raw.length <= 4) raw = [...raw].map((part) => part.repeat(2)).join('');
		return rgbToHsv(
			Number.parseInt(raw.slice(0, 2), 16),
			Number.parseInt(raw.slice(2, 4), 16),
			Number.parseInt(raw.slice(4, 6), 16),
			raw.length === 8 ? Number.parseInt(raw.slice(6, 8), 16) / 255 : 1,
			lastHue
		);
	}
	const hsl =
		/^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*(?:deg)?\s*[, ]\s*(\d+(?:\.\d+)?)%\s*[, ]\s*(\d+(?:\.\d+)?)%(?:\s*[,/]\s*((?:\d+(?:\.\d+)?|\.\d+)%?))?\s*\)$/i.exec(
			input
		);
	if (hsl) {
		const hue = ((Number(hsl[1]) % 360) + 360) % 360,
			saturation = Number(hsl[2]) / 100,
			lightness = Number(hsl[3]) / 100;
		if (saturation > 1 || lightness > 1) return undefined;
		const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation,
			x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1)),
			m = lightness - chroma / 2;
		let channels: [number, number, number];
		if (hue < 60) channels = [chroma, x, 0];
		else if (hue < 120) channels = [x, chroma, 0];
		else if (hue < 180) channels = [0, chroma, x];
		else if (hue < 240) channels = [0, x, chroma];
		else if (hue < 300) channels = [x, 0, chroma];
		else channels = [chroma, 0, x];
		const rawAlpha = hsl[4],
			a = rawAlpha
				? rawAlpha.endsWith('%')
					? Number(rawAlpha.slice(0, -1)) / 100
					: Number(rawAlpha)
				: 1;
		if (a < 0 || a > 1) return undefined;
		return rgbToHsv(
			...(channels.map((channel) => (channel + m) * 255) as [number, number, number]),
			a,
			hue
		);
	}
	const rgb =
		/^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?%?))?\s*\)$/i.exec(
			input
		);
	if (!rgb) return undefined;
	const channels = rgb.slice(1, 4).map(Number);
	if (channels.some((channel) => channel > 255)) return undefined;
	const rawAlpha = rgb[4];
	const a = rawAlpha
		? rawAlpha.endsWith('%')
			? Number(rawAlpha.slice(0, -1)) / 100
			: Number(rawAlpha)
		: 1;
	if (a < 0 || a > 1) return undefined;
	return rgbToHsv(channels[0], channels[1], channels[2], a, lastHue);
}
