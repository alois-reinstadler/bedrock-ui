import { getContext, setContext } from 'svelte';
import type { InputMode, MotionPreference, StressMode, TimeScale } from './types.js';

const MOTION_LAB_CONTEXT = Symbol('motion-lab');

export class MotionLabState {
	timeScale = $state<TimeScale>(1);
	preference = $state<MotionPreference>('normal');
	inputMode = $state<InputMode>('pointer');
	stressMode = $state<StressMode>('normal');
	paused = $state(false);
	replayKey = $state(0);

	replay() {
		this.paused = false;
		this.replayKey += 1;
	}

	reset() {
		this.timeScale = 1;
		this.preference = 'normal';
		this.inputMode = 'pointer';
		this.stressMode = 'normal';
		this.paused = false;
		this.replayKey += 1;
	}
}

export function provideMotionLabState() {
	return setContext(MOTION_LAB_CONTEXT, new MotionLabState());
}

export function useMotionLabState() {
	return getContext<MotionLabState>(MOTION_LAB_CONTEXT);
}
