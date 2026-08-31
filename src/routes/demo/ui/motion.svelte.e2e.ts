import { expect, test, type Page } from '@playwright/test';

const sceneTitles = [
	'Shared pill',
	'Pack and shuffle',
	'Unanimatable CSS',
	'Size',
	'Accordion',
	'Stack',
	'Search morph',
	'Row mark',
	'Card to stage',
	'Density',
	'Wrap',
	'Rail',
	'Content swap',
	'Validation'
];

type PerformanceMetric = { name: string; value: number };

function metricMap(metrics: PerformanceMetric[]) {
	return Object.fromEntries(metrics.map(({ name, value }) => [name, value]));
}

async function waitForMotionToSettle(page: Page) {
	await page.waitForFunction(() => document.getAnimations().length === 0);
}

test('the motion lab exposes all fourteen scenes and representative interactions', async ({
	page
}) => {
	const consoleErrors: string[] = [];
	const consoleWarnings: string[] = [];
	const failedRequests: string[] = [];
	await page.addInitScript(() => {
		const originalAnimate = Element.prototype.animate;
		Object.defineProperty(window, '__bedrockHydrationAnimateCalls', {
			value: 0,
			writable: true
		});
		Element.prototype.animate = function (...args) {
			(
				window as typeof window & { __bedrockHydrationAnimateCalls: number }
			).__bedrockHydrationAnimateCalls += 1;
			return originalAnimate.apply(this, args);
		};
	});
	page.on('console', (message) => {
		if (message.type() === 'error') consoleErrors.push(message.text());
		if (message.type() === 'warning') consoleWarnings.push(message.text());
	});
	page.on('requestfailed', (request) => failedRequests.push(request.url()));

	await page.goto('/demo/ui');
	expect(
		await page.evaluate(
			() =>
				(window as typeof window & { __bedrockHydrationAnimateCalls: number })
					.__bedrockHydrationAnimateCalls
		)
	).toBe(0);
	const scenes = page.locator('main > section');
	await expect(scenes).toHaveCount(14);
	await expect(scenes.locator('h2')).toHaveText(sceneTitles);

	const pillScene = scenes.filter({ has: page.getByRole('heading', { name: 'Shared pill' }) });
	await pillScene.getByRole('button', { name: 'Airborne' }).click();
	await pillScene.getByRole('button', { name: 'Boarding' }).click();
	await pillScene.getByRole('button', { name: 'Taxi' }).click();

	const packingScene = scenes.filter({
		has: page.getByRole('heading', { name: 'Pack and shuffle' })
	});
	await packingScene.getByRole('button', { name: 'north' }).click();
	await expect(packingScene.locator('article')).toHaveCount(2);

	const searchScene = scenes.filter({ has: page.getByRole('heading', { name: 'Search morph' }) });
	await searchScene.getByRole('button', { name: 'Open search' }).click();
	await expect(searchScene.getByPlaceholder('Stand, gate, or flight')).toBeVisible();

	const accordionScene = scenes.filter({ has: page.getByRole('heading', { name: 'Accordion' }) });
	await accordionScene.getByRole('button', { name: 'When do I need a shared id?' }).click();
	await expect(
		accordionScene.getByText('When the moving piece is a different DOM node')
	).toBeVisible();

	const validationScene = scenes.filter({ has: page.getByRole('heading', { name: 'Validation' }) });
	await validationScene.getByRole('button', { name: 'File plan' }).click();
	await expect(validationScene.getByRole('alert')).toHaveText('Enter a callsign before filing.');

	const swapScene = scenes.filter({ has: page.getByRole('heading', { name: 'Content swap' }) });
	const upload = swapScene.getByRole('button', { name: 'Upload manifest' });
	await upload.focus();
	await upload.click();
	await expect(upload).toBeFocused();
	await expect(upload).toHaveAttribute('aria-disabled', 'true');
	await page.waitForTimeout(1_900);
	await expect(upload).toBeFocused();

	await waitForMotionToSettle(page);
	expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
	expect(consoleErrors).toEqual([]);
	expect(consoleWarnings).toEqual([]);
	expect(failedRequests).toEqual([]);
});

