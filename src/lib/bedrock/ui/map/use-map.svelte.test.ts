import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import type { Map } from 'maplibre-gl';
import type { useMap } from './use-map.svelte';
import ContextProvider from './fixtures/ContextProvider.svelte';
import ContextProbe from './fixtures/ContextProbe.svelte';

afterEach(cleanup);

describe('Bedrock map context', () => {
	it('keeps the same hook live through mount, style reload and teardown', async () => {
		let context!: ReturnType<typeof useMap>;
		const view = await render(ContextProvider, {
			report: (value) => {
				context = value;
			}
		});
		expect(context.map).toBeNull();
		expect(context.isStyleReady).toBe(false);
		const map = {} as Map;
		await view.rerender({ map, loaded: true, ready: true });
		expect(context.map).toBe(map);
		expect(context.isLoaded).toBe(true);
		expect(context.isStyleReady).toBe(true);
		await view.rerender({ ready: false, theme: 'dark' });
		expect(context.isLoaded).toBe(true);
		expect(context.isStyleReady).toBe(false);
		expect(context.resolvedTheme).toBe('dark');
		await view.rerender({ ready: true });
		expect(context.isStyleReady).toBe(true);
		await view.rerender({ map: null, loaded: false, ready: false });
		expect(context.map).toBeNull();
		expect(context.isLoaded).toBe(false);
	});

	it('isolates simultaneous maps', async () => {
		let first!: ReturnType<typeof useMap>;
		let second!: ReturnType<typeof useMap>;
		const view = await render(ContextProvider, {
			report: (value) => {
				first = value;
			}
		});
		await render(ContextProvider, {
			theme: 'dark',
			ready: true,
			report: (value) => {
				second = value;
			}
		});
		await view.rerender({ loaded: true });
		expect(first.isLoaded).toBe(true);
		expect(second.isLoaded).toBe(false);
		expect(first.resolvedTheme).toBe('light');
		expect(second.resolvedTheme).toBe('dark');
	});

	it('fails clearly instead of silently returning an empty map outside a provider', async () => {
		await expect(
			Promise.resolve().then(() => render(ContextProbe, { report: () => {} }))
		).rejects.toThrow('descendant of <Map>');
	});
});
