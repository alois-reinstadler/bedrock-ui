import { createContext } from 'svelte';

export type SteppedFormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
export type SteppedFormDirection = 'forward' | 'backward';

export type SteppedFormStep = {
	id: string;
	title: string;
	description?: string;
	optional?: boolean;
	disabled?: boolean;
};

export type SteppedFormValidationResult =
	| boolean
	| string
	| {
			valid: boolean;
			message?: string;
			/** A field to focus when validation fails. */
			field?: HTMLElement | string;
	  };

export type SteppedFormValidationContext = {
	step: SteppedFormStep;
	value: string;
	form: HTMLFormElement;
	formData: FormData;
};

export type SteppedFormValidator = (
	context: SteppedFormValidationContext
) => SteppedFormValidationResult | Promise<SteppedFormValidationResult>;

export type SteppedFormContext = {
	getSteps: () => SteppedFormStep[];
	getTitleId: (id: string) => string;
	getCurrent: () => string;
	getDirection: () => SteppedFormDirection;
	getStatus: () => SteppedFormStatus;
	getMessage: () => string;
	getDisabled: () => boolean;
	getCompleted: () => string[];
	goTo: (
		id: string,
		reason?: 'next' | 'previous' | 'progress' | 'programmatic'
	) => Promise<boolean>;
	next: () => Promise<boolean>;
	previous: () => Promise<boolean>;
	retry: () => Promise<void>;
	registerValidator: (id: string, validator: SteppedFormValidator | undefined) => () => void;
};

export const [getSteppedFormContext, setSteppedFormContext] = createContext<SteppedFormContext>();
export const [getSteppedFormStepContext, setSteppedFormStepContext] = createContext<() => string>();
