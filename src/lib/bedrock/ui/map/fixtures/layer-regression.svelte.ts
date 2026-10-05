import { flushSync, mount, unmount } from 'svelte';
import type { Map as MapLibreMap } from 'maplibre-gl';
import LayerFixture from './LayerFixture.svelte';

/** A deterministic MapLibre boundary; exercises Svelte layer ownership without a GPU or network. */
class LayerMap {
	sources = new Map<string, { setData: () => void }>();
	layers = new Map<string, unknown>();
	listeners = new Set<unknown>();
	canvas = { style: { cursor: '' } };
	getSource(id: string) {
		return this.sources.get(id);
	}
	getLayer(id: string) {
		return this.layers.get(id);
	}
	addSource(id: string) {
		if (this.sources.has(id)) throw new Error(`Duplicate source: ${id}`);
		this.sources.set(id, { setData() {} });
	}
	removeSource(id: string) {
		this.sources.delete(id);
	}
	addLayer(layer: { id: string }) {
		if (this.layers.has(layer.id)) throw new Error(`Duplicate layer: ${layer.id}`);
		this.layers.set(layer.id, layer);
	}
	removeLayer(id: string) {
		this.layers.delete(id);
	}
	setPaintProperty() {}
	setLayoutProperty() {}
	setFeatureState() {}
	getCanvas() {
		return this.canvas;
	}
	on(_event: string, _layer: string, handler: unknown) {
		this.listeners.add(handler);
	}
	off(_event: string, _layer: string, handler: unknown) {
		this.listeners.delete(handler);
	}
}

export async function runLayerRegression(target: HTMLElement) {
	const map = new LayerMap();
	const props = $state({ map: map as unknown as MapLibreMap, ready: false });
	const instance = mount(LayerFixture, { target, props });
	const assertions: string[] = [];
	function check(condition: boolean, description: string) {
		if (!condition) throw new Error(description);
		assertions.push(description);
	}
	try {
		flushSync();
		check(map.sources.size === 0, 'No sources before style readiness');
		props.ready = true;
		flushSync();
		check(map.sources.size === 4, 'Routes, arcs, GeoJSON and clusters initialize');
		const count = map.layers.size;
		check(count >= 7 && map.listeners.size > 0, 'Layers and interactions attach');
		props.ready = false;
		flushSync();
		check(
			map.sources.size === 0 && map.layers.size === 0 && map.listeners.size === 0,
			'Style replacement releases layers, sources and handlers'
		);
		props.ready = true;
		flushSync();
		check(
			map.sources.size === 4 && map.layers.size === count,
			'All layers return after style replacement'
		);
	} finally {
		await unmount(instance);
	}
	check(
		map.sources.size === 0 && map.layers.size === 0 && map.listeners.size === 0,
		'Unmount releases all owned resources'
	);
	return assertions;
}
