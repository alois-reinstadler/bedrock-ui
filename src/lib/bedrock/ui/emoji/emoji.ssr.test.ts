import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { Emoji } from './index';

describe('Emoji SSR', () => {
	it('renders a named symbol with pinned artwork and real Unicode text', async () => {
		const { body } = await render(Emoji, { props: { value: '❤️', label: 'Love' } });
		expect(body).toContain('emoji-datasource-apple@16.0.0/img/apple/64/2764-fe0f.png');
		expect(body).toContain('aria-label="Love"');
		expect(body).toContain('❤️');
	});
	it('renders mixed content as text with no sentence-wide image role', async () => {
		const { body } = await render(Emoji, { props: { value: 'Hello 👩🏽‍💻' } });
		expect(body).toContain('Hello ');
		expect(body).toContain('👩🏽‍💻');
		expect(body).not.toContain('role="img"');
		const unknown = await render(Emoji, { props: { value: 'not-an-emoji' } });
		expect(unknown.body).not.toContain('<img');
	});
});
