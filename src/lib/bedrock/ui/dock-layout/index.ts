import Root from './dock-layout.svelte';

export { Root, Root as DockLayout };
export type { DockLayoutProps } from './dock-layout.svelte';
export type {
	LayoutConfig,
	NodeConfig,
	SplitConfig,
	TabGroupConfig,
	View,
	Id,
	KeyboardControls
} from 'horizon-layout';
export { cloneConfig, parseLayoutConfig, validateConfig } from 'horizon-layout';
