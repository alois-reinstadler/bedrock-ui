import type { Attachment } from 'svelte/attachments';
import {
	boxFromRect,
	boxesEqual,
	constrainInvert,
	hasScaleInvert,
	interpolateBox,
	invertTransform,
	isDegenerateBox,
	isSignificantInvert,
	localProjection,
	projectionBetween,
	projectionToInvert,
	springSamples,
	type Invert,
	type LayoutBox,
	type LayoutType,
	type Projection,
	type SpringOptions
} from './layout-math.js';
import { prefersReducedMotion } from './policy.js';
import { motionPresets, type LayoutMotion } from './tokens.js';
import { describeLayoutGroup, motionDiagnostics } from './diagnostics.js';
import {
	createFlushGuardState,
	recordAnimatedFlush,
	shouldSuppressAnimatedFlush,
	type FlushReason
} from './flush-guard.js';
import {
	clearCommittedLayoutOffset,
	commitLayoutOffset,
	isLayoutExit,
	registerLayoutExitHandler,
	registerVisualOffsetReader
} from './layout-offset.js';

export type LayoutOptions = {
	id?: string;
	type?: LayoutType;
	transition?: LayoutMotion;
};

type ProjectionState = {
	from: LayoutBox;
	to: LayoutBox;
	transition: LayoutMotion;
	samples: number[];
	elapsedOffset: number;
	playbackDuration: number;
	animation: Animation | null;
	contentAnimation: Animation | null;
	timeSource: Animation | null;
	finishAnimation: Animation | null;
	finishHandler: (() => void) | null;
	playbackRevision: number;
	lastCurrentTime: number;
};

type LayoutNode = {
	el: HTMLElement;
	options: LayoutOptions;
	lastLayout: LayoutBox;
	projection: ProjectionState | null;
	sharedResolved: boolean;
	committedFlush: number;
	committedWidth: number;
	committedHeight: number;
	owner: number;
	generation: number;
};

type SharedSnapshot = {
	box: LayoutBox;
	at: number;
	owner: number;
	generation: number;
};

type LayoutJob = {
	node: LayoutNode;
	from: LayoutBox;
	to: LayoutBox;
	transition: LayoutMotion;
	samples: number[];
	parent: LayoutNode | null;
	elapsed: number;
};

type AnimationSnapshot = {
	animation: Animation;
	startTime: CSSNumberish | null;
	currentTime: CSSNumberish | null;
	playState: AnimationPlayState;
	playbackRate: number;
};

type ProjectionSnapshot = {
	projection: ProjectionState;
	visual: LayoutBox;
	outer: AnimationSnapshot | null;
	content: AnimationSnapshot | null;
};

type FlushMode = 'animate' | 'baseline';

const SHARED_TTL_MS = 480;
const DEFAULT_TRANSITION: LayoutMotion = motionPresets.layout;
const DISCRETE_RESIZE_GRACE_MS = 48;
const groups = new WeakMap<HTMLElement, LayoutGroupHandle>();
// Motion curves are immutable and shared by semantic tokens across groups.
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const springSampleCache = new Map<string, number[]>();
const linearEasingCache = new WeakMap<number[], string>();
let linearEasingSupported: boolean | undefined;

export type LayoutGroupHandle = {
	bindRoot: (element: HTMLElement) => () => void;
	register: (el: HTMLElement, options?: LayoutOptions) => () => void;
	destroy: () => void;
};

class MissingLayoutGroupError extends Error {}

function findGroup(from: HTMLElement): LayoutGroupHandle {
	let node: HTMLElement | null = from;
	while (node) {
		const group = groups.get(node);
		if (group) return group;
		node = node.parentElement;
	}
	throw new MissingLayoutGroupError(motionDiagnostics.missingGroup);
}

function styleWithoutAnimation(value: string): string {
	return value.replace(/(?:^|;)\s*animation(?:-[\w-]+)?\s*:[^;]*/gi, '').replace(/\s+/g, '');
}

function sampleProgress(samples: number[], progress: number): number {
	if (progress <= 0) return 0;
	if (progress >= 1) return 1;
	const position = progress * (samples.length - 1);
	const index = Math.floor(position);
	const a = samples[index] ?? 1;
	const b = samples[index + 1] ?? 1;
	return a + (b - a) * (position - index);
}

function boxFromInvert(target: LayoutBox, invert: Invert): LayoutBox {
	return {
		left: target.left + invert.dx,
		top: target.top + invert.dy,
		width: target.width * invert.sx,
		height: target.height * invert.sy
	};
}

function constrainedStart(from: LayoutBox, to: LayoutBox, type: LayoutType): LayoutBox {
	return boxFromInvert(to, constrainInvert(invertTransform(from, to), type));
}

function transitionIsValid(value: LayoutMotion): boolean {
	const { duration, spring } = value;
	return (
		Number.isFinite(duration) &&
		duration >= 0 &&
		Number.isFinite(spring.stiffness) &&
		spring.stiffness > 0 &&
		Number.isFinite(spring.damping) &&
		spring.damping >= 0 &&
		Number.isFinite(spring.mass) &&
		spring.mass > 0
	);
}

