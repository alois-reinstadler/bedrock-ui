// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Entry point invoked by Chrome MCP evaluate_script.
async function interruptionSuite() {
	const wait = (ms) => new Promise((r) => setTimeout(r, ms));
	const until = async (f) => {
		const deadline = performance.now() + 6000;
		while (!f()) {
			if (performance.now() > deadline) throw Error('timeout');
			await wait(15);
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
	const check = (name, pass, detail) => {
		checks.push({ name, pass, detail });
		if (!pass) throw Error(name);
	};
	const go = async (path) => {
		const a = document.createElement('a');
		a.href = '/demo/motion-route-prototype/' + path;
		document.body.append(a);
		a.click();
		a.remove();
		await until(() => location.pathname.endsWith(path));
		await wait(80);
	};
	try {
		await until(root);
		root()
			.getAnimations({ subtree: true })
			.forEach((a) => a.finish());
		const slow = document.querySelector('input');
		if (!slow.checked) slow.click();
		for (const fraction of [0.25, 0.5, 0.75]) {
			await go('list');
			root()
				.getAnimations({ subtree: true })
				.forEach((a) => a.finish());
			await wait(30);
			await go('detail/a');
			await until(() => root().getAnimations({ subtree: true }).length > 0);
			const animations = root().getAnimations({ subtree: true });
			animations.forEach((a) => {
				a.pause();
				a.currentTime = 1600 * fraction;
			});
			await wait(20);
			const box = root().querySelector('[data-prototype-layer=image]');
			const track = animations.find(
				(a) => a.effect.target === box && 'left' in a.effect.getKeyframes()[0]
			);
			const position = (time) => {
				track.currentTime = time;
				return box.getBoundingClientRect().width;
			};
			const beforeVelocity = (position(1600 * fraction) - position(1600 * fraction - 8)) / 8;
			position(1600 * fraction);
			history.back();
			await until(() => location.pathname.endsWith('/list'));
			await wait(80);
			const interrupt = events()
				.filter((e) => e.event === 'interrupt')
				.at(-1);
			const err = Math.max(
				...interrupt.before.flatMap((b, i) =>
					['x', 'y', 'width', 'height'].map((k) => Math.abs(b.box[k] - interrupt.after[i].box[k]))
				)
			);
			check('position at ' + fraction, err < 0.05, { error: err });
			const newbox = root().querySelector('[data-prototype-layer=image]');
			const next = root()
				.getAnimations({ subtree: true })
				.find((a) => a.effect.target === newbox && 'left' in a.effect.getKeyframes()[0]);
			next.pause();
			next.currentTime = 0;
			const p0 = newbox.getBoundingClientRect().width;
			next.currentTime = 8;
			const afterVelocity = (newbox.getBoundingClientRect().width - p0) / 8;
			check('browser velocity at ' + fraction, Math.abs(beforeVelocity - afterVelocity) < 0.035, {
				beforeVelocity,
				afterVelocity,
				error: Math.abs(beforeVelocity - afterVelocity),
				tolerance: 0.035
			});
			root()
				.getAnimations({ subtree: true })
				.forEach((a) => a.finish());
			await wait(50);
		}
		// Twenty complete round trips, with no animation or suppression left behind.
		slow.click();
		for (let i = 0; i < 20; i++) {
			await go('detail/a');
			await until(() => !root().children.length);
			await go('list');
			await until(() => !root().children.length);
		}
		check(
			'20 complete round trips cleaned',
			!root().children.length && !root().getAnimations({ subtree: true }).length
		);
		return { passed: checks.length, checks };
	} catch (e) {
		root()
			.getAnimations({ subtree: true })
			.forEach((a) => a.finish());
		return { error: String(e), checks };
	}
}
