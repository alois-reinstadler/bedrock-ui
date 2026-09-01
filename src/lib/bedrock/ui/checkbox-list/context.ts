import { createContext } from 'svelte';

export type CheckboxListContext = {
	getValue: () => string[];
	toggle: (value: string) => void;
	isDisabled: () => boolean;
};

export const [getCheckboxListContext, setCheckboxListContext] =
	createContext<CheckboxListContext>();
