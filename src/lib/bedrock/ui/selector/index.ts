import Complex from './complex-selector.svelte';
import Root from './selector.svelte';

export {
	selectorTriggerVariants,
	type SelectorLabels,
	type SelectorSize,
	type SelectorVariant
} from './selector.svelte';
export { flattenSelectorItems, isSelectorOption } from './types.js';
export type {
	SelectorGroupItem,
	SelectorItem,
	SelectorOption,
	SelectorSeparatorItem
} from './types.js';

export {
	Root,
	Complex,
	//
	Root as Selector,
	Complex as ComplexSelector
};
