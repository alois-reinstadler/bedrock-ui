/** Explicit opt-in to Astra RC3 native bindings and its animation engine. */
import { motion } from 'astra-motion/state';
export { default as MotionButton } from './CssButton.svelte';
export { default as MotionPanel } from './CssPanel.svelte';
export { motion };
export type { MotionOptions, MotionBinding } from 'astra-motion/state';
/** Compatibility alias for the previous binding factory. */
export const createMotion = motion.bind;
