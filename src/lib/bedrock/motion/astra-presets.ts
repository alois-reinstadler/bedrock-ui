import { motionRecipes } from './tokens.js';

/** Astra's duration unit is seconds. Convert once at this boundary. */
export const astraPresets = {
	feedback: { duration: motionRecipes.feedback.duration / 1000 },
	labelReplacement: {
		duration: motionRecipes.labelReplacement.duration / 1000,
		ease: [...motionRecipes.labelReplacement.easing] as [number, number, number, number]
	},
	disclosure: {
		duration: motionRecipes.disclosure.duration / 1000,
		ease: [...motionRecipes.disclosure.easing] as [number, number, number, number]
	},
	relocation: { type: 'spring' as const, ...motionRecipes.relocation.spring },
	contentReplacement: { type: 'spring' as const, ...motionRecipes.contentReplacement.spring },
	gestureSettlement: { type: 'spring' as const, ...motionRecipes.gestureSettlement.spring }
};
