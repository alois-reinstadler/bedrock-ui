import { expect, it } from 'vitest';
import { runLayerRegression } from './fixtures/layer-regression.svelte';

it('restores every layer family after a style swap and removes all resources on unmount', async () => {
	const target = document.createElement('div');
	document.body.append(target);
	try {
		expect(await runLayerRegression(target)).toHaveLength(6);
	} finally {
		target.remove();
	}
});

it('keeps keyed marker content reactive and owns its portal cleanup', async () => {
	const { runMarkerRegression } = await import('./fixtures/marker-regression.svelte');
	const target = document.createElement('div');
	document.body.append(target);
	try {
		expect(await runMarkerRegression(target)).toHaveLength(6);
	} finally {
		target.remove();
	}
});
