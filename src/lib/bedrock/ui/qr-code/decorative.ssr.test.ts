import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import QR from 'qrcode';
import QRCode from './qr-code.svelte';
import AnimatedSignature from '../animated-signature/animated-signature.svelte';
import Marquee from '../marquee/marquee.svelte';
import Spotlight from '../spotlight/spotlight.svelte';
import TiltCard from '../tilt-card/tilt-card.svelte';

describe('decorative components SSR contract', () => {
	it('encodes data without markup injection and preserves the four-module quiet zone', () => {
		const value = '<script>alert("test")</script>';
		const code = QR.create(value, { errorCorrectionLevel: 'M' });
		const { body } = render(QRCode, { props: { value } });
		expect(body).toContain(`viewBox="0 0 ${code.modules.size + 8} ${code.modules.size + 8}"`);
		expect(body).toContain('&lt;script>');
		expect(body).not.toContain('<script>alert');
		expect(body).toContain('x="4" y="4" width="7" height="7"');
	});
	it('renders invalid encodings as a readable fallback instead of throwing', () => {
		const { body } = render(QRCode, { props: { value: 'x'.repeat(5000) } });
		expect(body).toContain('Unable to encode this value.');
		expect(body).not.toContain('<svg');
	});
	it('keeps font signatures readable before client-side font parsing', () => {
		const { body } = render(AnimatedSignature, {
			props: { text: 'Alex Morgan', fontUrl: '/signature.ttf' }
		});
		expect(body).toContain('Alex Morgan');
		expect(body).not.toContain('<svg');
	});
	it('renders prepared signature strokes without loading a font', () => {
		const { body } = render(AnimatedSignature, {
			props: { text: 'Alex', paths: ['M0 0 L10 10'], viewBox: '0 0 20 20' }
		});
		expect(body).toContain('aria-label="Alex"');
		expect(body).toContain('pathLength="1"');
		expect(body).toContain('d="M0 0 L10 10"');
	});
	it('marks duplicate marquee content inert and exposes a pause control', () => {
		const { body } = render(Marquee);
		expect(body).toContain('aria-hidden="true" inert');
		expect(body).toContain('Pause scrolling');
		expect(body).toContain('aria-pressed="false"');
	});
	it('server-renders pointer effects as static surfaces without browser globals', () => {
		expect(render(Spotlight).body).toContain('data-slot="spotlight"');
		expect(render(TiltCard).body).toContain('data-slot="tilt-card"');
	});
});
