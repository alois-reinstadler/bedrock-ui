import { describe, expect, it, afterEach } from 'vitest';
import { resetIcons, resolveIcon, setIcons } from './registry.svelte.js';
import type { IconComponent, IconName } from './types.js';

const names: IconName[] = [
	'close',
	'chevronUp',
	'chevronDown',
	'chevronLeft',
	'chevronRight',
	'chevronsLeft',
	'chevronsRight',
	'check',
	'success',
	'error',
	'warning',
	'info',
	'calendar',
	'clock',
	'externalLink',
	'menu',
	'moreHorizontal',
	'search',
	'arrowUp',
	'arrowDown',
	'arrowsUpDown',
	'funnel',
	'eyeSlash',
	'viewColumns',
	'copy',
	'checkDouble',
	'wrench',
	'stop',
	'microphone',
	'download',
	'add',
	'send',
	'drag',
	'attachment',
	'image',
	'file',
	'loading',
	'play',
	'pause',
	'volume',
	'volumeMuted',
	'fullscreen',
	'exitFullscreen',
	'pip',
	'captions'
];

afterEach(() => resetIcons());

describe('icon registry', () => {
	it('resolves every semantic name to a component', () => {
		for (const name of names) {
			expect(resolveIcon(name), name).toBeTypeOf('function');
		}
	});

	it('passes direct components through untouched', () => {
		const custom = (() => {}) as unknown as IconComponent;
		expect(resolveIcon(custom)).toBe(custom);
	});

	it('setIcons replaces a name globally and resetIcons restores it', () => {
		const original = resolveIcon('close');
		const custom = (() => {}) as unknown as IconComponent;
		setIcons({ close: custom });
		expect(resolveIcon('close')).toBe(custom);
		expect(resolveIcon('check')).toBe(resolveIcon('check'));
		resetIcons();
		expect(resolveIcon('close')).toBe(original);
	});
});
