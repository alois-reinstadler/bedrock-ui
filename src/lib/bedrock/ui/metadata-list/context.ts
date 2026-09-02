import { createContext } from 'svelte';

export type MetadataListContext = {
	/** Assigns the next item index at component init (SSR-safe, source order). */
	register: () => number;
	/** True while the item takes part in the show-more collapse at all. */
	isCollapsible: (index: number) => boolean;
	/** True while the item is collapsed behind the show-more toggle. */
	isHidden: (index: number) => boolean;
	getLabelPosition: () => 'start' | 'top';
	getLabelWidth: () => string | undefined;
};

export const [getMetadataListContext, setMetadataListContext] =
	createContext<MetadataListContext>();
