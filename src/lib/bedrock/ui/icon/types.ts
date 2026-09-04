import type { Component } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';

/** Semantic icon names resolved through the global Bedrock icon registry. */
export type IconName =
	| 'close'
	| 'chevronUp'
	| 'chevronDown'
	| 'chevronLeft'
	| 'chevronRight'
	| 'chevronsLeft'
	| 'chevronsRight'
	| 'check'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'calendar'
	| 'clock'
	| 'externalLink'
	| 'menu'
	| 'moreHorizontal'
	| 'search'
	| 'arrowUp'
	| 'arrowDown'
	| 'arrowsUpDown'
	| 'funnel'
	| 'eyeSlash'
	| 'viewColumns'
	| 'copy'
	| 'checkDouble'
	| 'wrench'
	| 'stop'
	| 'microphone'
	| 'download'
	| 'add'
	| 'send'
	| 'drag'
	| 'attachment'
	| 'image'
	| 'file'
	| 'loading'
	| 'play'
	| 'pause'
	| 'volume'
	| 'volumeMuted'
	| 'fullscreen'
	| 'exitFullscreen'
	| 'pip'
	| 'captions';

/** SVG props every icon component must accept. Narrows the few attributes
 * lucide narrows (`name`, `color`, `title`) so lucide icons and plain SVG
 * components are both assignable. */
export type IconProps = Omit<
	SVGAttributes<SVGSVGElement>,
	'name' | 'color' | 'title' | 'children'
> & {
	name?: string;
	color?: string;
	title?: string;
};

/** Any SVG/Svelte icon component (lucide icons satisfy this shape). */
export type IconComponent = Component<IconProps>;

/** Accepted by every Bedrock `icon` prop: a semantic registry name or a
 * direct icon component for one-offs outside the registry. */
export type IconType = IconName | IconComponent;
