import { onDestroy } from 'svelte';
/** Shared async action lock. Rejections keep the current choice/draft available. */
export function createChatAction() {
	let pending = $state(false);
	let failed = $state(false);
	let disposed = false;
	onDestroy(() => {
		disposed = true;
	});
	return {
		get pending() {
			return pending;
		},
		get failed() {
			return failed;
		},
		async run(callback: () => void | Promise<void>) {
			if (pending || disposed) return false;
			pending = true;
			failed = false;
			try {
				await callback();
				return !disposed;
			} catch {
				if (!disposed) failed = true;
				return false;
			} finally {
				if (!disposed) pending = false;
			}
		}
	};
}
