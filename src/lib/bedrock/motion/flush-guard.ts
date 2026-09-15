export type FlushReason =
	| 'mutation'
	| 'transition'
	| 'registration'
	| 'unregistration'
	| 'resize'
	| 'scroll'
	| 'preference'
	| 'internal';

type FlushSample = {
	at: number;
	cost: number;
	reason: FlushReason;
};

export type FlushGuardState = {
	samples: FlushSample[];
	suppressedUntil: number;
	episode: number;
};

export type FlushGuardStats = {
	count: number;
	span: number;
	cost: number;
	reason: FlushReason;
	episode: number;
};

const SAMPLE_WINDOW_MS = 250;
const DENSITY_MIN_COUNT = 6;
const DENSITY_MIN_SPAN_MS = 80;
const DENSITY_MAX_AVERAGE_GAP_MS = 34;
const COST_MIN_COUNT = 3;
const COST_LIMIT_MS = 48;
const QUIET_MS = 120;

export function createFlushGuardState(): FlushGuardState {
	return { samples: [], suppressedUntil: 0, episode: 0 };
}

function resetAfterQuiet(state: FlushGuardState, now: number) {
	if (state.suppressedUntil > 0 && now >= state.suppressedUntil) {
		state.samples = [];
		state.suppressedUntil = 0;
	}
}

function prune(state: FlushGuardState, now: number) {
	state.samples = state.samples.filter((sample) => now - sample.at <= SAMPLE_WINDOW_MS);
}

function dominantReason(samples: FlushSample[]): FlushReason {
	const counts = new Map<FlushReason, number>();
	for (const sample of samples) counts.set(sample.reason, (counts.get(sample.reason) ?? 0) + 1);
	return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'internal';
}

function stats(state: FlushGuardState): FlushGuardStats {
	const first = state.samples[0]?.at ?? 0;
	const last = state.samples[state.samples.length - 1]?.at ?? first;
	return {
		count: state.samples.length,
		span: last - first,
		cost: state.samples.reduce((total, sample) => total + sample.cost, 0),
		reason: dominantReason(state.samples),
		episode: state.episode
	};
}

export function shouldSuppressAnimatedFlush(state: FlushGuardState, now: number): boolean {
	resetAfterQuiet(state, now);
	if (now >= state.suppressedUntil) return false;
	state.suppressedUntil = now + QUIET_MS;
	return true;
}

export function recordAnimatedFlush(
	state: FlushGuardState,
	at: number,
	cost: number,
	reason: FlushReason
): FlushGuardStats | null {
	resetAfterQuiet(state, at);
	const latest = state.samples[state.samples.length - 1];
	if (latest && at - latest.at >= QUIET_MS) state.samples = [];
	prune(state, at);
	state.samples.push({ at, cost: Math.max(0, cost), reason });

	const current = stats(state);
	const averageGap = current.count > 1 ? current.span / (current.count - 1) : Infinity;
	const dense =
		current.count >= DENSITY_MIN_COUNT &&
		current.span >= DENSITY_MIN_SPAN_MS &&
		averageGap <= DENSITY_MAX_AVERAGE_GAP_MS;
	const costly = current.count >= COST_MIN_COUNT && current.cost >= COST_LIMIT_MS;
	if (!dense && !costly) return null;

	state.suppressedUntil = at + QUIET_MS;
	state.episode += 1;
	return { ...current, episode: state.episode };
}
