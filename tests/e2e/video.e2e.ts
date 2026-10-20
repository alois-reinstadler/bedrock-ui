import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('video loads on demand and reloads without changing its reserved frame', async ({
	app,
	screen
}) => {
	await app.open('/docs/components/video');
	const sample = screen.getByRole('group', 'Sample video with loading skeleton');
	await expect(sample).toHaveAttribute('data-state', 'loaded', { timeout: 15_000 });
	await expect(screen.getByRole('group', 'Unavailable video preview')).toContainText(
		'No video available'
	);
	// An exact load action keeps this readiness regression independent of model timing.
	await screen.getByRole('button', 'Load video').tap();
	await expect(screen.getByRole('group', 'Load the sample clip on demand')).toHaveAttribute(
		'data-state',
		'loaded'
	);
	const before = await sample.boundingBox();
	await screen.getByRole('button', 'Reload video').tap();
	await expect(sample).toHaveAttribute('data-state', 'loading');
	await expect(sample).toHaveAttribute('aria-busy', 'true');
	await app.screenshot('video-loading-skeleton');
	await expect(sample).toHaveAttribute('data-state', 'loaded');
	await expect(sample).toHaveAttribute('aria-busy', 'false');
	const after = await sample.boundingBox();
	expect(after?.width).toBe(before?.width);
	expect(after?.height).toBe(before?.height);
	await app.screenshot('video-loaded');
});
