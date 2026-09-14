<script lang="ts" module>
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type {
		SteppedFormStep,
		SteppedFormValidationContext,
		SteppedFormValidator
	} from './context.js';

	export type SteppedFormPersistence = {
		/** Read an initial step, for example from a URLSearchParams instance. Browser only. */
		read: () => string | null | undefined;
		/** Persist a committed step. This library never imports a router. */
		write: (value: string) => void;
	};

	export type SteppedFormSubmitContext = Omit<SteppedFormValidationContext, 'step'> & {
		steps: SteppedFormStep[];
	};

	export type SteppedFormProps = Omit<HTMLFormAttributes, 'onsubmit'> & {
		steps: SteppedFormStep[];
		value?: string;
		defaultValue?: string;
		nonlinear?: boolean;
		disabled?: boolean;
		validateStep?: SteppedFormValidator;
		canNavigate?: (detail: {
			from: SteppedFormStep;
			to: SteppedFormStep;
			completed: string[];
		}) => boolean | Promise<boolean>;
		onSubmit?: (context: SteppedFormSubmitContext) => void | Promise<void>;
		onValueChange?: (
			value: string,
			previous: string,
			reason: 'next' | 'previous' | 'progress' | 'programmatic'
		) => void;
		persistence?: SteppedFormPersistence;
	};
</script>

