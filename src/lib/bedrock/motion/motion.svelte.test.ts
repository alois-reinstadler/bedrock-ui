import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import MotionTestbed from './motion-testbed.svelte';

async function nextFrame(count = 1) {
	for (let index = 0; index < count; index += 1) {
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
	}
}

async function waitForAnimation(element: Element, previous?: Animation): Promise<Animation> {
	const deadline = performance.now() + 1_000;
	while (performance.now() < deadline) {
		const animation = element.getAnimations()[0];
		if (animation && animation !== previous) return animation;
		await nextFrame();
	}
	throw new Error('Expected a new animation to start');
}

async function waitForIdle(root: Element) {
	const deadline = performance.now() + 1_500;
	while (performance.now() < deadline) {
		if (root.getAnimations({ subtree: true }).length === 0) return;
		await nextFrame();
	}
	throw new Error('Animations did not settle');
}

function expectNoProjectionResidue(root: Element) {
	expect(root.getAnimations({ subtree: true })).toHaveLength(0);
	for (const element of root.querySelectorAll<HTMLElement>('*')) {
		expect(element.style.transform).toBe('');
		expect(element.style.transformOrigin).toBe('');
		expect(element.style.borderRadius).toBe('');
		expect(element.style.zIndex).toBe('');
		expect(element.style.willChange).toBe('');
	}
}

function clickButton(container: Element, name: string) {
	const button = [...container.querySelectorAll('button')].find(
		(candidate) => candidate.textContent?.trim() === name
	);
	if (!button) throw new Error(`Button not found: ${name}`);
	button.click();
}

function reducedMotionQuery(): MediaQueryList {
	return {
		matches: true,
		media: '(prefers-reduced-motion: reduce)',
		onchange: null,
		addListener: () => undefined,
		removeListener: () => undefined,
		addEventListener: () => undefined,
		removeEventListener: () => undefined,
		dispatchEvent: () => true
	};
}

