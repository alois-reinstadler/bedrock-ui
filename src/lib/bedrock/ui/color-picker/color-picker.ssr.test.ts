import { describe, expect, it, vi } from 'vitest';
import { render } from 'svelte/server';
import ColorPicker from './color-picker.svelte';

describe('ColorPicker server rendering', () => {
	it('renders the initial controlled color and form value without browser effects', () => {
		const onValueChange = vi.fn();
		const { body } = render(ColorPicker, {
			props: { value: '#00ff0080', alpha: true, format: 'rgb', name: 'accent', onValueChange }
		});
		const hue = body.match(/<div[^>]*data-slot="color-picker-hue"[^>]*>/)?.[0];
		expect(hue).toContain('aria-valuenow="120"');
		expect(body).toContain('value="rgba(0, 255, 0, 0.502)"');
		expect(body).toMatch(/<input[^>]*name="accent"[^>]*value="#00ff0080"/);
		expect(onValueChange).not.toHaveBeenCalled();
	});
});