<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { onMount, tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { SvelteMap } from 'svelte/reactivity';
	import {
		setSteppedFormContext,
		type SteppedFormDirection,
		type SteppedFormStatus,
		type SteppedFormValidationResult
	} from './context.js';

	let {
		ref = $bindable(null),
		class: className,
		steps,
		value = $bindable(),
		defaultValue,
		nonlinear = false,
		disabled = false,
		validateStep,
		canNavigate,
		onSubmit,
		onValueChange,
		persistence,
		children,
		...restProps
	}: SteppedFormProps & { ref?: HTMLFormElement | null; children?: Snippet } = $props();

	const instanceId = $props.id();
	const titleId = (id: string) => `${instanceId}-${id}-title`;
	let operation = $state(false);
	let internalValue = $state<string | undefined>();
	let direction = $state<SteppedFormDirection>('forward');
	let status = $state<SteppedFormStatus>('idle');
	let message = $state('');
	let completed = $state<string[]>([]);
	let invalidField: HTMLElement | string | undefined;
	let retryAction: (() => Promise<unknown>) | undefined;
	const validators = new SvelteMap<string, SteppedFormValidator>();

	const enabledSteps = $derived(steps.filter((step) => !step.disabled));
	const current = $derived.by(() => {
		const candidate = value ?? internalValue ?? defaultValue;
		return enabledSteps.some((step) => step.id === candidate)
			? candidate!
			: (enabledSteps[0]?.id ?? '');
	});
	const busy = $derived(operation || status === 'validating' || status === 'submitting');
	function snapshot() {
		const start = current;
		const ids = enabledSteps.map((step) => step.id).join('\0');
		const form = ref;
		return () =>
			!!ref &&
			ref === form &&
			!disabled &&
			current === start &&
			ids === enabledSteps.map((step) => step.id).join('\0');
	}

	onMount(() => {
		const restored = persistence?.read();
		if (restored && enabledSteps.some((step) => step.id === restored)) {
			commit(restored, 'programmatic');
		}
	});

	function getPanel(id: string) {
		return ref?.querySelector<HTMLElement>(`[data-stepped-form-step="${CSS.escape(id)}"]`);
	}

	async function focusHeading(id: string) {
		await tick();
		getPanel(id)
			?.querySelector<HTMLElement>('[data-slot="stepped-form-title"]')
			?.focus({ preventScroll: true });
	}

	function normalizeResult(
		result: SteppedFormValidationResult
	): Exclude<SteppedFormValidationResult, boolean | string> {
		if (typeof result === 'boolean') return { valid: result };
		if (typeof result === 'string') return { valid: false, message: result };
		return result;
	}

	function focusInvalid(stepId: string, field?: HTMLElement | string) {
		invalidField = field;
		const panel = getPanel(stepId);
		const target =
			typeof field === 'string'
				? panel?.querySelector<HTMLElement>(field)
				: (field ??
					panel?.querySelector<HTMLElement>(
						'[aria-invalid="true"], input:invalid, select:invalid, textarea:invalid'
					));
		(target && panel?.contains(target)
			? target
			: panel?.querySelector<HTMLElement>('[data-slot="stepped-form-title"]')
		)?.focus({
			preventScroll: false
		});
	}

	async function validate(id: string, fresh: () => boolean) {
		const step = enabledSteps.find((candidate) => candidate.id === id);
		if (!step || !ref) return false;

		status = 'validating';
		message = `Checking ${step.title}`;
		const panel = getPanel(id);
		const invalid = panel?.querySelector<HTMLElement>(
			'input:invalid, select:invalid, textarea:invalid'
		);
		if (invalid) {
			status = 'error';
			message = `Review the fields in ${step.title}.`;
			focusInvalid(id, invalid);
			return false;
		}

		const validator = validators.get(id) ?? validateStep;
		if (validator) {
			try {
				const result = normalizeResult(
					await validator({ step, value: id, form: ref, formData: new FormData(ref) })
				);
				if (!fresh()) return false;
				if (!result.valid) {
					status = 'error';
					message = result.message ?? `Review the fields in ${step.title}.`;
					focusInvalid(id, result.field);
					return false;
				}
			} catch (error) {
				if (!fresh()) return false;
				status = 'error';
				message = error instanceof Error ? error.message : `We could not validate ${step.title}.`;
				focusInvalid(id);
				return false;
			}
		}

		status = 'idle';
		message = '';
		return true;
	}

	function commit(id: string, reason: 'next' | 'previous' | 'progress' | 'programmatic') {
		const previous = current;
		const previousIndex = enabledSteps.findIndex((step) => step.id === previous);
		const nextIndex = enabledSteps.findIndex((step) => step.id === id);
		if (nextIndex < 0 || previous === id) return;
		direction = nextIndex > previousIndex ? 'forward' : 'backward';
		internalValue = id;
		value = id;
		persistence?.write(id);
		onValueChange?.(id, previous, reason);
		message = `Step ${nextIndex + 1} of ${enabledSteps.length}: ${enabledSteps[nextIndex].title}`;
		void focusHeading(id);
	}

	async function goTo(
		id: string,
		reason: 'next' | 'previous' | 'progress' | 'programmatic' = 'programmatic'
	) {
		if (disabled || busy) return false;
		const fromIndex = enabledSteps.findIndex((step) => step.id === current);
		const toIndex = enabledSteps.findIndex((step) => step.id === id);
		if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return false;
		if (toIndex < fromIndex) {
			commit(id, reason);
			return true;
		}
		if (!nonlinear && toIndex !== fromIndex + 1) return false;
		if (nonlinear && toIndex > fromIndex + 1 && !completed.includes(enabledSteps[toIndex - 1]?.id))
			return false;
		const from = enabledSteps[fromIndex];
		const to = enabledSteps[toIndex];
		const fresh = snapshot();
		operation = true;
		retryAction = () => goTo(id, reason);
		try {
			if (canNavigate && !(await canNavigate({ from, to, completed: [...completed] })))
				return false;
			if (!fresh() || !(await validate(from.id, fresh)) || !fresh()) return false;
			if (!completed.includes(from.id)) completed = [...completed, from.id];
			commit(id, reason);
			return true;
		} catch (error) {
			if (fresh()) {
				status = 'error';
				message = error instanceof Error ? error.message : 'Navigation could not be checked.';
			}
			return false;
		} finally {
			operation = false;
			if (status === 'validating') {
				status = 'idle';
				message = '';
			}
		}
	}

	async function next() {
		const index = enabledSteps.findIndex((step) => step.id === current);
		const target = enabledSteps[index + 1];
		return target ? goTo(target.id, 'next') : false;
	}

	async function previous() {
		const index = enabledSteps.findIndex((step) => step.id === current);
		const target = enabledSteps[index - 1];
		if (!target || disabled || busy) return false;
		commit(target.id, 'previous');
		return true;
	}

	async function submit() {
		if (disabled || busy || !ref) return;
		retryAction = submit;
		const fresh = snapshot();
		operation = true;
		try {
			for (const step of enabledSteps) {
				if (!(await validate(step.id, fresh))) {
					if (!fresh()) return;
					const errorMessage = message;
					const field = invalidField;
					if (current !== step.id) commit(step.id, 'programmatic');
					message = errorMessage;
					await tick();
					focusInvalid(step.id, field);
					return;
				}
			}
			if (!fresh()) return;
			status = 'submitting';
			message = 'Submitting form';
			try {
				await onSubmit?.({
					value: current,
					form: ref,
					formData: new FormData(ref),
					steps: enabledSteps
				});
				if (!fresh()) return;
				status = 'success';
				message = 'Form submitted successfully.';
			} catch (error) {
				if (!fresh()) return;
				status = 'error';
				message = error instanceof Error ? error.message : 'The form could not be submitted.';
			}
		} finally {
			operation = false;
			if (status === 'validating' || status === 'submitting') {
				status = 'idle';
				message = '';
			}
		}
	}

	async function retry() {
		await retryAction?.();
	}

	const attachForm: Attachment<HTMLFormElement> = (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	};

	setSteppedFormContext({
		getSteps: () => enabledSteps,
		getTitleId: titleId,
		getCurrent: () => current,
		getDirection: () => direction,
		getStatus: () => status,
		getMessage: () => message,
		getDisabled: () => disabled || busy,
		getCompleted: () => completed,
		goTo,
		next,
		previous,
		retry,
		registerValidator: (id, validator) => {
			if (validator) validators.set(id, validator);
			return () => validators.delete(id);
		}
	});
</script>

<form
	{@attach attachForm}
	data-slot="stepped-form"
	data-status={status}
	data-ready={!!ref}
	aria-busy={busy}
	class={cn('flex w-full flex-col gap-6', className)}
	onsubmit={(event) => {
		event.preventDefault();
		void (current === enabledSteps.at(-1)?.id ? submit() : next());
	}}
	novalidate
	{...restProps}
>
	{@render children?.()}
</form>
