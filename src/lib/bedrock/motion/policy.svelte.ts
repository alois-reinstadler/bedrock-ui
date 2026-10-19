import { getContext, setContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import type { Attachment } from 'svelte/attachments';
import { REDUCED_MOTION_QUERY } from './policy.js';

const motionPolicyKey = Symbol('bedrock-motion-policy');

export interface MotionPolicy {
	readonly reduced: boolean;
	/** Apply to a portal's moving root; context survives DOM relocation. */
	readonly attach: Attachment<HTMLElement>;
}

function createPolicy(
	parent?: MotionPolicy,
	applicationReduced: () => boolean = () => false
): MotionPolicy {
	const os = new MediaQuery(REDUCED_MOTION_QUERY, false);
	const policy: MotionPolicy = {
		get reduced() {
			return Boolean(parent?.reduced || applicationReduced() || os.current);
		},
		attach(element) {
			const previous = element.getAttribute('data-bedrock-motion');
			// Attachments track reads and rerun when the policy changes.
			element.setAttribute('data-bedrock-motion', policy.reduced ? 'reduced' : 'full');
			return () => {
				if (previous === null) element.removeAttribute('data-bedrock-motion');
				else element.setAttribute('data-bedrock-motion', previous);
			};
		}
	};
	return policy;
}

/** Call during component initialization. No provider is required to respect OS preference. */
export function useMotionPolicy(): MotionPolicy {
	return getContext<MotionPolicy | undefined>(motionPolicyKey) ?? createPolicy();
}

/** A scope may reduce movement, but cannot re-enable it beneath a reduced parent. */
export function provideMotionPolicy(applicationReduced: () => boolean): MotionPolicy {
	const parent = getContext<MotionPolicy | undefined>(motionPolicyKey);
	const policy = createPolicy(parent, applicationReduced);
	setContext(motionPolicyKey, policy);
	return policy;
}
