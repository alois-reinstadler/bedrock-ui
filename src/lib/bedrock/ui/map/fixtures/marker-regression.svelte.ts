import { flushSync, mount, unmount } from 'svelte';
import MarkerFixture from './MarkerFixture.svelte';

export async function runMarkerRegression(target: HTMLElement) {
	const portal = document.createElement('div');
	target.append(portal);
	const props = $state({ target: portal, ready: false, labels: ['Vienna'] });
	const instance = mount(MarkerFixture, { target, props });
	const assertions: string[] = [];
	function check(condition: boolean, message: string) {
		if (!condition) throw new Error(message);
		assertions.push(message);
	}
	try {
		flushSync();
		check(portal.children.length === 0, 'Marker waits for readiness');
		props.ready = true;
		flushSync();
		check(portal.textContent === 'Vienna', 'Marker mounts into the external element');
		props.labels = ['Berlin', 'London'];
		flushSync();
		check(
			portal.querySelectorAll('button').length === 2 && portal.textContent === 'BerlinLondon',
			'Keyed snippet content remains reactive'
		);
		props.ready = false;
		flushSync();
		check(portal.children.length === 0, 'Marker content unmounts on teardown');
		props.ready = true;
		flushSync();
		check(
			portal.querySelectorAll('button').length === 2,
			'Marker content remounts without duplication'
		);
	} finally {
		await unmount(instance);
	}
	check(portal.children.length === 0, 'Unmount removes the portal subtree');
	portal.remove();
	return assertions;
}
