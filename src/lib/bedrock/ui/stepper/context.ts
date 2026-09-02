import { createContext } from 'svelte';

export type StepperResolvedLabels = {
	optional: string;
	completed: string;
	current: string;
	statusSuccess: string;
	statusWarning: string;
	statusError: string;
};

export type StepperContext = {
	/** Registers a step index; returns a cleanup for unmount. */
	register: (step: number) => () => void;
	getActiveStep: () => number;
	/** The one segment allowed to animate its fill (single-step advances only). */
	getAnimatedStep: () => number | null;
	getOrientation: () => 'horizontal' | 'vertical';
	getOnStepClick: () => ((index: number) => void) | undefined;
	getLabels: () => StepperResolvedLabels;
};

export const [getStepperContext, setStepperContext] = createContext<StepperContext>();
