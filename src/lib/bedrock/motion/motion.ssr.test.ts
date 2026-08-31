import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import MotionTestbed from './motion-testbed.svelte';

describe('Bedrock motion SSR contract', () => {
	it('imports the public motion surface without browser globals', async () => {
		const motion = await import('./index.js');
		expect(motion.layout).toBeTypeOf('function');
		expect(motion.reveal).toBeTypeOf('function');
		expect(motion.appear).toBeTypeOf('function');
		expect(motion.vanish).toBeTypeOf('function');
		expect(motion.drawer).toBeTypeOf('function');
	});

	it('server-renders final static layout without invoking attachments', () => {
		const { body } = render(MotionTestbed, { props: { scenario: 'layout' } });
		expect(body).toContain('data-testid="layout-root"');
		expect(body).toContain('data-testid="moving-node"');
		expect(body).not.toContain('transform:');
	});
});
