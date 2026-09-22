/** Run this function through Chrome MCP evaluate_script on the hydrated prototype list route.
 * Desktop viewport 1280x1000, prefers-reduced-motion: no-preference, normal network.
 * Tests use real Kit navigation; only WAAPI playback time is controlled for exact sampling.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Entry point invoked by Chrome MCP evaluate_script.
async function motionBrowserSuite() {
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));
	const until = async (test, label) => {
		const end = performance.now() + 7000;
		while (!test()) {
			if (performance.now() > end) throw Error('Timeout: ' + label);
			await wait(20);
		}
	};
	const root = () => document.querySelector('[data-prototype-overlay]');
	const events = () =>
		document
			.querySelector('[data-prototype-events]')
			.textContent.trim()
			.split('\n')
			.filter(Boolean)
			.map(JSON.parse);
	const checks = [];
	const check = (name, ok, detail) => {
		checks.push({ name, pass: !!ok, detail });
		if (!ok) throw Error(name + ': ' + JSON.stringify(detail));
	};
	const go = async (path) => {
		const a = document.createElement('a');
		a.href = '/demo/motion-route-prototype/' + path;
		a.dataset.sveltekitPreloadData = 'off';
		document.body.append(a);
		a.click();
		a.remove();
		await until(
			() =>
				location.pathname + location.search === new URL(a.href).pathname + new URL(a.href).search,
			'route ' + path
		);
		await wait(70);
	};
	const clean = async () => {
		await until(() => !root().children.length, 'cleanup');
		check(
			'no hidden matched parts',
			![...document.querySelectorAll('[data-route-part]')].some(
				(n) => getComputedStyle(n).opacity === '0'
			)
		);
	};
	const slow = (value) => {
		const n = document.querySelector('input[type=checkbox]');
		if (n.checked !== value) n.click();
	};
	const pause = async (fraction) => {
		const a = root().getAnimations({ subtree: true });
		for (const x of a) {
			x.pause();
			x.currentTime = Number(x.effect.getTiming().duration) * fraction;
		}
		await wait(35);
		return a;
	};
	const resume = () =>
		root()
			.getAnimations({ subtree: true })
			.forEach((a) => a.play());
	try {
		await until(root, 'hydration');
		slow(false);
		await go('list');
		await clean();
		const list = document.querySelector('[data-route-scroll=collection]');
		list.scrollTop = 95;
		window.scrollTo(0, 100);
		await wait(60);
		const saved = { nested: list.scrollTop, document: scrollY };
		slow(true);
		await go('detail/a');
		await until(() => events().at(-1)?.event === 'play', 'play');
		await pause(0.5);
		check(
			'three independent nested layers',
			root().querySelectorAll('[data-prototype-layer]').length === 3
		);
		check(
			'two ancestor clips per layer',
			[...root().querySelectorAll('[data-prototype-layer]')].every(
				(n) =>
					getComputedStyle(n.parentElement).clipPath !== 'none' &&
					getComputedStyle(n.parentElement.parentElement).clipPath !== 'none'
			)
		);
		const copies = [...root().querySelector('[data-prototype-layer=title]').children];
		check(
			'natural text has no transform',
			copies.every((n) => getComputedStyle(n).transform === 'none')
		);
		const bitmap = root().querySelector('img'),
			b = bitmap.getBoundingClientRect();
		check(
			'image intrinsic ratio preserved',
			Math.abs(b.width / b.height - bitmap.naturalWidth / bitmap.naturalHeight) < 0.002
		);
		const proxy = [...root().querySelectorAll('[data-prototype-layer]')].map((n) => ({
			part: n.dataset.prototypeLayer,
			box: n.getBoundingClientRect().toJSON()
		}));
		history.back();
		await until(() => location.pathname.endsWith('/list'), 'back');
		await until(() => events().some((e) => e.event === 'interrupt'), 'interrupt');
		await wait(60);
		const interrupt = events()
			.filter((e) => e.event === 'interrupt')
			.at(-1);
		const error = Math.max(
			...interrupt.before.flatMap((b, i) =>
				['x', 'y', 'width', 'height'].map((k) => Math.abs(b.box[k] - interrupt.after[i].box[k]))
			)
		);
		check('interrupted position continuity', error <= 0.05, { error, proxy });
		check(
			'nonzero velocity retained',
			interrupt.momentum.some((p) =>
				p.tracks.some((t) => t.name === 'box' && t.velocity.some((v) => Math.abs(v) > 0.01))
			),
			interrupt.momentum
		);
		check(
			'history document and nested scroll restored',
			Math.abs(scrollY - saved.document) < 1 &&
				document.querySelector('[data-route-scroll=collection]').scrollTop === saved.nested,
			{
				saved,
				actual: {
					document: scrollY,
					nested: document.querySelector('[data-route-scroll=collection]').scrollTop
				}
			}
		);
		history.forward();
		await until(() => location.pathname.endsWith('/detail/a'), 'forward');
		await wait(100);
		check(
			'rapid back/forward reuses bounded layers',
			root().querySelectorAll('[data-prototype-layer]').length === 3
		);
		await pause(0.35);
		resume();
		document.querySelector('[data-route-scroll=detail]').scrollTop = 55;
		await wait(100);
		check(
			'scroll retargets without settling',
			events().some((e) => e.event === 'scroll-retarget') && root().children.length === 3
		);
		const button = (text) =>
			[...document.querySelectorAll('button')].find((n) => n.textContent.includes(text));
		button('Toggle late content').click();
		await wait(120);
		check(
			'late content remeasured',
			events().some((e) => e.event === 'resize-retarget') && root().children.length === 3
		);
		button('Change typography').click();
		await wait(120);
		check(
			'new typography bounded and unscaled',
			root().querySelector('[data-prototype-layer=title]').children.length <= 2 &&
				[...root().querySelector('[data-prototype-layer=title]').children].every(
					(n) => getComputedStyle(n).transform === 'none'
				)
		);
		button('Open modal').click();
		check('modal occupies browser top layer', document.querySelector('dialog').matches(':modal'));
		button('Close modal').click();
		await clean();
		slow(false);
		await go('list');
		await clean();
		slow(true);
		await go('detail/a?art=1');
		await until(() => events().at(-1)?.event === 'play', 'art play');
		await pause(0.5);
		check(
			'decoded art-directed image handoff',
			root().querySelectorAll('img').length === 2 &&
				[...root().querySelectorAll('img')].every((i) => i.complete && i.naturalWidth)
		);
		check(
			'both bitmap aspect ratios preserved',
			[...root().querySelectorAll('img')].every((i) => {
				const b = i.getBoundingClientRect();
				return Math.abs(b.width / b.height - i.naturalWidth / i.naturalHeight) < 0.002;
			})
		);
		resume();
		await clean();
		slow(false);
		await go('list');
		await clean();
		// A pending load must not replace a newer B navigation.
		const a = document.createElement('a');
		a.href = '/demo/motion-route-prototype/detail/a?delay=650';
		document.body.append(a);
		a.click();
		a.remove();
		await wait(150);
		check(
			'source stays interactive while data loads',
			location.pathname.endsWith('/list') && !root().children.length
		);
		await go('detail/b');
		await wait(900);
		check('latest navigation wins', location.pathname.endsWith('/detail/b'));
		await clean();
		for (let i = 0; i < 10; i++) {
			await go('list');
			await clean();
			await go('detail/a');
			await clean();
		}
		check('ten round trips leave zero proxy nodes', root().childElementCount === 0);
		return { passed: checks.length, checks, events: events() };
	} catch (error) {
		resume();
		return {
			error: String(error),
			passed: checks.filter((c) => c.pass).length,
			checks,
			events: events()
		};
	}
}
