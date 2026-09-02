import type { IconType } from '#lib/bedrock/ui/icon';

/** A selectable entry in a Selector / MultiSelector list. */
export type SelectorOption = {
	value: string;
	label: string;
	description?: string;
	icon?: IconType;
	disabled?: boolean;
};

/** A visual divider between list entries. */
export type SelectorSeparatorItem = { type: 'separator' };

/** A labelled group of options. */
export type SelectorGroupItem = { type: 'group'; label: string; items: SelectorOption[] };

export type SelectorItem = SelectorOption | SelectorSeparatorItem | SelectorGroupItem;

export function isSelectorOption(item: SelectorItem): item is SelectorOption {
	return !('type' in item);
}

/** All options in declaration order, with group wrappers and separators removed. */
export function flattenSelectorItems(items: SelectorItem[]): SelectorOption[] {
	return items.flatMap((item) => {
		if (isSelectorOption(item)) return [item];
		return item.type === 'group' ? item.items : [];
	});
}
