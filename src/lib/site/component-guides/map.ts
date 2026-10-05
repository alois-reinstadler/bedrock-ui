import type { ComponentGuides, ComponentAccessibilityGuide } from './types';

export const mapGuides = {
	map: {
		purpose:
			'Map is Bedrock’s interactive map component family, powered by MapLibre. Compose controls, markers, popups, routes and geographic layers, or use LazyMap to load the rendering engine on demand.',
		useWhen: [
			'Locations, routes or regions benefit from geographic context.',
			'Large point datasets need clustering or GPU-rendered layers.'
		],
		avoidWhen: [
			'Use a list or table when geography does not help the task.',
			'Do not make the map the only way to access essential locations or actions.'
		],
		anatomy: [
			{
				name: 'Map.Root (alias: Map)',
				description:
					'Owns the MapLibre instance, theme, viewport and descendant context. Requires a container with an explicit height.',
				required: true
			},
			{
				name: 'LazyMap',
				description:
					'Optional lightweight entry at #lib/bedrock/ui/map/lazy. Loads the entire family near the viewport or after a click; obtain markers and layers from its children snippet argument.'
			},
			{ name: 'MapControls', description: 'Zoom, compass, location and fullscreen controls.' },
			{
				name: 'MapMarker / MarkerContent / MarkerLabel',
				description: 'Composable DOM markers with optional dragging and labels.'
			},
			{
				name: 'MarkerPopup / MarkerTooltip / MapPopup',
				description: 'Marker-attached or independent geographic content.'
			},
			{
				name: 'MapRoute / RouteProgress / RouteMarker',
				description: 'Routes with progress, endpoints and active styling.'
			},
			{
				name: 'MapArc / MapGeoJSON / MapClusterLayer',
				description:
					'Interactive curved connections, geographic regions and clustered point datasets.'
			},
			{
				name: 'useMap',
				description:
					'Call during descendant component initialization. Keep the returned object intact to retain reactive getters. Parents use bind:map.'
			}
		],
		behavior: [
			'LazyMap defers map JavaScript, CSS and the worker. Import it from the /lazy entry and receive marker/popup components through its children snippet; static imports from the eager family defeat this boundary.',
			'Copy src/lib/bedrock/ui/map and install maplibre-gl@6.7.0 and @types/geojson. The component imports MapLibre CSS and a matching local worker asset using Vite.',
			'The default basemap follows the document theme. Supply styles for custom basemaps or blank for a transparent tile-free canvas.',
			'useMap exposes map, isLoaded, isStyleReady and resolvedTheme. Layer effects must track isStyleReady so sources and layers return after style changes; DOM markers remain mounted.',
			'Call useMap in a child component, never in a parent-owned snippet, event handler or effect. Access the map from a parent with bind:map.',
			'Examples use network-hosted tiles and geographic datasets. OSRM routing requires its public service; geolocation requires permission and a secure browser context.',
			'MapLibre honors reduced-motion preferences for camera animations. Supply accessible names for custom marker buttons and an equivalent list for canvas-only features.'
		],
		examplePlan: [
			{
				title: 'Map examples',
				demonstrates:
					'A location finder and copyable examples grouped into Map, Controls, Markers, Popups, Routes, Arcs, GeoJSON, Clusters and Advanced, with copyable source.',
				priority: 'primary'
			},
			{
				title: 'Map lifecycle',
				demonstrates:
					'Theme changes, controlled viewports, layer restoration and cleanup when changing examples.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;

export function mapAccessibility(): ComponentAccessibilityGuide {
	return {
		semantics: [
			'MapLibre renders geographic layers on a canvas. Provide an equivalent location list or table for essential data; canvas features are not a semantic document.'
		],
		keyboard: [
			'MapLibre supports arrow-key panning and plus/minus zoom when the canvas has focus. Native control buttons activate with Enter or Space.',
			'Custom markers should contain labelled native buttons or links. Canvas-only arc, region and cluster clicks need an equivalent keyboard-accessible action outside the map.'
		],
		focus: [
			'Popup focusAfterOpen follows MapLibre behavior; choose it deliberately for interactive popups. Return focus to a surviving marker or control after removing focused content.'
		],
		labels: [
			'Give marker buttons descriptive names. Built-in controls include action labels; custom content remains application-owned.'
		],
		announcements: [
			'Loading and unavailable-renderer states use status regions. Announce selected locations or route results in an application-owned status region when appropriate.'
		],
		reducedMotion: [
			'MapLibre camera animations respect prefers-reduced-motion unless the application explicitly marks an animation essential. Avoid continuous movement and provide static alternatives for custom animations.'
		],
		knownGaps: [
			'Canvas-based features are not individually focusable or announced. MarkerTooltip currently opens on pointer hover. Provide equivalent text and keyboard actions.',
			'WebGL2 is required for maps. Unsupported renderers show a fallback message; geolocation requires permission and a secure context.'
		]
	};
}
