import Item from './checkbox-list-item.svelte';
import Root from './checkbox-list.svelte';

export type { CheckboxListItemProps } from './checkbox-list-item.svelte';
export type { CheckboxListProps } from './checkbox-list.svelte';

export {
	Root,
	Item,
	//
	Root as CheckboxList,
	Item as CheckboxListItem
};
