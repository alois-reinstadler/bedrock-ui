import { describe, expect, it } from 'vitest';
import { adaptSuperformsStores } from './superforms-compat';

const source = "import { navigating, page } from '$app/stores';\nexport const untouched = true;";
const shim = '/project/src/lib/site/superforms-stores.ts';

describe('Superforms Kit 3 compatibility', () => {
	it.each([
		'/project/node_modules/sveltekit-superforms/dist/client/superForm.js',
		'/project/node_modules/sveltekit-superforms/dist/client/superForm.js?v=1234',
		'C:\\project\\node_modules\\sveltekit-superforms\\dist\\client\\superForm.js?v=1234'
	])('rewrites the library import at %s', (id) => {
		expect(adaptSuperformsStores(source, id, shim)?.code).toBe(
			`import { navigating, page } from ${JSON.stringify(shim)};\nexport const untouched = true;`
		);
	});

	it('does not override application or other dependency imports', () => {
		for (const id of ['/project/src/page.ts', '/node_modules/other/dist/client/superForm.js']) {
			expect(adaptSuperformsStores(source, id, shim)).toBeUndefined();
		}
	});

	it('leaves a future compatible Superforms implementation alone', () => {
		expect(
			adaptSuperformsStores(
				"import { page } from '$app/state';",
				'/node_modules/sveltekit-superforms/dist/client/superForm.js',
				shim
			)
		).toBeUndefined();
	});
});
