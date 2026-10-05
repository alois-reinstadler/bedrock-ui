/** Adapt only Superforms' legacy stores import, including Vite's versioned dev URLs. */
export function adaptSuperformsStores(code: string, id: string, storesModule: string) {
	const pathname = id.replaceAll('\\', '/').split(/[?#]/, 1)[0];
	if (!pathname.endsWith('/sveltekit-superforms/dist/client/superForm.js')) return;
	const adapted = code.replace(
		/from\s+(['"])\$app\/stores\1/g,
		`from ${JSON.stringify(storesModule)}`
	);
	if (adapted === code) return;
	return { code: adapted, map: null };
}
