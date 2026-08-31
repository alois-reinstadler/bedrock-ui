export type LayoutOffset = {
	left: number;
	top: number;
	width: number;
	height: number;
};

const committedOffsets = new WeakMap<HTMLElement, LayoutOffset>();
const visualOffsetReaders = new WeakMap<HTMLElement, () => { x: number; y: number }>();
const exitHandlers = new WeakMap<HTMLElement, () => void>();
const exitingNodes = new WeakSet<HTMLElement>();

/** Preserve normal-flow geometry for presence transitions that begin after a
 * keyed reconciliation has already moved the outgoing node in the DOM. */
export function commitLayoutOffset(element: HTMLElement): void {
	committedOffsets.set(element, {
		left: element.offsetLeft,
		top: element.offsetTop,
		width: element.offsetWidth,
		height: element.offsetHeight
	});
}

export function readCommittedLayoutOffset(element: HTMLElement): LayoutOffset | undefined {
	return committedOffsets.get(element);
}

export function clearCommittedLayoutOffset(element: HTMLElement): void {
	committedOffsets.delete(element);
	visualOffsetReaders.delete(element);
	exitHandlers.delete(element);
	exitingNodes.delete(element);
}

export function registerVisualOffsetReader(
	element: HTMLElement,
	reader: () => { x: number; y: number }
): void {
	visualOffsetReaders.set(element, reader);
}

function readVisualLayoutOffset(element: HTMLElement): { x: number; y: number } {
	return visualOffsetReaders.get(element)?.() ?? { x: 0, y: 0 };
}

export function registerLayoutExitHandler(element: HTMLElement, handler: () => void): void {
	exitHandlers.set(element, handler);
}

/** Capture the currently rendered projection and cancel it before the presence
 * transition can paint the same offset a second time. */
export function beginLayoutExit(element: HTMLElement): { x: number; y: number } {
	const visualOffset = readVisualLayoutOffset(element);
	exitingNodes.add(element);
	exitHandlers.get(element)?.();
	return visualOffset;
}

export function clearLayoutExit(element: HTMLElement): void {
	exitingNodes.delete(element);
}

export function isLayoutExit(element: HTMLElement): boolean {
	return exitingNodes.has(element);
}
