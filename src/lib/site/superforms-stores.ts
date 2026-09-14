// Superforms 2 still consumes the removed SvelteKit $app/stores entry.
// Bridge only the two stores it imports; application code uses $app/state.
import { page as currentPage, navigating as currentNavigation } from '$app/state';
import { toStore, type Readable } from 'svelte/store';

// Construct inside subscribe, so server page context is read during rendering,
// never while importing this module. toStore tears down tracking on unsubscribe.
export const page: Readable<typeof currentPage> = {
	subscribe(run, invalidate) {
		return toStore(() => ({
			shallow: currentPage.shallow,
			data: currentPage.data,
			error: currentPage.error,
			form: currentPage.form,
			params: currentPage.params,
			route: currentPage.route,
			state: currentPage.state,
			status: currentPage.status,
			url: currentPage.url
		})).subscribe(run, invalidate);
	}
};
function readNavigation() {
	return currentNavigation.type === null
		? null
		: {
				from: currentNavigation.from,
				to: currentNavigation.to,
				type: currentNavigation.type,
				willUnload: currentNavigation.willUnload,
				delta: 'delta' in currentNavigation ? currentNavigation.delta : undefined,
				complete: currentNavigation.complete
			};
}
export const navigating: Readable<ReturnType<typeof readNavigation>> = {
	subscribe(run, invalidate) {
		return toStore(readNavigation).subscribe(run, invalidate);
	}
};