function cachedSpringSamples(spring: SpringOptions): number[] {
	const key = `${spring.stiffness}:${spring.damping}:${spring.mass}`;
	let samples = springSampleCache.get(key);
	if (!samples) {
		samples = springSamples(spring);
		springSampleCache.set(key, samples);
	}
	return samples;
}

function supportsLinearEasing(): boolean {
	return (linearEasingSupported ??=
		typeof CSS !== 'undefined' && CSS.supports('animation-timing-function', 'linear(0, 1)'));
}

function springLinearEasing(samples: number[]): string {
	let easing = linearEasingCache.get(samples);
	if (!easing) {
		easing = `linear(${samples.map((sample) => Number(sample.toFixed(6))).join(', ')})`;
		linearEasingCache.set(samples, easing);
	}
	return easing;
}

export function createLayoutGroup(): LayoutGroupHandle {
	// Internal registries do not drive rendering; Svelte's reactive collections would add no value.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const nodes = new Set<LayoutNode>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const nodesByElement = new Map<HTMLElement, LayoutNode>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const shared = new Map<string, SharedSnapshot>();
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const warned = new Set<string>();
	let mutationObserver: MutationObserver | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let motionQuery: MediaQueryList | null = null;
	let applying = false;
	let bound: HTMLElement | null = null;
	let frame = 0;
	let pendingMode: FlushMode = 'baseline';
	let pendingReason: FlushReason = 'internal';
	let baselineDominates = false;
	let dirty = false;
	let lastDiscreteAt = Number.NEGATIVE_INFINITY;
	let ownerSequence = 0;
	let generationSequence = 0;
	let flushSequence = 0;
	let committedRootWidth = 0;
	let committedRootHeight = 0;
	const flushGuard = createFlushGuardState();

	function warnOnce(key: string, message: string, subject: Element | null = bound) {
		if (!import.meta.env.DEV || warned.has(key)) return;
		warned.add(key);
		console.warn(`[Bedrock motion] ${message}`, subject);
	}

	function rootOrigin(): { left: number; top: number } {
		if (!bound || !bound.isConnected) return { left: 0, top: 0 };
		const rect = bound.getBoundingClientRect();
		return { left: rect.left, top: rect.top };
	}

	function relativeBox(rect: DOMRectReadOnly, origin: { left: number; top: number }): LayoutBox {
		const box = boxFromRect(rect);
		box.left -= origin.left;
		box.top -= origin.top;
		return box;
	}

	// Boxes are measured in layout space: ancestor scroll offsets up to and
	// including the group root are added back so scrolling a container never
	// reads as a layout change (it would otherwise snap in-flight projections
	// and stash scroll-shifted shared geometry). Nodes in differently scrolled
	// containers therefore fly along layout-space paths, which is the stable
	// choice for in-group scrollers.
	function scrollCompensation(el: HTMLElement): { left: number; top: number } {
		let left = 0;
		let top = 0;
		let node: HTMLElement | null = el.parentElement;
		while (node) {
			left += node.scrollLeft;
			top += node.scrollTop;
			if (node === bound) break;
			node = node.parentElement;
		}
		return { left, top };
	}

	function measure(el: HTMLElement, origin: { left: number; top: number }): LayoutBox {
		const box = relativeBox(el.getBoundingClientRect(), origin);
		const scrolled = scrollCompensation(el);
		box.left += scrolled.left;
		box.top += scrolled.top;
		return box;
	}

	function matchesCommittedResize(entry: ResizeObserverEntry): boolean {
		const size = entry.borderBoxSize?.[0];
		if (!size) return false;
		const node = entry.target instanceof HTMLElement ? nodesByElement.get(entry.target) : undefined;
		const width = entry.target === bound ? committedRootWidth : node?.committedWidth;
		const height = entry.target === bound ? committedRootHeight : node?.committedHeight;
		if (width === undefined || height === undefined) return false;
		const direct =
			Math.abs(size.inlineSize - width) < 0.75 && Math.abs(size.blockSize - height) < 0.75;
		const vertical =
			Math.abs(size.inlineSize - height) < 0.75 && Math.abs(size.blockSize - width) < 0.75;
		return direct || vertical;
	}

	function pruneShared(now = performance.now()) {
		for (const [id, snapshot] of shared) {
			if (now - snapshot.at > SHARED_TTL_MS) shared.delete(id);
		}
	}

	function takeShared(id: string, owner: number): LayoutBox | undefined {
		const snapshot = shared.get(id);
		if (!snapshot || snapshot.owner === owner) return undefined;
		shared.delete(id);
		if (performance.now() - snapshot.at > SHARED_TTL_MS) return undefined;
		if (isDegenerateBox(snapshot.box)) return undefined;
		return snapshot.box;
	}

	function stashShared(node: LayoutNode, box: LayoutBox) {
		const id = node.options.id;
		if (!id || isDegenerateBox(box)) return;
		let current = shared.get(id);
		if (current && performance.now() - current.at > SHARED_TTL_MS) {
			shared.delete(id);
			current = undefined;
		}
		if (current && current.generation > node.generation) return;
		shared.set(id, {
			box,
			at: performance.now(),
			owner: node.owner,
			generation: node.generation
		});
	}

	function contentEl(node: LayoutNode): HTMLElement | null {
		return node.el.querySelector(':scope > [data-layout-invert]');
	}

	function detachProjectionFinish(projection: ProjectionState) {
		if (
			projection.finishAnimation &&
			projection.finishHandler &&
			projection.finishAnimation.onfinish === projection.finishHandler
		) {
			projection.finishAnimation.onfinish = null;
		}
		projection.finishAnimation = null;
		projection.finishHandler = null;
	}

	function clearProjection(node: LayoutNode, projection: ProjectionState) {
		if (node.projection !== projection) return;
		detachProjectionFinish(projection);
		projection.playbackRevision += 1;
		projection.animation?.cancel();
		projection.contentAnimation?.cancel();
		node.projection = null;
	}

	function stop(node: LayoutNode) {
		const projection = node.projection;
		if (!projection) return;
		node.projection = null;
		detachProjectionFinish(projection);
		projection.playbackRevision += 1;
		projection.animation?.cancel();
		projection.contentAnimation?.cancel();
	}

	function projectionCurrentTime(projection: ProjectionState): number {
		const primary = projection.animation ?? projection.contentAnimation ?? projection.timeSource;
		if (typeof primary?.currentTime === 'number') {
			projection.lastCurrentTime = primary.currentTime;
			return primary.currentTime;
		}
		if (primary) return projection.lastCurrentTime;
		if (projection.lastCurrentTime > 0) return projection.lastCurrentTime;
		return projection.lastCurrentTime;
	}

	function currentVisual(node: LayoutNode): LayoutBox | null {
		const projection = node.projection;
		if (!projection) return null;
		const elapsed = projection.elapsedOffset + projectionCurrentTime(projection);
		const linear =
			projection.transition.duration === 0 ? 1 : elapsed / projection.transition.duration;
		const progress = sampleProgress(projection.samples, linear);
		return interpolateBox(projection.from, projection.to, progress);
	}

	function snapshotAnimation(animation: Animation | null): AnimationSnapshot | null {
		if (!animation) return null;
		return {
			animation,
			startTime: animation.startTime,
			currentTime: animation.currentTime,
			playState: animation.playState,
			playbackRate: animation.playbackRate
		};
	}

	function captureProjection(node: LayoutNode): ProjectionSnapshot | null {
		const projection = node.projection;
		if (!projection) return null;
		const visual = currentVisual(node);
		if (!visual) return null;
		const snapshot: ProjectionSnapshot = {
			projection,
			visual,
			outer: snapshotAnimation(projection.animation),
			content: snapshotAnimation(projection.contentAnimation)
		};
		return snapshot;
	}

	function suspendProjection(snapshot: ProjectionSnapshot) {
		const { projection } = snapshot;
		detachProjectionFinish(projection);
		projection.playbackRevision += 1;
		projection.animation?.cancel();
		projection.contentAnimation?.cancel();
	}

	function restoreAnimation(snapshot: AnimationSnapshot | null) {
		if (!snapshot) return;
		const { animation } = snapshot;
		animation.playbackRate = snapshot.playbackRate;
		if (snapshot.playState === 'running' && snapshot.startTime !== null) {
			animation.startTime = snapshot.startTime;
			return;
		}
		animation.currentTime = snapshot.currentTime;
		if (snapshot.playState === 'running') animation.play();
		else if (snapshot.playState === 'paused') animation.pause();
	}

	function watchProjection(node: LayoutNode, projection: ProjectionState) {
		const primary = projection.animation ?? projection.contentAnimation ?? projection.timeSource;
		if (!primary) return;
		const revision = ++projection.playbackRevision;
		const finish = () => {
			if (node.projection === projection && projection.playbackRevision === revision) {
				clearProjection(node, projection);
			}
		};
		projection.finishAnimation = primary;
		projection.finishHandler = finish;
		if (primary === projection.animation || primary === projection.contentAnimation) {
			primary.onfinish = finish;
		} else {
			// An inherited child cannot take ownership of its ancestor's handler.
			primary.finished.then(finish).catch(() => undefined);
		}
	}

	function restoreProjection(node: LayoutNode, snapshot: ProjectionSnapshot) {
		const { projection } = snapshot;
		if (node.projection !== projection) return;
		const primarySnapshot = snapshot.outer ?? snapshot.content;
		if (
			(primarySnapshot && ['finished', 'idle'].includes(primarySnapshot.playState)) ||
			(!primarySnapshot && projection.lastCurrentTime >= projection.playbackDuration)
		) {
			stop(node);
			return;
		}
		restoreAnimation(snapshot.outer);
		restoreAnimation(snapshot.content);
		watchProjection(node, projection);
	}

	function nearestLayoutParent(node: LayoutNode): LayoutNode | null {
		let parent = node.el.parentElement;
		while (parent && parent !== bound) {
			const registered = nodesByElement.get(parent);
			if (registered) return registered;
			parent = parent.parentElement;
		}
		return null;
	}

	function transitionFor(node: LayoutNode): LayoutMotion {
		const transition = node.options.transition ?? DEFAULT_TRANSITION;
		if (transitionIsValid(transition)) return transition;
		warnOnce('invalid-transition', motionDiagnostics.invalidTransition, node.el);
		return DEFAULT_TRANSITION;
	}

	function worldProjectionAt(job: LayoutJob, elapsed: number): Projection {
		const ownElapsed = job.elapsed + elapsed;
		const linear = job.transition.duration === 0 ? 1 : ownElapsed / job.transition.duration;
		const progress = sampleProgress(job.samples, linear);
		return projectionBetween(interpolateBox(job.from, job.to, progress), job.to);
	}

	function localInvertAt(
		job: LayoutJob,
		jobsByNode: Map<LayoutNode, LayoutJob>,
		elapsed: number
	): { local: Invert; world: Projection } {
		const world = worldProjectionAt(job, elapsed);
		let parent = job.parent;
		let parentJob: LayoutJob | undefined;
		while (parent && !parentJob) {
			parentJob = jobsByNode.get(parent);
			parent = parentJob ? null : nearestLayoutParent(parent);
		}
		const local = parentJob ? localProjection(world, worldProjectionAt(parentJob, elapsed)) : world;
		return { local: projectionToInvert(local, job.to), world };
	}

	function usedRadiusPx(el: HTMLElement, box: LayoutBox): number | null {
		const style = getComputedStyle(el);
		const raw = style.borderTopLeftRadius;
		if (!raw.endsWith('px')) return null;
		if (
			style.borderTopRightRadius !== raw ||
			style.borderBottomLeftRadius !== raw ||
			style.borderBottomRightRadius !== raw
		) {
			return null;
		}
		const specified = Number.parseFloat(raw);
		if (!specified) return null;
		return Math.min(specified, box.width / 2, box.height / 2);
	}

	function animatedParentJob(
		job: LayoutJob,
		jobsByNode: Map<LayoutNode, LayoutJob>
	): LayoutJob | undefined {
		let parent = job.parent;
		while (parent) {
			const found = jobsByNode.get(parent);
			if (found) return found;
			parent = nearestLayoutParent(parent);
		}
		return undefined;
	}

	function remainingJobDuration(job: LayoutJob, jobsByNode: Map<LayoutNode, LayoutJob>): number {
		const own = Math.max(0, job.transition.duration - job.elapsed);
		const parent = animatedParentJob(job, jobsByNode);
		return Math.max(own, parent ? remainingJobDuration(parent, jobsByNode) : 0);
	}

	function jobSampleTimes(
		job: LayoutJob,
		jobsByNode: Map<LayoutNode, LayoutJob>,
		duration: number
	): number[] {
		// Frame-local sample collection does not drive rendering.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const times = new Set<number>([0, duration]);
		for (let elapsed = 1000 / 60; elapsed < duration; elapsed += 1000 / 60) {
			times.add(elapsed);
		}
		let current: LayoutJob | undefined = job;
		while (current) {
			const last = Math.max(1, current.samples.length - 1);
			for (let index = 0; index <= last; index += 1) {
				const absolute = (index / last) * current.transition.duration;
				const relative = absolute - current.elapsed;
				if (relative > 0 && relative < duration) times.add(relative);
			}
			current = animatedParentJob(current, jobsByNode);
		}
		return [...times].sort((a, b) => a - b);
	}

	function crossesCorrectionBoundary(node: LayoutNode): boolean {
		let ancestor = nearestLayoutParent(node);
		while (ancestor) {
			if (contentEl(ancestor)?.contains(node.el)) return true;
			ancestor = nearestLayoutParent(ancestor);
		}
		return false;
	}

	function startJobs(jobs: LayoutJob[]) {
		if (jobs.length === 0) return;
		// A frame-local lookup table does not drive rendering.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const jobsByNode = new Map(jobs.map((job) => [job.node, job]));
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const animatedParents = new Set<LayoutNode>();
		for (const job of jobs) {
			const parent = animatedParentJob(job, jobsByNode);
			if (parent) animatedParents.add(parent.node);
		}
		const prepared = jobs
			.map((job) => {
				const playbackDuration = remainingJobDuration(job, jobsByNode);
				if (playbackDuration <= 0) return null;
				const fastPosition =
					job.elapsed === 0 &&
					job.node.options.type === 'position' &&
					job.parent === null &&
					!animatedParents.has(job.node) &&
					supportsLinearEasing();
				const times = fastPosition
					? [0, playbackDuration]
					: jobSampleTimes(job, jobsByNode, playbackDuration);
				const frames = times.map((elapsed) => ({
					elapsed,
					...localInvertAt(job, jobsByNode, elapsed)
				}));
				const inner = contentEl(job.node);
				const needsRadiusRead = frames.some(({ world }) =>
					hasScaleInvert(projectionToInvert(world, job.to))
				);
				if (crossesCorrectionBoundary(job.node)) {
					warnOnce(
						'nested-counter-boundary',
						motionDiagnostics.nestedCorrectionBoundary,
						job.node.el
					);
				}
				return {
					job,
					playbackDuration,
					frames,
					inner,
					fastEasing: fastPosition ? springLinearEasing(job.samples) : 'linear',
					needsRadiusRead,
					radius: null as number | null
				};
			})
			.filter((value) => value !== null);

		// All computed-style reads happen before the first WAAPI write.
		for (const item of prepared) {
			if (item.needsRadiusRead) item.radius = usedRadiusPx(item.job.node.el, item.job.to);
		}

		const keyframed = prepared.map((item) => {
			const { job, playbackDuration, frames, inner, fastEasing, radius } = item;
			const first = frames[0]!;
			const outerSignificant = frames.some(
				({ local, world }) =>
					isSignificantInvert(local) ||
					(Boolean(radius) && hasScaleInvert(projectionToInvert(world, job.to)))
			);
			const outerKeyframes: Keyframe[] = outerSignificant
				? frames.map(({ elapsed, local, world }) => {
						const sx = Math.max(Math.abs(world.sx), 0.001);
						const sy = Math.max(Math.abs(world.sy), 0.001);
						return {
							offset: elapsed / playbackDuration,
							transformOrigin: '0 0',
							transform: `translate(${local.dx}px, ${local.dy}px) scale(${local.sx}, ${local.sy})`,
							...(hasScaleInvert(projectionToInvert(world, job.to))
								? {
										zIndex: first.world.sx * first.world.sy < 1 ? '2' : '1',
										...(radius ? { borderRadius: `${radius / sx}px / ${radius / sy}px` } : {})
									}
								: {})
						};
					})
				: [];
			const contentSignificant = Boolean(
				inner && frames.some(({ world }) => hasScaleInvert(projectionToInvert(world, job.to)))
			);
			const contentKeyframes: Keyframe[] = contentSignificant
				? frames.map(({ elapsed, world }) => ({
						offset: elapsed / playbackDuration,
						transformOrigin: '0 0',
						transform: `scale(${world.sx === 0 ? 1 : 1 / world.sx}, ${
							world.sy === 0 ? 1 : 1 / world.sy
						})`
					}))
				: [];
			return { job, playbackDuration, inner, fastEasing, outerKeyframes, contentKeyframes };
		});

		const started: Array<{ node: LayoutNode; projection: ProjectionState }> = [];
		for (const item of keyframed) {
			const { job, playbackDuration, inner, fastEasing, outerKeyframes, contentKeyframes } = item;
			const { node, transition, samples } = job;
			const projection: ProjectionState = {
				from: job.from,
				to: job.to,
				transition,
				samples,
				elapsedOffset: job.elapsed,
				playbackDuration,
				animation: null,
				contentAnimation: null,
				timeSource: null,
				finishAnimation: null,
				finishHandler: null,
				playbackRevision: 0,
				lastCurrentTime: 0
			};
			node.projection = projection;

			try {
				if (outerKeyframes.length > 0 && typeof node.el.animate === 'function') {
					projection.animation = node.el.animate(outerKeyframes, {
						duration: playbackDuration,
						easing: fastEasing,
						fill: 'both'
					});
				}
				if (contentKeyframes.length > 0 && inner && typeof inner.animate === 'function') {
					projection.contentAnimation = inner.animate(contentKeyframes, {
						duration: playbackDuration,
						easing: 'linear',
						fill: 'both'
					});
				}
			} catch {
				warnOnce('waapi-fallback', motionDiagnostics.waapiFallback, node.el);
				clearProjection(node, projection);
				continue;
			}
			started.push({ node, projection });
		}

		function resolveTimeSource(job: LayoutJob | undefined): Animation | null {
			if (!job) return null;
			const projection = job.node.projection;
			if (!projection) return null;
			const owned = projection.animation ?? projection.contentAnimation;
			if (owned) return owned;
			if (projection.timeSource) return projection.timeSource;
			projection.timeSource = resolveTimeSource(animatedParentJob(job, jobsByNode) ?? undefined);
			return projection.timeSource;
		}

		for (const { node, projection } of started) {
			if (!projection.animation && !projection.contentAnimation) {
				projection.timeSource = resolveTimeSource(
					animatedParentJob(jobsByNode.get(node)!, jobsByNode) ?? undefined
				);
			}
			if (projection.animation || projection.contentAnimation || projection.timeSource) {
				watchProjection(node, projection);
			} else {
				// Without a WAAPI clock there was no painted projection to preserve.
				// The DOM already occupies its final box, so retain no phantom timeline.
				clearProjection(node, projection);
			}
		}
	}

	function flush(mode: FlushMode) {
		if (nodes.size === 0 || !bound) return;
		applying = true;
		try {
			pruneShared();
			const currentFlush = ++flushSequence;
			// Frame-local measurement state does not drive rendering.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const snapshots = new Map<LayoutNode, ProjectionSnapshot>();
			for (const node of nodes) {
				const snapshot = captureProjection(node);
				if (snapshot) snapshots.set(node, snapshot);
			}
			for (const snapshot of snapshots.values()) suspendProjection(snapshot);

			const origin = rootOrigin();
			committedRootWidth = bound.offsetWidth;
			committedRootHeight = bound.offsetHeight;
			// Frame-local measurement state does not drive rendering.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const targets = new Map<LayoutNode, LayoutBox>();
			// One read phase: target measurements cannot include an engine-owned transform.
			for (const node of nodes) {
				if (!node.el.isConnected) continue;
				targets.set(node, measure(node.el, origin));
				node.committedWidth = node.el.offsetWidth;
				node.committedHeight = node.el.offsetHeight;
				if (!isLayoutExit(node.el)) commitLayoutOffset(node.el);
			}

			// Frame-local shared-resolution state does not drive rendering.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const unresolvedLatest = new Map<string, LayoutNode>();
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const liveBySharedId = new Map<string, LayoutNode[]>();
			for (const node of nodes) {
				const id = node.options.id;
				const target = targets.get(node);
				if (!id || !target || isDegenerateBox(target)) continue;
				const live = liveBySharedId.get(id) ?? [];
				live.push(node);
				liveBySharedId.set(id, live);
				if (!node.sharedResolved) {
					const current = unresolvedLatest.get(id);
					if (!current || current.generation < node.generation) unresolvedLatest.set(id, node);
				}
			}
			for (const [id, live] of liveBySharedId) {
				if (live.length > 1) {
					warnOnce(`duplicate:${id}`, motionDiagnostics.duplicateSharedId(id), bound);
				}
			}

			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const inheritedByNode = new Map<LayoutNode, LayoutBox>();
			for (const [id, node] of unresolvedLatest) {
				const previousOwner = [...nodes]
					.filter(
						(candidate) =>
							candidate !== node &&
							candidate.options.id === id &&
							candidate.generation < node.generation &&
							candidate.committedFlush > 0 &&
							candidate.committedFlush < currentFlush
					)
					.sort((a, b) => b.generation - a.generation)[0];
				const inherited = previousOwner
					? (snapshots.get(previousOwner)?.visual ?? previousOwner.lastLayout)
					: takeShared(id, node.owner);
				if (inherited) inheritedByNode.set(node, inherited);
			}

			// Frame-local invalidation state does not drive rendering.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const changedNodes = new Set<LayoutNode>();
			for (const node of nodes) {
				if (isLayoutExit(node.el)) continue;
				const to = targets.get(node);
				if (!to || isDegenerateBox(to)) continue;
				const snapshot = snapshots.get(node);
				const from = snapshot?.visual ?? inheritedByNode.get(node) ?? node.lastLayout;
				const changed = snapshot ? !boxesEqual(snapshot.projection.to, to) : !boxesEqual(from, to);
				if (changed) changedNodes.add(node);
			}

			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const invalidated = new Set<LayoutNode>();
			for (const active of snapshots.keys()) {
				if (
					[...changedNodes].some(
						(changed) => active.el.contains(changed.el) || changed.el.contains(active.el)
					)
				) {
					invalidated.add(active);
				}
			}

			const jobs: LayoutJob[] = [];
			const reduced = prefersReducedMotion();
			const shouldAnimate = mode === 'animate' && !reduced;
			for (const node of nodes) {
				const to = targets.get(node);
				if (!to || isDegenerateBox(to)) continue;
				const snapshot = snapshots.get(node);
				const from = snapshot?.visual ?? inheritedByNode.get(node) ?? node.lastLayout;
				const changed = changedNodes.has(node);
				node.lastLayout = to;
				node.committedFlush = currentFlush;
				node.sharedResolved = true;
				if (isLayoutExit(node.el)) {
					if (snapshot) stop(node);
					continue;
				}

				if (snapshot && !changed && !invalidated.has(node) && !reduced) {
					restoreProjection(node, snapshot);
					continue;
				}
				if (snapshot) stop(node);
				if (snapshot && !changed && invalidated.has(node) && !reduced) {
					const projection = snapshot.projection;
					jobs.push({
						node,
						from: projection.from,
						to: projection.to,
						transition: projection.transition,
						samples: projection.samples,
						parent: nearestLayoutParent(node),
						elapsed: projection.elapsedOffset + projection.lastCurrentTime
					});
					continue;
				}
				if (!shouldAnimate || !changed || isDegenerateBox(from)) continue;
				const transition = transitionFor(node);
				const start = constrainedStart(from, to, node.options.type ?? 'both');
				if (!isSignificantInvert(invertTransform(start, to))) continue;
				jobs.push({
					node,
					from: start,
					to,
					transition,
					samples: cachedSpringSamples(transition.spring satisfies SpringOptions),
					parent: nearestLayoutParent(node),
					elapsed: 0
				});
			}
			startJobs(jobs);
			mutationObserver?.takeRecords();
		} finally {
			applying = false;
		}
	}

	function schedule(mode: FlushMode, reason: FlushReason = 'internal') {
		if (!bound || typeof requestAnimationFrame === 'undefined') return;
		// MutationObserver is what distinguishes discrete targets from later stale
		// measurements. Without it, motion degrades to synchronized static layout.
		if (mode === 'animate' && !mutationObserver) mode = 'baseline';
		dirty = true;
		if (mode === 'animate' && !baselineDominates) {
			pendingMode = 'animate';
			pendingReason = reason;
			lastDiscreteAt = performance.now();
		}
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			const now = performance.now();
			let nextMode = pendingMode;
			const reasonForFlush = pendingReason;
			pendingMode = 'baseline';
			pendingReason = 'internal';
			baselineDominates = false;
			dirty = false;
			if (nextMode === 'animate' && shouldSuppressAnimatedFlush(flushGuard, now)) {
				nextMode = 'baseline';
			}
			const started = performance.now();
			flush(nextMode);
			const cost = performance.now() - started;
			if (nextMode === 'animate') {
				const guarded = recordAnimatedFlush(flushGuard, now, cost, reasonForFlush);
				if (guarded && bound) {
					for (const node of nodes) stop(node);
					warnOnce(
						`flush-guard:${guarded.episode}`,
						motionDiagnostics.flushGuard({
							group: describeLayoutGroup(bound),
							count: guarded.count,
							span: guarded.span,
							cost: guarded.cost,
							reason: guarded.reason
						}),
						bound
					);
				}
			}
			if (dirty) schedule(pendingMode, pendingReason);
		});
	}

	function styleChangedBeyondAnimation(record: MutationRecord): boolean {
		if (record.attributeName !== 'style') return false;
		const el = record.target as Element;
		return (
			styleWithoutAnimation(record.oldValue ?? '') !==
			styleWithoutAnimation(el.getAttribute('style') ?? '')
		);
	}

	function observe(element: HTMLElement) {
		mutationObserver?.disconnect();
		resizeObserver?.disconnect();
		if (typeof MutationObserver === 'function') {
			mutationObserver = new MutationObserver((records) => {
				if (applying) return;
				const relevant = records.some(
					(record) =>
						record.type === 'childList' ||
						record.attributeName === 'class' ||
						(record.attributeName === 'style' && styleChangedBeyondAnimation(record)) ||
						(record.type === 'attributes' &&
							record.attributeName !== 'class' &&
							record.attributeName !== 'style')
				);
				if (relevant) schedule('animate', 'mutation');
			});
			mutationObserver.observe(element, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeOldValue: true
			});
		}
		if (typeof ResizeObserver === 'function') {
			resizeObserver = new ResizeObserver((entries) => {
				if (applying) return;
				if (entries.length > 0 && entries.every(matchesCommittedResize)) return;
				if (performance.now() - lastDiscreteAt <= DISCRETE_RESIZE_GRACE_MS) return;
				schedule('baseline', 'resize');
			});
			resizeObserver.observe(element);
			for (const node of nodes) resizeObserver.observe(node.el);
		}
	}

	function onTransitionStart() {
		if (!applying) schedule('animate', 'transition');
	}

	function onTransitionEnd() {
		if (!applying) schedule('baseline', 'transition');
	}

	function onCssTransitionRun(event: TransitionEvent) {
		if (
			!/^(?:width|height|min-|max-|padding|margin|inset|top|right|bottom|left|gap|row-gap|column-gap|flex-basis|grid-template)/.test(
				event.propertyName
			)
		) {
			return;
		}
		pendingMode = 'baseline';
		pendingReason = 'transition';
		baselineDominates = true;
		if (!applying) schedule('baseline', 'transition');
	}

	function onScroll(event: Event) {
		if (event.target instanceof Element && bound?.contains(event.target)) {
			pendingMode = 'baseline';
			pendingReason = 'scroll';
			baselineDominates = true;
		}
		if (!applying) schedule('baseline', 'scroll');
	}

	function onMotionPreferenceChange(event: MediaQueryListEvent) {
		if (!event.matches) return;
		for (const node of nodes) stop(node);
		schedule('baseline', 'preference');
	}

	function bindRoot(element: HTMLElement) {
		bound = element;
		committedRootWidth = element.offsetWidth;
		committedRootHeight = element.offsetHeight;
		groups.set(element, handle);
		observe(element);
		element.addEventListener('introstart', onTransitionStart, true);
		element.addEventListener('outrostart', onTransitionStart, true);
		element.addEventListener('introend', onTransitionEnd, true);
		element.addEventListener('outroend', onTransitionEnd, true);
		element.addEventListener('transitionrun', onCssTransitionRun, true);
		element.addEventListener('transitionend', onTransitionEnd, true);
		element.addEventListener('transitioncancel', onTransitionEnd, true);
		window.addEventListener('scroll', onScroll, true);
		motionQuery =
			typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
		motionQuery?.addEventListener?.('change', onMotionPreferenceChange);
		return () => {
			mutationObserver?.disconnect();
			resizeObserver?.disconnect();
			mutationObserver = null;
			resizeObserver = null;
			element.removeEventListener('introstart', onTransitionStart, true);
			element.removeEventListener('outrostart', onTransitionStart, true);
			element.removeEventListener('introend', onTransitionEnd, true);
			element.removeEventListener('outroend', onTransitionEnd, true);
			element.removeEventListener('transitionrun', onCssTransitionRun, true);
			element.removeEventListener('transitionend', onTransitionEnd, true);
			element.removeEventListener('transitioncancel', onTransitionEnd, true);
			window.removeEventListener('scroll', onScroll, true);
			motionQuery?.removeEventListener?.('change', onMotionPreferenceChange);
			motionQuery = null;
			groups.delete(element);
			if (bound === element) bound = null;
		};
	}

	function register(el: HTMLElement, options: LayoutOptions = {}) {
		const origin = rootOrigin();
		let measured: LayoutBox;
		applying = true;
		try {
			measured = measure(el, origin);
			mutationObserver?.takeRecords();
		} finally {
			applying = false;
		}

		const owner = ++ownerSequence;
		const generation = ++generationSequence;
		const node: LayoutNode = {
			el,
			options,
			lastLayout: measured,
			projection: null,
			sharedResolved: false,
			committedFlush: 0,
			committedWidth: el.offsetWidth,
			committedHeight: el.offsetHeight,
			owner,
			generation
		};
		nodes.add(node);
		nodesByElement.set(el, node);
		commitLayoutOffset(el);
		registerVisualOffsetReader(el, () => {
			const visual = currentVisual(node) ?? node.lastLayout;
			return {
				x: visual.left - node.lastLayout.left,
				y: visual.top - node.lastLayout.top
			};
		});
		registerLayoutExitHandler(el, () => stop(node));
		resizeObserver?.observe(el);

		const style = getComputedStyle(el);
		if (
			style.transform !== 'none' ||
			(style.scale && style.scale !== 'none') ||
			(style.translate && style.translate !== 'none')
		) {
			warnOnce('authored-transform', motionDiagnostics.authoredTransform, el);
		}
		// Registration can shift existing siblings; the new node itself only animates from a shared snapshot.
		schedule('animate', 'registration');

		return () => {
			if (node.committedFlush > 0) {
				const visual = currentVisual(node);
				stashShared(node, visual && !isDegenerateBox(visual) ? visual : node.lastLayout);
			}
			stop(node);
			resizeObserver?.unobserve(el);
			nodes.delete(node);
			nodesByElement.delete(el);
			clearCommittedLayoutOffset(el);
			schedule('animate', 'unregistration');
		};
	}

	function destroy() {
		mutationObserver?.disconnect();
		resizeObserver?.disconnect();
		motionQuery?.removeEventListener?.('change', onMotionPreferenceChange);
		if (frame) cancelAnimationFrame(frame);
		for (const node of nodes) stop(node);
		nodes.clear();
		nodesByElement.clear();
		shared.clear();
		warned.clear();
		if (bound) groups.delete(bound);
		bound = null;
		frame = 0;
	}

	const handle: LayoutGroupHandle = { bindRoot, register, destroy };
	return handle;
}

export function layout(options: LayoutOptions = {}): Attachment<HTMLElement> {
	return (element) => {
		if (typeof requestAnimationFrame === 'undefined') return;

		let unregister: (() => void) | undefined;
		let attempts = 0;
		let frame = 0;
		let disposed = false;

		const tryRegister = () => {
			if (disposed) return;
			try {
				unregister = findGroup(element).register(element, options);
			} catch (error) {
				if (!(error instanceof MissingLayoutGroupError)) {
					if (import.meta.env.DEV) {
						console.warn(
							`[Bedrock motion] ${motionDiagnostics.registrationFailed}`,
							element,
							error
						);
					}
					return;
				}
				if (attempts++ > 8) {
					if (import.meta.env.DEV) {
						console.warn(`[Bedrock motion] ${motionDiagnostics.missingGroup}`, element);
					}
					return;
				}
				frame = requestAnimationFrame(tryRegister);
			}
		};

		// Descendant attachments can run before a nearer nested LayoutGroup root.
		// The microtask lets every root in this commit bind without sacrificing a
		// painted frame before a newly mounted shared owner starts projecting.
		queueMicrotask(tryRegister);

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			unregister?.();
		};
	};
}