afterEach(async () => {
	await cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('Bedrock motion browser contract', () => {
	it('plays a layout flush and settles without projection residue', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		const initialLeft = node.getBoundingClientRect().left;

		clickButton(view.container, 'Ende');
		const animation = await waitForAnimation(node);

		expect(getComputedStyle(node).transform).not.toBe('none');
		expect((animation.effect as KeyframeEffect).getKeyframes()).toHaveLength(2);
		expect(animation.effect?.getComputedTiming().easing).toContain('linear(');
		await waitForIdle(root);
		expect(node.getBoundingClientRect().left).toBeGreaterThan(initialLeft + 250);
		expectNoProjectionResidue(root);
	});

	it('retargets rapid discrete updates from the visible box to the latest target', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;

		clickButton(view.container, 'Ende');
		const first = await waitForAnimation(node);
		await new Promise((resolve) => setTimeout(resolve, 72));
		first.pause();
		await nextFrame();
		const beforeRetarget = node.getBoundingClientRect().left;
		clickButton(view.container, 'Mitte');
		const second = await waitForAnimation(node, first);
		second.pause();
		second.currentTime = 0;
		await nextFrame();
		const afterRetarget = node.getBoundingClientRect().left;

		expect(Math.abs(afterRetarget - beforeRetarget)).toBeLessThan(3);
		second.play();
		await waitForIdle(root);
		const rootBox = root.getBoundingClientRect();
		const nodeBox = node.getBoundingClientRect();
		expect(nodeBox.left + nodeBox.width / 2).toBeCloseTo(rootBox.left + rootBox.width / 2, 0);
		expectNoProjectionResidue(root);
	});

	it('preserves an unchanged projection across unrelated mutations and document scroll', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const root = view.container.querySelector<HTMLElement>('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		clickButton(view.container, 'Ende');
		const animation = await waitForAnimation(node);
		animation.pause();
		animation.currentTime = 70;
		await nextFrame();
		const before = node.getBoundingClientRect().left;

		root.setAttribute('data-unrelated', 'true');
		await nextFrame(2);
		expect(node.getAnimations()[0]).toBe(animation);
		expect(animation.currentTime).toBe(70);
		expect(node.getBoundingClientRect().left).toBeCloseTo(before, 0);

		const spacer = document.createElement('div');
		spacer.style.height = '2000px';
		document.body.append(spacer);
		window.scrollBy(0, 1);
		await nextFrame(2);
		expect(node.getAnimations()[0]).toBe(animation);
		expect(animation.currentTime).toBe(70);
		expect(node.getBoundingClientRect().left).toBeCloseTo(before, 0);
		window.scrollTo(0, 0);
		spacer.remove();
		animation.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('keeps a running projection on its original WAAPI phase across an unrelated flush', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const root = view.container.querySelector<HTMLElement>('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		clickButton(view.container, 'Ende');
		const animation = await waitForAnimation(node);
		await new Promise((resolve) => setTimeout(resolve, 90));
		const beforeTime = Number(animation.currentTime);
		const beforeLeft = node.getBoundingClientRect().left;

		root.setAttribute('data-running-unrelated', 'true');
		await nextFrame(2);
		expect(node.getAnimations()[0]).toBe(animation);
		expect(Number(animation.currentTime)).toBeGreaterThanOrEqual(beforeTime);
		expect(node.getBoundingClientRect().left).toBeGreaterThanOrEqual(beforeLeft - 2);
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('uses the WAAPI timeline instead of wall time when a paused projection retargets', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		clickButton(view.container, 'Ende');
		const animation = await waitForAnimation(node);
		animation.pause();
		animation.currentTime = 60;
		await new Promise((resolve) => setTimeout(resolve, 550));
		const before = node.getBoundingClientRect().left;

		clickButton(view.container, 'Mitte');
		const replacement = await waitForAnimation(node, animation);
		replacement.pause();
		replacement.currentTime = 0;
		await nextFrame();
		expect(node.getBoundingClientRect().left).toBeCloseTo(before, 0);
		replacement.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('projects a nested child once when only its parent changes world position', async () => {
		const view = await render(MotionTestbed, { scenario: 'nested' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="nested-root"]')!;
		const parent = view.container.querySelector<HTMLElement>('[data-testid="projection-parent"]')!;
		const child = view.container.querySelector<HTMLElement>('[data-testid="projection-child"]')!;
		const parentStart = parent.getBoundingClientRect().left;
		const childStart = child.getBoundingClientRect().left;

		clickButton(view.container, 'Elternteil verschieben');
		await waitForAnimation(parent);
		await new Promise((resolve) => setTimeout(resolve, 60));
		const parentTravel = parent.getBoundingClientRect().left - parentStart;
		const childTravel = child.getBoundingClientRect().left - childStart;

		expect(Math.abs(parentTravel - childTravel)).toBeLessThan(2);
		expect(child.getAnimations()).toHaveLength(0);
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('keeps an inherited child clock aligned with a paused parent timeline', async () => {
		const view = await render(MotionTestbed, { scenario: 'nested' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="nested-root"]')!;
		const parent = view.container.querySelector<HTMLElement>('[data-testid="projection-parent"]')!;
		const child = view.container.querySelector<HTMLElement>('[data-testid="projection-child"]')!;
		clickButton(view.container, 'Elternteil verschieben');
		const first = await waitForAnimation(parent);
		first.pause();
		first.currentTime = 90;
		await nextFrame();
		expect(child.getAnimations()).toHaveLength(0);
		await new Promise((resolve) => setTimeout(resolve, 300));
		const before = child.getBoundingClientRect();

		clickButton(view.container, 'Elternteil verschieben');
		const replacement = await waitForAnimation(parent, first);
		replacement.pause();
		replacement.currentTime = 0;
		await nextFrame();
		const after = child.getBoundingClientRect();
		expect(Math.abs(after.left - before.left)).toBeLessThan(1);
		expect(Math.abs(after.top - before.top)).toBeLessThan(1);
		replacement.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('keeps fast child correction alive through a slower ancestor timeline', async () => {
		const view = await render(MotionTestbed, { scenario: 'nested-timing' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="timeline-root"]')!;
		const parent = view.container.querySelector<HTMLElement>('[data-testid="timeline-parent"]')!;
		const child = view.container.querySelector<HTMLElement>('[data-testid="timeline-child"]')!;
		clickButton(view.container, 'Verschachtelt verschieben');
		const parentAnimation = await waitForAnimation(parent);
		const childAnimation = await waitForAnimation(child);
		expect(childAnimation.effect?.getComputedTiming().duration).toBe(600);
		parentAnimation.pause();
		childAnimation.pause();

		parentAnimation.currentTime = 150;
		childAnimation.currentTime = 150;
		await nextFrame();
		const atChildCompletion = child.getBoundingClientRect().left;
		const finalChildLeft = root.getBoundingClientRect().left + 380;
		parentAnimation.currentTime = 180;
		childAnimation.currentTime = 180;
		await nextFrame();
		const afterChildCompletion = child.getBoundingClientRect().left;

		expect(afterChildCompletion).toBeGreaterThanOrEqual(atChildCompletion - 1);
		expect(atChildCompletion).toBeCloseTo(finalChildLeft, 0);
		expect(afterChildCompletion).toBeCloseTo(finalChildLeft, 0);
		parentAnimation.play();
		childAnimation.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it.each(['Zuerst entfernen', 'Zuerst einfügen'] as const)(
		'transfers a shared id when using %s ordering',
		async (buttonName) => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
			const view = await render(MotionTestbed, { scenario: 'shared' });
			await nextFrame(2);
			const root = view.container.querySelector('[data-testid="shared-root"]')!;
			const source = view.container.querySelector<HTMLElement>('[data-testid="shared-source"]')!;
			const sourceLeft = source.getBoundingClientRect().left;

			clickButton(view.container, buttonName);
			await nextFrame();
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
			const target = view.container.querySelector<HTMLElement>('[data-testid="shared-target"]');
			expect(target).not.toBeNull();
			const firstPaintAnimation = target!.getAnimations()[0];
			expect(firstPaintAnimation).toBeDefined();
			firstPaintAnimation!.pause();
			firstPaintAnimation!.currentTime = 0;
			await nextFrame();
			expect(target!.getBoundingClientRect().left).toBeCloseTo(sourceLeft, 0);
			firstPaintAnimation!.play();
			await waitForIdle(root);
			expect(target!.getBoundingClientRect().left).toBeGreaterThan(sourceLeft + 250);
			expect(warn).not.toHaveBeenCalled();
			expectNoProjectionResidue(root);
		}
	);

	it('animates intrinsic shell height without scaling its contents and retargets cleanly', async () => {
		const view = await render(MotionTestbed, { scenario: 'auto-size' });
		await nextFrame(2);
		const shell = view.container.querySelector<HTMLElement>('[data-testid="auto-size-shell"]')!;
		const initialHeight = shell.getBoundingClientRect().height;

		clickButton(view.container, 'Höhe ändern');
		const growing = await waitForAnimation(shell);
		growing.pause();
		growing.currentTime = 90;
		await nextFrame();
		const middleHeight = shell.getBoundingClientRect().height;
		expect(middleHeight).toBeGreaterThan(initialHeight + 5);
		expect(middleHeight).toBeLessThan(initialHeight + 35);
		expect(getComputedStyle(shell.querySelector<HTMLElement>('.auto-size-row')!).transform).toBe(
			'none'
		);

		clickButton(view.container, 'Höhe ändern');
		const shrinking = await waitForAnimation(shell, growing);
		shrinking.play();
		await waitForIdle(shell);
		expect(shell.getBoundingClientRect().height).toBeCloseTo(initialHeight, 0);
		expectNoProjectionResidue(shell);
	});

	it('fades Swap content through without readable opacity overlap', async () => {
		const view = await render(MotionTestbed, { scenario: 'swap' });
		await nextFrame(2);
		const initialCopy = view.container.querySelector<HTMLElement>(
			'[data-testid="swap-short"]'
		)!.parentElement!;
		const initialCopyLeft = initialCopy.getBoundingClientRect().left;
		clickButton(view.container, 'Inhalt wechseln');

		let maximumCombinedOpacity = 0;
		let minimumCombinedOpacity = 1;
		let maximumOutgoingDrift = 0;
		let clippedCopy = false;
		const deadline = performance.now() + 800;
		while (performance.now() < deadline) {
			const short = view.container.querySelector<HTMLElement>('[data-testid="swap-short"]');
			const long = view.container.querySelector<HTMLElement>('[data-testid="swap-long"]');
			const opacity = (element: HTMLElement | null) =>
				element ? Number.parseFloat(getComputedStyle(element.parentElement!).opacity) : 0;
			const combinedOpacity = opacity(short) + opacity(long);
			maximumCombinedOpacity = Math.max(maximumCombinedOpacity, combinedOpacity);
			minimumCombinedOpacity = Math.min(minimumCombinedOpacity, combinedOpacity);
			if (short) {
				maximumOutgoingDrift = Math.max(
					maximumOutgoingDrift,
					Math.abs(short.parentElement!.getBoundingClientRect().left - initialCopyLeft)
				);
			}
			clippedCopy ||= [short, long].some(
				(element) => element && getComputedStyle(element.parentElement!).clipPath !== 'none'
			);
			const shell = view.container.querySelector('[data-testid="swap-shell"]')!;
			if (long && !short && shell.getAnimations({ subtree: true }).length === 0) break;
			await nextFrame();
		}

		expect(maximumCombinedOpacity).toBeLessThanOrEqual(1.05);
		expect(minimumCombinedOpacity).toBeGreaterThanOrEqual(0.95);
		expect(maximumOutgoingDrift).toBeLessThan(0.25);
		expect(clippedCopy).toBe(false);
		expect(view.container.querySelector('[data-testid="swap-short"]')).toBeNull();
		expect(view.container.querySelector('[data-testid="swap-long"]')).not.toBeNull();
	});

	it('rolls Swap content upward without transforms or an empty midpoint', async () => {
		const view = await render(MotionTestbed, { scenario: 'swap' });
		await nextFrame(2);
		clickButton(view.container, 'Effekt wechseln');
		await nextFrame();
		const short = view.container.querySelector<HTMLElement>('[data-testid="swap-short"]')!;
		const shortCopy = short.parentElement!;
		const initialTop = shortCopy.getBoundingClientRect().top;
		clickButton(view.container, 'Inhalt wechseln');
		const outgoing = await waitForAnimation(shortCopy);

		const long = view.container.querySelector<HTMLElement>('[data-testid="swap-long"]')!;
		const longCopy = long.parentElement!;
		const incoming = await waitForAnimation(longCopy);
		outgoing.pause();
		incoming.pause();
		outgoing.currentTime = 200;
		incoming.currentTime = 200;
		await nextFrame();
		const shell = longCopy.parentElement!;
		expect(getComputedStyle(shell).overflow).toBe('hidden');
		const combinedOpacity =
			Number.parseFloat(getComputedStyle(shortCopy).opacity) +
			Number.parseFloat(getComputedStyle(longCopy).opacity);
		expect(combinedOpacity).toBeGreaterThanOrEqual(0.95);
		expect(combinedOpacity).toBeLessThanOrEqual(1.05);
		expect(getComputedStyle(shortCopy).transform).toBe('none');
		expect(getComputedStyle(longCopy).transform).toBe('none');
		expect(shortCopy.getBoundingClientRect().top).toBeLessThan(initialTop);
		expect(longCopy.getBoundingClientRect().top).toBeGreaterThan(initialTop);

		outgoing.play();
		incoming.play();
		await waitForIdle(shell);
		expect(view.container.querySelector('[data-testid="swap-short"]')).toBeNull();
		expect(longCopy.getBoundingClientRect().top).toBeCloseTo(initialTop, 0);
		expectNoProjectionResidue(shell);
	});

	it('ignores a never-flushed intermediate owner during a triple shared handoff', async () => {
		const view = await render(MotionTestbed, { scenario: 'shared-triple' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="triple-root"]')!;
		const source = view.container.querySelector<HTMLElement>('[data-testid="triple-source"]')!;
		const sourceLeft = source.getBoundingClientRect().left;
		clickButton(view.container, 'Dreifach übertragen');

		let target: HTMLElement | null = null;
		while (!target) {
			target = view.container.querySelector<HTMLElement>('[data-testid="triple-target"]');
			if (!target) await nextFrame();
		}
		const animation = await waitForAnimation(target);
		animation.pause();
		animation.currentTime = 0;
		await nextFrame();
		expect(target.getBoundingClientRect().left).toBeCloseTo(sourceLeft, 0);
		expect(Math.abs(target.getBoundingClientRect().left - 156)).toBeGreaterThan(80);
		animation.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('lets a live older owner replace an expired newer shared snapshot', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const view = await render(MotionTestbed, { scenario: 'shared-expiry' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="expiry-root"]')!;
		const source = view.container.querySelector<HTMLElement>('[data-testid="expiry-source"]')!;
		const sourceLeft = source.getBoundingClientRect().left;
		clickButton(view.container, 'Neueren Besitzer entfernen');
		await nextFrame(2);
		await new Promise((resolve) => setTimeout(resolve, 520));
		clickButton(view.container, 'Nach Ablauf übertragen');

		let target: HTMLElement | null = null;
		while (!target) {
			target = view.container.querySelector<HTMLElement>('[data-testid="expiry-target"]');
			if (!target) await nextFrame();
		}
		const animation = await waitForAnimation(target);
		animation.pause();
		animation.currentTime = 0;
		await nextFrame();
		expect(target.getBoundingClientRect().left).toBeCloseTo(sourceLeft, 0);
		animation.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('fixture-triple'), root);
	});

	it('emits canonical diagnostics with the owning group element in test development mode', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const view = await render(MotionTestbed, { scenario: 'diagnostic' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="diagnostic-root"]')!;
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('fixture-duplicate'), root);
	});

	it('warns once outside a group and cancels a pending retry on cleanup', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const view = await render(MotionTestbed, { scenario: 'missing-group' });
		const node = view.container.querySelector('[data-testid="orphan-layout-node"]')!;
		await nextFrame(12);
		const missingCalls = warn.mock.calls.filter(([message]) =>
			String(message).includes('must be used inside <LayoutGroup>')
		);
		expect(missingCalls).toHaveLength(1);
		expect(missingCalls[0]?.[1]).toBe(node);
		await view.unmount();

		warn.mockClear();
		const cleaned = await render(MotionTestbed, { scenario: 'missing-group' });
		await cleaned.unmount();
		await nextFrame(12);
		expect(warn).not.toHaveBeenCalled();
	});

	it('keeps shared ids isolated across nested and adjacent groups', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const view = await render(MotionTestbed, { scenario: 'group-isolation' });
		await nextFrame(3);
		const innerRoot = view.container.querySelector('[data-testid="isolation-inner"]')!;
		expect(warn.mock.calls.some(([message]) => String(message).includes('fixture-isolated'))).toBe(
			false
		);
		expect(innerRoot.getAnimations({ subtree: true })).toHaveLength(0);

		clickButton(view.container, 'Zwischen Gruppen übertragen');
		let target: HTMLElement | null = null;
		while (!target) {
			target = view.container.querySelector<HTMLElement>('[data-testid="adjacent-target"]');
			if (!target) await nextFrame();
		}
		await nextFrame(2);
		expect(target.getAnimations()).toHaveLength(0);
		expect(warn.mock.calls.some(([message]) => String(message).includes('fixture-adjacent'))).toBe(
			false
		);
	});

	it('suppresses the triggering guard animation and recovers after quiet', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(3);
		const root = view.container.querySelector<HTMLElement>('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		let lastTarget = 'Ende';
		for (let index = 0; index < 10; index += 1) {
			lastTarget = index % 2 === 0 ? 'Ende' : 'Start';
			clickButton(view.container, lastTarget);
			await new Promise((resolve) => setTimeout(resolve, 20));
			if (warn.mock.calls.some(([message]) => String(message).includes('animation-work guard'))) {
				break;
			}
		}
		const guardCall = warn.mock.calls.find(([message]) =>
			String(message).includes('animation-work guard')
		);
		expect(guardCall).toBeDefined();
		expect(guardCall?.[1]).toBe(root);
		expect(root.getAnimations({ subtree: true })).toHaveLength(0);
		const rootBox = root.getBoundingClientRect();
		const nodeBox = node.getBoundingClientRect();
		if (lastTarget === 'Ende') expect(Math.abs(nodeBox.right - rootBox.right)).toBeLessThan(2);
		else expect(Math.abs(nodeBox.left - rootBox.left)).toBeLessThan(2);

		await new Promise((resolve) => setTimeout(resolve, 150));
		clickButton(view.container, lastTarget === 'Ende' ? 'Start' : 'Ende');
		await waitForAnimation(node);
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('does not retain fictitious geometry when WAAPI is unavailable', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(3);
		const root = view.container.querySelector('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'animate');
		try {
			Object.defineProperty(Element.prototype, 'animate', {
				configurable: true,
				value: undefined
			});
			clickButton(view.container, 'Ende');
			await nextFrame(2);
			expect(root.getAnimations({ subtree: true })).toHaveLength(0);
			const painted = node.getBoundingClientRect().left;

			Object.defineProperty(Element.prototype, 'animate', descriptor!);
			clickButton(view.container, 'Mitte');
			const replacement = await waitForAnimation(node);
			replacement.pause();
			replacement.currentTime = 0;
			await nextFrame();
			expect(node.getBoundingClientRect().left).toBeCloseTo(painted, 0);
			replacement.play();
			await waitForIdle(root);
		} finally {
			if (descriptor) Object.defineProperty(Element.prototype, 'animate', descriptor);
		}
		expectNoProjectionResidue(root);
	});

	it('degrades to synchronized static layout when observers are unavailable', async () => {
		vi.stubGlobal('MutationObserver', undefined);
		vi.stubGlobal('ResizeObserver', undefined);
		const view = await render(MotionTestbed, { scenario: 'observer-fallback' });
		await nextFrame(3);
		const root = view.container.querySelector<HTMLElement>('[data-testid="fallback-root"]')!;
		const first = view.container.querySelector<HTMLElement>('[data-testid="fallback-item-0"]')!;
		clickButton(view.container, 'Fallback verschieben');
		await nextFrame(2);
		const painted = first.getBoundingClientRect().left;
		clickButton(view.container, 'Fallback hinzufügen');
		await nextFrame(3);
		expect(root.getAnimations({ subtree: true })).toHaveLength(0);
		expect(first.getBoundingClientRect().left).toBeCloseTo(painted - 56, -1);
		expectNoProjectionResidue(root);
	});

	it('keeps mutation-driven motion when ResizeObserver and matchMedia are unavailable', async () => {
		vi.stubGlobal('ResizeObserver', undefined);
		vi.stubGlobal('matchMedia', undefined);
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(3);
		const root = view.container.querySelector('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		clickButton(view.container, 'Ende');
		await waitForAnimation(node);
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('pins an RTL content-box vanish without changing its border-box geometry', async () => {
		const view = await render(MotionTestbed, { scenario: 'vanish-geometry' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="vanish-geometry-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="vanish-geometry-node"]')!;
		const sibling = view.container.querySelector<HTMLElement>('[data-testid="vanish-sibling"]')!;
		const before = node.getBoundingClientRect();
		const siblingBefore = sibling.getBoundingClientRect();
		clickButton(view.container, 'Geometrie entfernen');
		await nextFrame(2);
		const during = node.getBoundingClientRect();
		expect(Math.abs(during.left - before.left)).toBeLessThan(0.5);
		expect(Math.abs(during.top - before.top)).toBeLessThan(0.5);
		expect(Math.abs(during.width - before.width)).toBeLessThan(0.5);
		expect(Math.abs(during.height - before.height)).toBeLessThan(0.5);
		expect(sibling.getBoundingClientRect().right).toBeGreaterThan(siblingBefore.right + 100);
		await waitForIdle(root);
		expect(view.container.querySelector('[data-testid="vanish-geometry-node"]')).toBeNull();
	});

	it('lets native continuous layout run without stacking FLIP projections', async () => {
		const view = await render(MotionTestbed, { scenario: 'continuous-layout' });
		await nextFrame(3);
		const root = view.container.querySelector('[data-testid="continuous-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="continuous-node"]')!;
		const start = node.getBoundingClientRect().left;
		clickButton(view.container, 'CSS-Übergang starten');
		let engineAnimations = 0;
		for (let frame = 0; frame < 16; frame += 1) {
			await nextFrame();
			engineAnimations = Math.max(
				engineAnimations,
				node.getAnimations().filter((animation) => !(animation instanceof CSSTransition)).length
			);
		}
		expect(engineAnimations).toBe(0);
		expect(node.getBoundingClientRect().left).toBeCloseTo(start + 240, 0);
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('covers real appear, vanish, and reveal presence reflow', async () => {
		const view = await render(MotionTestbed, { scenario: 'presence' });
		const root = view.container.querySelector('[data-testid="presence-root"]')!;
		const sentinel = view.container.querySelector<HTMLElement>(
			'[data-testid="presence-sentinel"]'
		)!;
		const initialTop = sentinel.getBoundingClientRect().top;
		clickButton(view.container, 'Inhalt einblenden');
		await nextFrame(2);
		expect(root.getAnimations({ subtree: true }).length).toBeGreaterThan(0);
		await waitForIdle(root);
		expect(sentinel.getBoundingClientRect().top).toBeGreaterThan(initialTop + 40);
		clickButton(view.container, 'Inhalt ausblenden');
		await nextFrame(2);
		expect(root.getAnimations({ subtree: true }).length).toBeGreaterThan(0);
		await waitForIdle(root);
		expect(sentinel.getBoundingClientRect().top).toBeCloseTo(initialTop, 0);
		expect(view.container.querySelector('[data-testid="presence-card"]')).toBeNull();
		expect(view.container.querySelector('[data-testid="reveal-card"]')).toBeNull();
	});

	it('hands exclusive accordion height directly from one panel to the next', async () => {
		const view = await render(MotionTestbed, { scenario: 'accordion' });
		const sentinel = view.container.querySelector<HTMLElement>(
			'[data-testid="accordion-sentinel"]'
		)!;
		await waitForIdle(view.container);
		const start = sentinel.getBoundingClientRect().top;
		clickButton(view.container, 'Zweite Antwort');

		const samples: number[] = [];
		const deadline = performance.now() + 700;
		while (performance.now() < deadline) {
			samples.push(sentinel.getBoundingClientRect().top);
			if (
				view.container.querySelector('[data-testid="accordion-b"]') &&
				!view.container.querySelector('[data-testid="accordion-a"]') &&
				view.container.getAnimations({ subtree: true }).length === 0
			)
				break;
			await nextFrame();
		}

		const end = sentinel.getBoundingClientRect().top;
		expect(end).toBeGreaterThan(start + 5);
		expect(Math.min(...samples)).toBeGreaterThanOrEqual(start - 0.75);
		expect(Math.max(...samples)).toBeLessThanOrEqual(end + 0.75);
	});

	it('commits layout and presence immediately when reduced motion is requested', async () => {
		vi.stubGlobal('matchMedia', () => reducedMotionQuery());
		const layoutView = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const layoutRoot = layoutView.container.querySelector('[data-testid="layout-root"]')!;
		const node = layoutView.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		const initialLeft = node.getBoundingClientRect().left;
		clickButton(layoutView.container, 'Ende');
		await nextFrame(2);
		expect(node.getBoundingClientRect().left).toBeGreaterThan(initialLeft + 250);
		expectNoProjectionResidue(layoutRoot);
		await layoutView.unmount();

		const presenceView = await render(MotionTestbed, { scenario: 'presence' });
		clickButton(presenceView.container, 'Inhalt einblenden');
		await nextFrame();
		expect(presenceView.container.querySelector('[data-testid="presence-card"]')).not.toBeNull();
		expect(presenceView.container.getAnimations({ subtree: true })).toHaveLength(0);
		clickButton(presenceView.container, 'Inhalt ausblenden');
		await nextFrame();
		expect(presenceView.container.querySelector('[data-testid="presence-card"]')).toBeNull();
		expect(presenceView.container.querySelector('[data-testid="reveal-card"]')).toBeNull();
		await presenceView.unmount();

		const autoSizeView = await render(MotionTestbed, { scenario: 'auto-size' });
		const autoSizeShell = autoSizeView.container.querySelector<HTMLElement>(
			'[data-testid="auto-size-shell"]'
		)!;
		clickButton(autoSizeView.container, 'Höhe ändern');
		await nextFrame(2);
		expect(autoSizeShell.getBoundingClientRect().height).toBeCloseTo(80, 0);
		expect(autoSizeShell.getAnimations()).toHaveLength(0);
		await autoSizeView.unmount();

		const swapView = await render(MotionTestbed, { scenario: 'swap' });
		clickButton(swapView.container, 'Effekt wechseln');
		await nextFrame();
		clickButton(swapView.container, 'Inhalt wechseln');
		await nextFrame();
		expect(swapView.container.querySelector('[data-testid="swap-short"]')).toBeNull();
		expect(swapView.container.querySelector('[data-testid="swap-long"]')).not.toBeNull();
		expect(swapView.container.getAnimations({ subtree: true })).toHaveLength(0);
	});

	it('refreshes the baseline on nested scroll before the next discrete update', async () => {
		const view = await render(MotionTestbed, { scenario: 'scroll' });
		await nextFrame(2);
		const root = view.container.querySelector<HTMLElement>('[data-testid="scroll-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="scrolling-node"]')!;
		root.scrollLeft = 180;
		root.dispatchEvent(new Event('scroll', { bubbles: true }));
		await nextFrame(2);
		expect(root.getAnimations({ subtree: true })).toHaveLength(0);
		const afterScroll = node.getBoundingClientRect().left;

		clickButton(view.container, 'Element verschieben');
		await waitForAnimation(node);
		expect(Math.abs(node.getBoundingClientRect().left - afterScroll)).toBeLessThan(24);
		await waitForIdle(root);
		expect(node.getBoundingClientRect().left).toBeCloseTo(afterScroll + 40, 0);
		expectNoProjectionResidue(root);
	});

	it('preserves phase through outside-ancestor scrolling and retargets continuously', async () => {
		const view = await render(MotionTestbed, { scenario: 'scroll' });
		await nextFrame(3);
		const root = view.container.querySelector('[data-testid="scroll-root"]')!;
		const outside = view.container.querySelector<HTMLElement>('[data-testid="outside-scroll"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="scrolling-node"]')!;
		clickButton(view.container, 'Element verschieben');
		const animation = await waitForAnimation(node);
		animation.pause();
		animation.currentTime = 70;
		await nextFrame();
		outside.scrollLeft = 80;
		await nextFrame(2);
		expect(node.getAnimations()[0]).toBe(animation);
		expect(animation.currentTime).toBe(70);
		const beforeRetarget = node.getBoundingClientRect().left;

		clickButton(view.container, 'Element verschieben');
		const replacement = await waitForAnimation(node, animation);
		replacement.pause();
		replacement.currentTime = 0;
		await nextFrame();
		expect(Math.abs(node.getBoundingClientRect().left - beforeRetarget)).toBeLessThan(1);
		replacement.play();
		await waitForIdle(root);
		expectNoProjectionResidue(root);
	});

	it('lets an internal scroll baseline dominate a same-frame mutation', async () => {
		const view = await render(MotionTestbed, { scenario: 'scroll' });
		await nextFrame(2);
		const root = view.container.querySelector<HTMLElement>('[data-testid="scroll-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="scrolling-node"]')!;
		root.scrollLeft = 180;
		root.dispatchEvent(new Event('scroll', { bubbles: true }));
		const before = node.getBoundingClientRect().left;
		clickButton(view.container, 'Element verschieben');
		await nextFrame(2);
		expect(root.getAnimations({ subtree: true })).toHaveLength(0);
		expect(node.getBoundingClientRect().left).toBeCloseTo(before + 40, 0);
		expectNoProjectionResidue(root);
	});

	it('cancels an in-flight projection when the group unmounts', async () => {
		const view = await render(MotionTestbed, { scenario: 'layout' });
		await nextFrame(2);
		const root = view.container.querySelector('[data-testid="layout-root"]')!;
		const node = view.container.querySelector<HTMLElement>('[data-testid="moving-node"]')!;
		clickButton(view.container, 'Ende');
		const animation = await waitForAnimation(node);

		await view.unmount();
		expect(animation.playState).toBe('idle');
		expect(node.getAnimations()).toHaveLength(0);
		expectNoProjectionResidue(root);
	});
});