test('stack and density shells resize continuously with their intrinsic content', async ({
	page
}) => {
	await page.goto('/demo/ui');
	const scenes = page.locator('main > section');
	const stack = scenes.filter({ has: page.getByRole('heading', { name: 'Stack' }) });

	// Establish a real notice before measuring the larger one-to-two item resize.
	await stack.getByRole('button', { name: 'Post notice' }).click();
	await waitForMotionToSettle(page);
	const stackResize = await stack.evaluate(async (scene) => {
		const shell = scene.querySelector<HTMLElement>('#motion-stack-shell')!;
		const button = [...scene.querySelectorAll<HTMLButtonElement>('button')].find((candidate) =>
			candidate.textContent?.includes('Post notice')
		)!;
		const from = shell.getBoundingClientRect().height;
		button.click();
		const samples: number[] = [];
		let animated = false;
		for (let frame = 0; frame < 20; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
			samples.push(shell.getBoundingClientRect().height);
			animated ||= shell.getAnimations().length > 0;
		}
		await new Promise((resolve) => setTimeout(resolve, 120));
		const settled = shell.getBoundingClientRect().height;
		const largestStep = Math.max(
			...samples.slice(1).map((height, index) => Math.abs(height - samples[index]!)),
			0
		);
		return { from, samples, settled, largestStep, animated };
	});
	expect(stackResize.animated).toBe(true);
	expect(stackResize.settled).toBeGreaterThan(stackResize.from + 40);
	expect(stackResize.samples.some((height) => height > stackResize.from + 4)).toBe(true);
	expect(
		stackResize.samples.some(
			(height) => height > stackResize.from + 4 && height < stackResize.settled - 4
		)
	).toBe(true);
	expect(stackResize.largestStep).toBeLessThan(20);

	const density = scenes.filter({ has: page.getByRole('heading', { name: 'Density' }) });
	const densityResize = await density.evaluate(async (scene) => {
		const shell = scene.querySelector<HTMLElement>('#motion-density-shell')!;
		const button = scene.querySelector<HTMLButtonElement>('button')!;
		const from = shell.getBoundingClientRect().height;
		button.click();
		const samples: number[] = [];
		let animated = false;
		for (let frame = 0; frame < 30; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
			samples.push(shell.getBoundingClientRect().height);
			animated ||= shell.getAnimations().length > 0;
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
		const settled = shell.getBoundingClientRect().height;
		const largestStep = Math.max(
			...samples.slice(1).map((height, index) => Math.abs(height - samples[index]!)),
			0
		);
		return { from, samples, settled, largestStep, animated };
	});
	expect(densityResize.animated).toBe(true);
	expect(densityResize.settled).toBeLessThan(densityResize.from - 40);
	expect(
		densityResize.samples.some(
			(height) => height < densityResize.from - 4 && height > densityResize.settled + 4
		)
	).toBe(true);
	expect(densityResize.largestStep).toBeLessThan(20);
});

test('high-risk morph, shared, wrapping, rail, and swap scenes preserve visual continuity', async ({
	page
}) => {
	await page.goto('/demo/ui');
	const scenes = page.locator('main > section');

	const pack = scenes.filter({ has: page.getByRole('heading', { name: 'Pack and shuffle' }) });
	await pack.getByRole('button', { name: /^west$/i }).click();
	await waitForMotionToSettle(page);
	const replacementMotion = await pack.evaluate(async (scene) => {
		const button = [...scene.querySelectorAll('button')].find(
			(candidate) => candidate.textContent?.trim().toLowerCase() === 'north'
		)!;
		const initial = new Map(
			[...scene.querySelectorAll<HTMLElement>('article')].map((card) => {
				const rect = card.getBoundingClientRect();
				return [card.textContent?.replace(/\s+/g, ' ').trim() ?? '', { x: rect.x, y: rect.y }];
			})
		);
		let maximumOutgoingDrift = 0;
		let maximumSlotOpacity = 0;
		let outgoingProjected = false;
		button.click();
		for (let frame = 0; frame < 30; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			const cards = [...scene.querySelectorAll<HTMLElement>('article')];
			const byCode = (code: string) => cards.find((card) => card.textContent?.includes(code));
			for (const code of ['BGO', 'AES']) {
				const outgoing = byCode(code);
				if (!outgoing) continue;
				const from = initial.get(outgoing.textContent?.replace(/\s+/g, ' ').trim() ?? '')!;
				const rect = outgoing.getBoundingClientRect();
				maximumOutgoingDrift = Math.max(
					maximumOutgoingDrift,
					Math.hypot(rect.x - from.x, rect.y - from.y)
				);
				outgoingProjected ||= getComputedStyle(outgoing).transform !== 'none';
			}
			for (const [incomingCode, outgoingCode] of [
				['TOS', 'BGO'],
				['LYR', 'AES']
			] as const) {
				const opacity = (element: HTMLElement | undefined) =>
					element ? Number.parseFloat(getComputedStyle(element).opacity) : 0;
				maximumSlotOpacity = Math.max(
					maximumSlotOpacity,
					opacity(byCode(incomingCode)) + opacity(byCode(outgoingCode))
				);
			}
		}
		return {
			maximumOutgoingDrift,
			maximumSlotOpacity,
			outgoingProjected,
			animations: scene.getAnimations({ subtree: true }).length
		};
	});
	expect(replacementMotion.maximumOutgoingDrift).toBeLessThan(0.75);
	expect(replacementMotion.maximumSlotOpacity).toBeLessThanOrEqual(1.05);
	expect(replacementMotion.outgoingProjected).toBe(false);
	expect(replacementMotion.animations).toBe(0);
	const rapidReplacementMotion = await pack.evaluate(async (scene) => {
		const button = (name: string) =>
			[...scene.querySelectorAll('button')].find(
				(candidate) => candidate.textContent?.trim().toLowerCase() === name
			)!;
		const card = (code: string) =>
			[...scene.querySelectorAll<HTMLElement>('article')].find((item) =>
				item.textContent?.includes(code)
			);
		button('all').click();
		await new Promise((resolve) => setTimeout(resolve, 650));
		button('shuffle').click();
		await new Promise((resolve) => setTimeout(resolve, 55));
		button('west').click();
		await new Promise((resolve) => setTimeout(resolve, 55));
		const before = new Map(
			['BGO', 'AES'].map((code) => {
				const rect = card(code)!.getBoundingClientRect();
				return [code, { x: rect.x, y: rect.y }];
			})
		);
		button('north').click();
		let maximumFirstFramesDrift = 0;
		let maximumAnimationsPerExit = 0;
		for (let frame = 0; frame < 5; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			for (const code of ['BGO', 'AES']) {
				const outgoing = card(code);
				if (!outgoing) continue;
				const rect = outgoing.getBoundingClientRect();
				const origin = before.get(code)!;
				maximumFirstFramesDrift = Math.max(
					maximumFirstFramesDrift,
					Math.hypot(rect.x - origin.x, rect.y - origin.y)
				);
				maximumAnimationsPerExit = Math.max(
					maximumAnimationsPerExit,
					outgoing.getAnimations().length
				);
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 650));
		return {
			maximumFirstFramesDrift,
			maximumAnimationsPerExit,
			animations: scene.getAnimations({ subtree: true }).length
		};
	});
	expect(rapidReplacementMotion.maximumFirstFramesDrift).toBeLessThan(1);
	expect(rapidReplacementMotion.maximumAnimationsPerExit).toBeLessThanOrEqual(1);
	expect(rapidReplacementMotion.animations).toBe(0);

	const search = scenes.filter({ has: page.getByRole('heading', { name: 'Search morph' }) });
	const searchButton = search.getByRole('button', { name: 'Open search' });
	const searchButtonLeft = await searchButton.evaluate(
		(element) => element.getBoundingClientRect().left
	);
	await searchButton.click();
	await page.waitForTimeout(70);
	const searchGeometry = await search.evaluate((scene) => {
		const shell = scene.querySelector<HTMLElement>('.overflow-hidden.rounded-full')!;
		const inner = shell.firstElementChild!;
		const button = shell.querySelector('button')!;
		return {
			buttonLeft: button.getBoundingClientRect().left,
			shellTransform: getComputedStyle(shell).transform,
			innerTransform: getComputedStyle(inner).transform
		};
	});
	expect(Math.abs(searchGeometry.buttonLeft - searchButtonLeft)).toBeLessThan(0.5);
	expect(searchGeometry.shellTransform).toBe('none');
	expect(searchGeometry.innerTransform).toBe('none');

	const rowMark = scenes.filter({ has: page.getByRole('heading', { name: 'Row mark' }) });
	await rowMark.getByRole('button', { name: /Keflavik/ }).click();
	await waitForMotionToSettle(page);
	const rowFirstPaint = await rowMark.evaluate(async (scene) => {
		const buttons = [...scene.querySelectorAll('button')];
		const sourceTop = scene
			.querySelector<HTMLElement>('[aria-hidden="true"]')!
			.getBoundingClientRect().top;
		const targetTop = buttons.at(-1)!.getBoundingClientRect().top;
		buttons.at(-1)!.click();
		await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
		const mark = scene.querySelector<HTMLElement>('[aria-hidden="true"]')!;
		return {
			sourceTop,
			targetTop,
			visualTop: mark.getBoundingClientRect().top,
			animations: mark.getAnimations().length
		};
	});
	expect(rowFirstPaint.animations).toBeGreaterThan(0);
	expect(Math.abs(rowFirstPaint.visualTop - rowFirstPaint.targetTop)).toBeGreaterThan(20);
	expect(Math.abs(rowFirstPaint.visualTop - rowFirstPaint.sourceTop)).toBeLessThan(100);

	const card = scenes.filter({ has: page.getByRole('heading', { name: 'Card to stage' }) });
	await card.getByRole('button', { name: /Tromso/ }).click();
	await page.waitForTimeout(70);
	const cardLayers = await card.evaluate((scene) => {
		const stage = scene.querySelector<HTMLElement>('#motion-feature-stage')!;
		const background = stage.querySelector<HTMLElement>('[aria-hidden="true"]')!;
		const content = stage.querySelector<HTMLElement>('span.relative')!;
		const identities = [...content.querySelectorAll<HTMLElement>('.w-fit')];
		const identityState = identities.map((identity) => {
			const matrix = new DOMMatrixReadOnly(getComputedStyle(identity).transform);
			const rect = identity.getBoundingClientRect();
			const painted = document.elementFromPoint(
				rect.left + rect.width / 2,
				rect.top + rect.height / 2
			);
			return {
				opacity: Number.parseFloat(getComputedStyle(identity).opacity),
				scaleX: matrix.a,
				scaleY: matrix.d,
				painted: painted === identity || identity.contains(painted)
			};
		});
		return {
			backgroundAnimations: background.getAnimations().length,
			backgroundTransform: getComputedStyle(background).transform,
			contentTransform: getComputedStyle(content).transform,
			identityState
		};
	});
	expect(cardLayers.backgroundAnimations).toBeGreaterThan(0);
	expect(cardLayers.backgroundTransform).not.toBe('none');
	expect(cardLayers.contentTransform).toBe('none');
	expect(cardLayers.identityState).toHaveLength(2);
	for (const identity of cardLayers.identityState) {
		expect(identity.opacity).toBe(1);
		expect(identity.scaleX).toBeCloseTo(1, 4);
		expect(identity.scaleY).toBeCloseTo(1, 4);
		expect(identity.painted).toBe(true);
	}
	await card.getByRole('button', { name: /Close details for Tromso/ }).click();
	await page.waitForTimeout(70);
	const reversedIdentity = await card.getByRole('button', { name: /Tromso/ }).evaluate((button) =>
		[...button.querySelectorAll<HTMLElement>('.w-fit')].map((identity) => {
			const matrix = new DOMMatrixReadOnly(getComputedStyle(identity).transform);
			const rect = identity.getBoundingClientRect();
			const painted = document.elementFromPoint(
				rect.left + rect.width / 2,
				rect.top + rect.height / 2
			);
			return {
				opacity: Number.parseFloat(getComputedStyle(identity).opacity),
				scaleX: matrix.a,
				scaleY: matrix.d,
				painted: painted === identity || identity.contains(painted)
			};
		})
	);
	expect(reversedIdentity).toHaveLength(2);
	for (const identity of reversedIdentity) {
		expect(identity.opacity).toBe(1);
		expect(identity.scaleX).toBeCloseTo(1, 4);
		expect(identity.scaleY).toBeCloseTo(1, 4);
		expect(identity.painted).toBe(true);
	}

	const wrap = scenes.filter({ has: page.getByRole('heading', { name: 'Wrap' }) });
	for (const tag of ['VFR', 'RNAV', 'SID', 'STAR']) {
		await wrap.getByRole('button', { name: tag, exact: true }).click();
	}
	await waitForMotionToSettle(page);
	const wrapHeights = await wrap.evaluate(async (scene) => {
		const shell = scene.querySelector<HTMLElement>('.box-border.max-w-sm')!;
		const button = [...scene.querySelectorAll('button')].find(
			(candidate) => candidate.textContent?.trim() === 'STAR'
		)!;
		const from = shell.getBoundingClientRect().height;
		button.click();
		await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
		const first = shell.getBoundingClientRect().height;
		await new Promise((resolve) => setTimeout(resolve, 100));
		const middle = shell.getBoundingClientRect().height;
		return { from, first, middle, animations: shell.getAnimations().length };
	});
	expect(wrapHeights.animations).toBeGreaterThan(0);
	expect(wrapHeights.first).toBeGreaterThan(52);
	expect(wrapHeights.first).toBeLessThanOrEqual(wrapHeights.from);
	expect(wrapHeights.middle).toBeLessThan(wrapHeights.first);
	expect(wrapHeights.middle).toBeGreaterThan(52);

	const rail = scenes.filter({ has: page.getByRole('heading', { name: 'Rail' }) });
	const railGeometry = await rail.evaluate(async (scene) => {
		const aside = scene.querySelector('aside') as HTMLElement;
		const content = aside.firstElementChild as HTMLElement;
		const paragraph = content.lastElementChild as HTMLElement;
		const initialParagraphHeight = paragraph.getBoundingClientRect().height;
		const button = scene.querySelector('button') as HTMLButtonElement;
		const samples: Array<{
			width: number;
			paneLeft: number;
			opacity: number;
			contentWidth: number;
			paragraphHeight: number;
		}> = [];
		button.click();
		setTimeout(() => button.click(), 70);
		setTimeout(() => button.click(), 145);
		for (let frame = 0; frame < 42; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			const currentAside = scene.querySelector('aside') as HTMLElement | null;
			const currentContent = currentAside?.firstElementChild as HTMLElement | undefined;
			const currentParagraph = currentContent?.lastElementChild as HTMLElement | undefined;
			const pane = scene.querySelector('[class*="flex-1"]') as HTMLElement;
			samples.push({
				width: currentAside?.getBoundingClientRect().width ?? 0,
				paneLeft: pane.getBoundingClientRect().left,
				opacity: currentAside ? Number.parseFloat(getComputedStyle(currentAside).opacity) : 0,
				contentWidth: currentContent?.getBoundingClientRect().width ?? 128,
				paragraphHeight: currentParagraph?.getBoundingClientRect().height ?? initialParagraphHeight
			});
		}
		const adjacentMaximum = (values: number[]) =>
			Math.max(...values.slice(1).map((value, index) => Math.abs(value - values[index])), 0);
		return {
			initialParagraphHeight,
			maximumWidthStep: adjacentMaximum(samples.map((sample) => sample.width)),
			maximumPaneStep: adjacentMaximum(samples.map((sample) => sample.paneLeft)),
			maximumNarrowOpacity: Math.max(
				...samples.filter((sample) => sample.width < 88).map((sample) => sample.opacity),
				0
			),
			minimumContentWidth: Math.min(...samples.map((sample) => sample.contentWidth)),
			maximumContentWidth: Math.max(...samples.map((sample) => sample.contentWidth)),
			minimumParagraphHeight: Math.min(...samples.map((sample) => sample.paragraphHeight)),
			maximumParagraphHeight: Math.max(...samples.map((sample) => sample.paragraphHeight)),
			settledAnimations: scene.getAnimations().length
		};
	});
	expect(railGeometry.maximumWidthStep).toBeLessThan(35);
	expect(railGeometry.maximumPaneStep).toBeLessThan(35);
	expect(railGeometry.maximumNarrowOpacity).toBeLessThan(0.05);
	expect(railGeometry.minimumContentWidth).toBeCloseTo(128, 0);
	expect(railGeometry.maximumContentWidth).toBeCloseTo(128, 0);
	expect(railGeometry.minimumParagraphHeight).toBeCloseTo(railGeometry.initialParagraphHeight, 1);
	expect(railGeometry.maximumParagraphHeight).toBeCloseTo(railGeometry.initialParagraphHeight, 1);
	expect(railGeometry.settledAnimations).toBe(0);

	const swap = scenes.filter({ has: page.getByRole('heading', { name: 'Content swap' }) });
	await swap.getByRole('button', { name: 'Überblenden' }).click();
	const swapMotion = await swap.evaluate(async (scene) => {
		const button = scene.querySelector<HTMLButtonElement>('button[aria-label="Upload manifest"]')!;
		const content = button.querySelector<HTMLElement>(':scope > span.relative')!;
		const background = button.querySelector<HTMLElement>(':scope > [aria-hidden="true"]')!;
		button.click();
		let maximum = 0;
		let minimum = 1;
		let maximumBackgroundZ = 0;
		let minimumContentZ = Number.POSITIVE_INFINITY;
		let transformedContent = false;
		let clippedCopy = false;
		for (let frame = 0; frame < 28; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			const copies = [...button.querySelectorAll<HTMLElement>('[class*="grid-area"]')];
			const combinedOpacity = copies.reduce(
				(total, copy) => total + Number.parseFloat(getComputedStyle(copy).opacity),
				0
			);
			maximum = Math.max(maximum, combinedOpacity);
			minimum = Math.min(minimum, combinedOpacity);
			maximumBackgroundZ = Math.max(
				maximumBackgroundZ,
				Number.parseInt(getComputedStyle(background).zIndex, 10) || 0
			);
			minimumContentZ = Math.min(
				minimumContentZ,
				Number.parseInt(getComputedStyle(content).zIndex, 10) || 0
			);
			transformedContent ||= [button, content, ...copies].some(
				(element) => getComputedStyle(element).transform !== 'none'
			);
			clippedCopy ||= copies.some((copy) => getComputedStyle(copy).clipPath !== 'none');
		}
		return {
			maximum,
			minimum,
			transformedContent,
			clippedCopy,
			minimumContentZ,
			maximumBackgroundZ,
			backgroundAnimations: background.getAnimations().length
		};
	});
	expect(swapMotion.maximum).toBeLessThanOrEqual(1.05);
	expect(swapMotion.minimum).toBeGreaterThanOrEqual(0.95);
	expect(swapMotion.transformedContent).toBe(false);
	expect(swapMotion.clippedCopy).toBe(false);
	expect(swapMotion.minimumContentZ).toBeGreaterThan(swapMotion.maximumBackgroundZ);
	expect(swapMotion.backgroundAnimations).toBeGreaterThan(0);

	await waitForMotionToSettle(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await search.getByRole('button', { name: 'Close search' }).click();
	expect(await search.evaluate((scene) => scene.getAnimations({ subtree: true }).length)).toBe(0);
	await wrap.getByRole('button', { name: 'STAR', exact: true }).click();
	expect(await wrap.evaluate((scene) => scene.getAnimations({ subtree: true }).length)).toBe(0);
});

test('the 50 and 100 node fixtures stay linear and record Chromium layout metrics', async ({
	context,
	page
}, testInfo) => {
	await page.addInitScript(() => {
		const metrics = {
			rectReads: 0,
			allRectReads: 0,
			animations: 0,
			firstAnimationAt: 0,
			lastAnimationAt: 0,
			styleReadsAfterAnimation: 0,
			animationStarted: false,
			positionStyleReads: 0,
			radiusStyleReads: 0,
			scaleEvents: [] as Array<'style' | 'animate'>
		};
		Object.defineProperty(window, '__bedrockMotionMetrics', { value: metrics, writable: true });
		Object.defineProperty(window, '__bedrockDelayResizeObserver', {
			value: false,
			writable: true
		});
		const NativeResizeObserver = window.ResizeObserver;
		window.ResizeObserver = class extends NativeResizeObserver {
			constructor(callback: ResizeObserverCallback) {
				super((entries, observer) => {
					if (
						(window as typeof window & { __bedrockDelayResizeObserver: boolean })
							.__bedrockDelayResizeObserver
					) {
						setTimeout(() => callback(entries, observer), 120);
					} else callback(entries, observer);
				});
			}
		};
		const originalRect = HTMLElement.prototype.getBoundingClientRect;
		HTMLElement.prototype.getBoundingClientRect = function () {
			if (this.closest('[data-motion-stress-root]')) {
				metrics.allRectReads += 1;
				if (!metrics.animationStarted) metrics.rectReads += 1;
			}
			return originalRect.call(this);
		};
		const originalAnimate = Element.prototype.animate;
		Element.prototype.animate = function (...args) {
			const stress = Boolean(this.closest('[data-motion-stress-root]'));
			if (stress) {
				metrics.animations += 1;
				if (metrics.firstAnimationAt === 0) metrics.firstAnimationAt = performance.now();
				metrics.animationStarted = true;
			}
			if (this.closest('[data-motion-scale-root]')) metrics.scaleEvents.push('animate');
			const animation = originalAnimate.apply(this, args);
			if (stress) metrics.lastAnimationAt = performance.now();
			return animation;
		};
		const originalComputedStyle = window.getComputedStyle;
		window.getComputedStyle = function (...args) {
			const element = args[0];
			if (element instanceof Element && element.closest('[data-motion-stress-root]')) {
				metrics.positionStyleReads += 1;
			}
			if (element instanceof Element && element.closest('[data-motion-scale-root]')) {
				metrics.radiusStyleReads += 1;
				metrics.scaleEvents.push('style');
			}
			if (
				element instanceof Element &&
				element.closest('[data-motion-stress-root]') &&
				metrics.animationStarted
			) {
				metrics.styleReadsAfterAnimation += 1;
			}
			return originalComputedStyle.apply(window, args);
		};
	});

	const prerendered = await page.request.get('/demo/motion-test');
	expect(prerendered.ok()).toBe(true);
	expect(await prerendered.text()).toContain('data-motion-stress-root');
	await page.goto('/demo/motion-test');
	const client = await context.newCDPSession(page);
	await client.send('Performance.enable');
	const recorded: Array<Record<string, number>> = [];

	for (const count of [50, 100] as const) {
		await page.getByRole('button', { name: `${count} Knoten` }).click();
		await expect(page.locator('[data-motion-stress-root]')).toHaveAttribute(
			'data-count',
			String(count)
		);
		await waitForMotionToSettle(page);
		await page.evaluate(
			() =>
				new Promise<void>((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
				)
		);
		await waitForMotionToSettle(page);
		await page.evaluate(() => {
			const metrics = (
				window as typeof window & {
					__bedrockMotionMetrics: {
						rectReads: number;
						allRectReads: number;
						animations: number;
						firstAnimationAt: number;
						lastAnimationAt: number;
						styleReadsAfterAnimation: number;
						animationStarted: boolean;
						positionStyleReads: number;
					};
				}
			).__bedrockMotionMetrics;
			metrics.rectReads = 0;
			metrics.allRectReads = 0;
			metrics.animations = 0;
			metrics.firstAnimationAt = 0;
			metrics.lastAnimationAt = 0;
			metrics.styleReadsAfterAnimation = 0;
			metrics.animationStarted = false;
			metrics.positionStyleReads = 0;
		});

		await page.evaluate(() => {
			const metrics = (
				window as typeof window & {
					__bedrockMotionMetrics: {
						radiusStyleReads: number;
						scaleEvents: Array<'style' | 'animate'>;
					};
				}
			).__bedrockMotionMetrics;
			metrics.radiusStyleReads = 0;
			metrics.scaleEvents = [];
		});
		await page.getByRole('button', { name: 'Größe umschalten' }).click();
		await page.waitForFunction(
			() =>
				(
					window as typeof window & {
						__bedrockMotionMetrics: { scaleEvents: Array<'style' | 'animate'> };
					}
				).__bedrockMotionMetrics.scaleEvents.filter((event) => event === 'animate').length >= 2
		);
		await waitForMotionToSettle(page);
		const scaleProbe = await page.evaluate(
			() =>
				(
					window as typeof window & {
						__bedrockMotionMetrics: {
							radiusStyleReads: number;
							scaleEvents: Array<'style' | 'animate'>;
						};
					}
				).__bedrockMotionMetrics
		);
		expect(scaleProbe.radiusStyleReads).toBeGreaterThanOrEqual(2);
		expect(scaleProbe.scaleEvents.lastIndexOf('style')).toBeLessThan(
			scaleProbe.scaleEvents.indexOf('animate')
		);

		await page.evaluate(() => {
			(
				window as typeof window & { __bedrockDelayResizeObserver: boolean }
			).__bedrockDelayResizeObserver = true;
		});
		const before = metricMap((await client.send('Performance.getMetrics')).metrics);
		const clickStarted = await page.evaluate(() => {
			const button = [...document.querySelectorAll('button')].find(
				(candidate) => candidate.textContent?.trim() === 'Raster umschalten'
			);
			if (!(button instanceof HTMLButtonElement)) throw new Error('Stress toggle not found');
			const started = performance.now();
			button.click();
			return started;
		});
		await page.waitForFunction(
			(expected) =>
				(
					window as typeof window & {
						__bedrockMotionMetrics: { animations: number };
					}
				).__bedrockMotionMetrics.animations >= expected,
			count
		);
		await waitForMotionToSettle(page);
		await page.waitForTimeout(30);
		await page.evaluate(() => {
			(
				window as typeof window & { __bedrockDelayResizeObserver: boolean }
			).__bedrockDelayResizeObserver = false;
		});
		const after = metricMap((await client.send('Performance.getMetrics')).metrics);
		const structural = await page.evaluate(
			() =>
				(
					window as typeof window & {
						__bedrockMotionMetrics: {
							rectReads: number;
							allRectReads: number;
							animations: number;
							firstAnimationAt: number;
							lastAnimationAt: number;
							styleReadsAfterAnimation: number;
							positionStyleReads: number;
						};
					}
				).__bedrockMotionMetrics
		);

		expect(structural.animations).toBe(count);
		expect(structural.styleReadsAfterAnimation).toBe(0);
		expect(structural.positionStyleReads).toBe(0);
		expect(structural.rectReads).toBeGreaterThanOrEqual(count + 1);
		expect(structural.rectReads).toBeLessThanOrEqual(count + 4);
		expect(structural.allRectReads).toBeLessThanOrEqual(count + 4);
		expect(
			await page
				.locator('[data-motion-stress-root]')
				.evaluate((root) => root.getAnimations({ subtree: true }).length)
		).toBe(0);

		recorded.push({
			count,
			rectReads: structural.rectReads,
			allRectReads: structural.allRectReads,
			animations: structural.animations,
			animationLatency: structural.firstAnimationAt - clickStarted,
			animationReadyLatency: structural.lastAnimationAt - clickStarted,
			styleReadsAfterAnimation: structural.styleReadsAfterAnimation,
			LayoutCount: (after.LayoutCount ?? 0) - (before.LayoutCount ?? 0),
			LayoutDuration: (after.LayoutDuration ?? 0) - (before.LayoutDuration ?? 0),
			RecalcStyleCount: (after.RecalcStyleCount ?? 0) - (before.RecalcStyleCount ?? 0),
			RecalcStyleDuration: (after.RecalcStyleDuration ?? 0) - (before.RecalcStyleDuration ?? 0),
			TaskDuration: (after.TaskDuration ?? 0) - (before.TaskDuration ?? 0)
		});
	}

	await testInfo.attach('bedrock-motion-performance.json', {
		body: JSON.stringify(recorded, null, 2),
		contentType: 'application/json'
	});
});
