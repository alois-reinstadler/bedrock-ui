import { prefersReducedMotion } from '#lib/bedrock/motion/policy.js';

export type StreamTextSpeed = 'natural' | 'fast' | 'instant';
export type StreamTextOptions = {
	speed?: StreamTextSpeed;
	/** Effective application policy, e.g. () => policy.reduced. OS reduction always applies. */
	reduced?: () => boolean;
};
export type TextStream = { readonly text: string; readonly done: boolean; dispose(): void };

/** Steady reveal pace in characters per frame. */
const NATURAL_STEP = 2;
/** `fast` clears roughly this fraction of the backlog every frame. */
const FAST_BACKLOG_DIVISOR = 12;
/** How far past the pace target we scan for a word boundary to snap to. */
const WORD_LOOKAHEAD = 12;

class RevealedTextStream implements TextStream {
	#getTarget: () => string;
	#speed: 'natural' | 'fast';
	#reduced: () => boolean;
	#disposed = false;
	#revealed = $state(0);
	#settledLength = 0;
	#frame: number | undefined;

	constructor(getTarget: () => string, speed: 'natural' | 'fast', reduced: () => boolean) {
		this.#getTarget = getTarget;
		this.#speed = speed;
		this.#reduced = reduced;
	}

	get text(): string {
		const target = this.#getTarget();
		if (this.#disposed || this.#reduced()) {
			this.#cancel();
			this.#settledLength = target.length;
			return target;
		}
		const shown = Math.min(Math.max(this.#revealed, this.#settledLength), target.length);
		if (shown < target.length) this.#schedule();
		return target.slice(0, shown);
	}

	get done(): boolean {
		const target = this.#getTarget();
		if (this.#disposed || this.#reduced()) {
			this.#cancel();
			this.#settledLength = target.length;
			return true;
		}
		if (Math.max(this.#revealed, this.#settledLength) < target.length) {
			this.#schedule();
			return false;
		}
		return true;
	}

	dispose() {
		this.#disposed = true;
		this.#cancel();
	}

	#cancel() {
		if (this.#frame !== undefined) cancelAnimationFrame(this.#frame);
		this.#frame = undefined;
	}

	#schedule() {
		if (this.#frame !== undefined) return;
		this.#frame = requestAnimationFrame(() => this.#advance());
	}

	#advance() {
		this.#frame = undefined;
		const target = this.#getTarget();
		if (this.#disposed || this.#reduced()) {
			this.#revealed = target.length;
			return;
		}
		const current = Math.min(Math.max(this.#revealed, this.#settledLength), target.length);
		if (current >= target.length) {
			this.#revealed = current;
			return;
		}
		const backlog = target.length - current;
		const step =
			this.#speed === 'fast'
				? Math.max(NATURAL_STEP, Math.ceil(backlog / FAST_BACKLOG_DIVISOR))
				: NATURAL_STEP;
		let next = Math.min(current + step, target.length);
		if (next < target.length && !/\s/.test(target[next])) {
			// Snap forward so the visible slice ends on a whole word when one
			// finishes within reach; otherwise reveal mid-word rather than stall.
			const boundary = target.slice(next, next + WORD_LOOKAHEAD).search(/\s/);
			if (boundary >= 0) next += boundary;
		}
		this.#revealed = next;
		if (next < target.length) this.#schedule();
	}
}

class InstantTextStream implements TextStream {
	#getTarget: () => string;

	constructor(getTarget: () => string) {
		this.#getTarget = getTarget;
	}

	get text(): string {
		return this.#getTarget();
	}

	get done(): boolean {
		return true;
	}

	dispose() {
		// Immediate streams own no scheduled work.
	}
}

/**
 * Immediate streaming text by default; optional explicitly paced presentation.
 *
 * `natural` advances ~2 characters per frame, `fast` proportionally to the
 * backlog; both snap to word boundaries where possible. `instant`, reduced
 * motion, and SSR (no `requestAnimationFrame`) return the full target
 * immediately. Once the target stops growing and the display catches up,
 * `done` is true.
 *
 * Usage:
 * ```svelte
 * const stream = streamText(() => message.content);
 * ```
 * then render `{stream.text}` — or pass it to `Markdown` with `streaming`.
 * Explicit paced streams must call `stream.dispose()` on owner teardown.
 */
export function streamText(getTarget: () => string, options: StreamTextOptions = {}): TextStream {
	const speed = options.speed ?? 'instant';
	const reduced = () => prefersReducedMotion() || Boolean(options.reduced?.());
	if (speed === 'instant' || typeof requestAnimationFrame === 'undefined' || reduced()) {
		return new InstantTextStream(getTarget);
	}
	return new RevealedTextStream(getTarget, speed, reduced);
}
