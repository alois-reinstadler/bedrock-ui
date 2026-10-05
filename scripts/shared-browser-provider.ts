import { playwright } from '@vitest/browser-playwright';
import { chromium, type Browser } from 'playwright';

/** Attach the existing Chrome; never launch a browser or use its default context. */
export function sharedBrowserProvider() {
	const provider = playwright();
	if (process.env.GITHUB_ACTIONS === 'true') return provider;
	const createProvider = provider.providerFactory;
	provider.providerFactory = (project) => {
		const instance = createProvider(project);
		const openPage = instance.openPage.bind(instance);
		let connection: Promise<Browser> | undefined;
		instance.openPage = async (...args) => {
			connection ??= chromium.connectOverCDP(
				process.env.SHARED_BROWSER_CDP_URL ?? 'http://127.0.0.1:9222',
				{ noDefaults: true, timeout: 15_000 }
			);
			// This is the exported provider's public browser handle. Its own isolated
			// contexts, locators, mocks and cleanup continue to work unchanged.
			(instance as import('@vitest/browser-playwright').PlaywrightBrowserProvider).browser =
				await connection;
			return openPage(...args);
		};
		// The provider closes only contexts/pages it created. On a CDP connection,
		// Browser.close disconnects the transport; it does not terminate Chrome.
		return instance;
	};
	return provider;
}
