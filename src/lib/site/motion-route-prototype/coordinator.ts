import { onNavigate, snapshot } from '$app/navigation';
import { onMount } from 'svelte';
import { coverBox, trajectory, intersect, type Box } from './geometry.js';

type Part = 'surface' | 'image' | 'title';
type Event = { event: string; generation: number; [key: string]: unknown };
type Track = {
	node: HTMLElement;
	from: number[];
	to: number[];
	velocity: number[];
	duration: number;
	format: (values: number[]) => Keyframe;
	read?: () => number[];
	animation?: Animation;
};
type Layer = {
	part: Part;
	node: HTMLElement;
	shell: HTMLElement;
	masks: HTMLElement[];
	tracks: Map<string, Track>;
	fades: Animation[];
	target?: HTMLElement;
};
type Session = {
	id: string;
	generation: number;
	revision: number;
	layers: Layer[];
	abort: AbortController;
	phase: 'captured' | 'waiting' | 'playing';
	resize?: ResizeObserver;
};
export type PrototypeOptions = {
	getReduced: () => boolean;
	getSlow: () => boolean;
	onEvent: (event: Event) => void;
	/** Application identity mapping is separate from the rendering coordinator. */
	identity: (from: URL | undefined, to: URL | undefined) => string | undefined;
};
const scope = '[data-route-scope="stories"]';
const rect = (node: Element): Box => {
	const b = node.getBoundingClientRect();
	return { x: b.x, y: b.y, width: b.width, height: b.height };
};
const vector = (b: Box) => [b.x, b.y, b.width, b.height];
const boxFrame = ([x, y, width, height]: number[]): Keyframe => ({
	left: `${x}px`,
	top: `${y}px`,
	width: `${Math.max(0, width)}px`,
	height: `${Math.max(0, height)}px`
});
const clipFrame = ([x, y, width, height, radius]: number[]): Keyframe => ({
	clipPath: `inset(${y}px calc(100% - ${x + width}px) calc(100% - ${y + height}px) ${x}px round ${Math.max(0, radius)}px)`
});
const pin = (node: HTMLElement, values: number[]) => Object.assign(node.style, boxFrame(values));
const viewport = () => [0, 0, innerWidth, innerHeight, 0];

function clips(node: HTMLElement): number[][] {
	const result: number[][] = [];
	for (
		let parent = node.parentElement;
		parent && parent !== document.body;
		parent = parent.parentElement
	) {
		const style = getComputedStyle(parent);
		const x = /hidden|clip|auto|scroll/.test(style.overflowX);
		const y = /hidden|clip|auto|scroll/.test(style.overflowY);
		if (!x && !y) continue;
		const b = rect(parent);
		result.unshift([
			x ? b.x + parent.clientLeft : 0,
			y ? b.y + parent.clientTop : 0,
			x ? parent.clientWidth : innerWidth,
			y ? parent.clientHeight : innerHeight,
			parseFloat(style.borderTopLeftRadius) || 0
		]);
	}
	return result;
}
function supported(node: HTMLElement) {
	for (let p: HTMLElement | null = node; p && p !== document.body; p = p.parentElement) {
		const s = getComputedStyle(p);
		if (s.perspective !== 'none' || s.clipPath !== 'none' || s.maskImage !== 'none') return false;
		if (s.transform !== 'none') {
			const matrix = new DOMMatrixReadOnly(s.transform);
			// Translation is safe in viewport space; scale/rotation need a richer renderer.
			if (!matrix.is2D || matrix.a !== 1 || matrix.d !== 1 || matrix.b || matrix.c) return false;
		}
	}
	return clips(node).length <= 8;
}
function textCopy(source: HTMLElement) {
	const text = document.createElement('div');
	const s = getComputedStyle(source);
	const keys = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'lineHeight',
		'letterSpacing',
		'color',
		'textAlign',
		'textTransform'
	] as const;
	for (const key of keys) text.style[key] = s[key];
	text.style.cssText += ';position:absolute;margin:0;';
	text.textContent = source.textContent;
	pin(text, [0, 0, source.offsetWidth, source.offsetHeight]);
	text.dataset.typesetting = JSON.stringify([
		source.textContent,
		source.offsetWidth,
		...keys.map((k) => s[k])
	]);
	return text;
}
function crop(image: HTMLImageElement, box: Box) {
	const position = getComputedStyle(image)
		.objectPosition.split(' ')
		.map((v) => parseFloat(v) / 100);
	return vector(
		coverBox(box, image.naturalWidth || 1600, image.naturalHeight || 900, position[0], position[1])
	);
}
function wait(ms: number, signal: AbortSignal) {
	return new Promise<void>((resolve) => {
		if (signal.aborted) return resolve();
		const finish = () => {
			clearTimeout(timer);
			signal.removeEventListener('abort', finish);
			resolve();
		};
		const timer = setTimeout(finish, ms);
		signal.addEventListener('abort', finish, { once: true });
	});
}

export function installRoutePrototype(options: PrototypeOptions) {
	let root: HTMLDivElement | undefined;
	let suppression: HTMLStyleElement | undefined;
	let active: Session | undefined;
	let sequence = 0;
	let scheduled = 0;
	let media: MediaQueryList | undefined;
	const ancillary = new Set<Animation>();
	const reduced = () => options.getReduced() || !!media?.matches;
	const emit = (event: string, extra: Record<string, unknown> = {}) =>
		options.onEvent({ event, generation: sequence, ...extra });
	const parts = (id: string) =>
		[
			...document.querySelectorAll<HTMLElement>(
				`${scope} [data-route-entity="${CSS.escape(id)}"] [data-route-part]`
			)
		].filter((n) => n.closest('[data-route-entity]')?.getAttribute('data-route-entity') === id);
	const unique = (nodes: HTMLElement[]) =>
		nodes.length === 3 && new Set(nodes.map((n) => n.dataset.routePart)).size === 3;

	// Kit 3's public snapshot helper keys state by HISTORY ENTRY (including shallow entries).
	// The older page-export snapshot API is deprecated in this installed version.
	snapshot({
		id: 'motion-prototype-scrollers',
		capture: () =>
			Object.fromEntries(
				[...document.querySelectorAll<HTMLElement>(`${scope} [data-route-scroll]`)].map((n) => [
					n.dataset.routeScroll!,
					[n.scrollLeft, n.scrollTop]
				])
			),
		restore: (saved: Record<string, number[]>) => {
			for (const n of document.querySelectorAll<HTMLElement>(`${scope} [data-route-scroll]`)) {
				const value = saved[n.dataset.routeScroll!];
				if (value) n.scrollTo(value[0], value[1]);
			}
		}
	});

	function finish(reason: string) {
		const previous = active;
		active = undefined;
		for (const animation of ancillary) animation.cancel();
		ancillary.clear();
		cancelAnimationFrame(scheduled);
		scheduled = 0;
		previous?.abort.abort();
		previous?.resize?.disconnect();
		for (const layer of previous?.layers ?? []) {
			for (const track of layer.tracks.values()) track.animation?.cancel();
			for (const fade of layer.fades) fade.cancel();
			layer.shell.remove();
		}
		if (suppression) suppression.textContent = '';
		if (previous) emit(reason, { layers: root?.childElementCount ?? 0 });
	}
	function revealRemainder(all = false) {
		for (const n of document.querySelectorAll<HTMLElement>(
			`${scope} [data-route-remainder]${all ? `, ${scope} [data-route-part]` : ''}`
		)) {
			if (!reduced() && typeof n.animate === 'function') {
				try {
					const a = n.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: 140,
						easing: 'cubic-bezier(0.2,0,0,1)'
					});
					ancillary.add(a);
					void a.finished.finally(() => ancillary.delete(a)).catch(() => undefined);
				} catch {
					/* Optional fade failure must leave authoritative content visible. */
				}
			}
		}
	}
	function ensureMasks(layer: Layer, count: number) {
		while (layer.masks.length < count) {
			const mask = document.createElement('div');
			mask.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
			const parent = layer.masks.at(-1) ?? layer.shell;
			parent.append(mask);
			mask.append(layer.node);
			layer.masks.push(mask);
		}
	}
	function makeLayer(source: HTMLElement): Layer {
		const part = source.dataset.routePart as Part;
		const shell = document.createElement('div');
		shell.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
		const node = document.createElement('div');
		node.dataset.prototypeLayer = part;
		node.style.cssText = 'position:absolute;box-sizing:border-box;pointer-events:none;';
		pin(node, vector(rect(source)));
		const style = getComputedStyle(source);
		node.style.borderRadius = style.borderRadius;
		shell.style.zIndex = String(['surface', 'image', 'title'].indexOf(part));
		shell.append(node);
		root!.append(shell);
		const layer: Layer = { part, node, shell, masks: [], tracks: new Map(), fades: [] };
		const ancestry = clips(source);
		ensureMasks(layer, ancestry.length);
		ancestry.forEach((values, i) => Object.assign(layer.masks[i].style, clipFrame(values)));
		if (part === 'surface') {
			node.style.backgroundColor = style.backgroundColor;
			node.style.border = style.border;
			node.style.boxShadow = style.boxShadow;
		} else if (part === 'image') {
			node.style.overflow = 'hidden';
			const image = source.querySelector('img')!;
			const bitmap = document.createElement('img');
			bitmap.src = image.currentSrc || image.src;
			bitmap.alt = '';
			bitmap.style.cssText = 'position:absolute;max-width:none;';
			pin(bitmap, crop(image, rect(source)));
			node.append(bitmap);
		} else node.append(textCopy(source));
		// Seed tracks so the first clip animation has the actual source ancestry.
		ancestry.forEach((values, i) =>
			layer.tracks.set(`clip${i}`, {
				node: layer.masks[i],
				from: values,
				to: values,
				velocity: values.map(() => 0),
				duration: 1,
				format: clipFrame
			})
		);
		return layer;
	}
	function freeze(layer: Layer) {
		const report: Record<string, unknown>[] = [];
		for (const [name, track] of layer.tracks) {
			const time = Number(track.animation?.currentTime ?? track.duration);
			const sampled = track.from.map((from, i) =>
				trajectory(from, track.to[i], track.velocity[i], track.duration, time)
			);
			const current = track.read?.() ?? sampled.map((v) => v.position);
			const speed = track.animation ? sampled.map((v) => v.velocity) : track.velocity;
			Object.assign(track.node.style, track.format(current));
			track.animation?.cancel();
			track.from = current;
			track.to = current;
			track.velocity = speed;
			track.animation = undefined;
			report.push({ name, position: current, velocity: speed });
		}
		for (const fade of layer.fades) {
			const n = (fade.effect as KeyframeEffect).target as HTMLElement;
			n.style.opacity = getComputedStyle(n).opacity;
			fade.cancel();
		}
		layer.fades = [];
		return report;
	}
	function capture(id: string) {
		if (!root || !suppression) return;
		let layers: Layer[];
		if (active?.id === id) {
			const previous = active;
			previous.abort.abort();
			previous.resize?.disconnect();
			layers = previous.layers;
			const before = layers.map((l) => ({ part: l.part, box: rect(l.node) }));
			const momentum = layers.map((l) => ({ part: l.part, tracks: freeze(l) }));
			emit('interrupt', {
				before,
				after: layers.map((l) => ({ part: l.part, box: rect(l.node) })),
				momentum
			});
		} else {
			finish('superseded');
			const sources = parts(id);
			if (!unique(sources)) {
				emit('unpaired', { id });
				return;
			}
			if (!sources.every(supported)) {
				emit('unsupported-geometry', { id });
				return;
			}
			let visible = rect(sources.find((n) => n.dataset.routePart === 'image')!);
			for (const c of clips(sources[0]))
				visible = intersect(visible, { x: c[0], y: c[1], width: c[2], height: c[3] });
			if (!intersect(visible, { x: 0, y: 0, width: innerWidth, height: innerHeight }).height) {
				emit('offscreen', { id });
				return;
			}
			layers = sources.map(makeLayer);
		}
		const session: Session = {
			id,
			layers,
			generation: ++sequence,
			revision: 0,
			abort: new AbortController(),
			phase: 'captured'
		};
		active = session;
		suppression.textContent = `${scope} [data-route-entity="${CSS.escape(id)}"] [data-route-part], ${scope} [data-route-remainder] {opacity:0!important}`;
		emit('capture', { id, layers: layers.length });
		return session;
	}
	function runTrack(
		layer: Layer,
		name: string,
		node: HTMLElement,
		from: number[],
		to: number[],
		format: Track['format'],
		duration: number,
		read?: Track['read']
	) {
		const previous = layer.tracks.get(name);
		const velocity = previous?.velocity ?? from.map(() => 0);
		const track: Track = { node, from, to, velocity, duration, format, read };
		const frames = Array.from({ length: 121 }, (_, i) =>
			format(
				from.map(
					(value, j) =>
						trajectory(value, to[j], velocity[j], duration, (duration * i) / 120).position
				)
			)
		);
		track.animation = node.animate(frames, { duration, easing: 'linear', fill: 'both' });
		layer.tracks.set(name, track);
		return track.animation;
	}
	function fade(layer: Layer, node: HTMLElement, frames: Keyframe[], duration: number) {
		const animation = node.animate(frames, { duration, easing: 'linear', fill: 'both' });
		layer.fades.push(animation);
		return animation;
	}
	function animate(session: Session, reason: string) {
		if (active !== session) return;
		if (reduced()) return finish('reduced');
		const targets = parts(session.id);
		if (!unique(targets) || !targets.every(supported)) return finish('unsupported-target');
		const revision = ++session.revision;
		const before = session.layers.map((l) => ({ part: l.part, box: rect(l.node) }));
		if (session.phase === 'playing') session.layers.forEach(freeze);
		const duration = options.getSlow() ? 1600 : reason === 'play' ? 360 : 240;
		const animations: Animation[] = [];
		for (const layer of session.layers) {
			const target = targets.find((n) => n.dataset.routePart === layer.part)!;
			layer.target = target;
			const from = rect(layer.node);
			const to = rect(target);
			animations.push(
				runTrack(layer, 'box', layer.node, vector(from), vector(to), boxFrame, duration, () =>
					vector(rect(layer.node))
				)
			);
			const ancestry = clips(target);
			ensureMasks(layer, Math.max(ancestry.length, layer.masks.length));
			layer.masks.forEach((mask, i) => {
				const track = layer.tracks.get(`clip${i}`);
				animations.push(
					runTrack(
						layer,
						`clip${i}`,
						mask,
						track?.from ?? viewport(),
						ancestry[i] ?? viewport(),
						clipFrame,
						duration
					)
				);
			});
			const radius = parseFloat(getComputedStyle(layer.node).borderTopLeftRadius) || 0;
			const targetRadius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
			animations.push(
				runTrack(
					layer,
					'radius',
					layer.node,
					[radius],
					[targetRadius],
					([r]) => ({ borderRadius: `${Math.max(0, r)}px` }),
					duration,
					() => [parseFloat(getComputedStyle(layer.node).borderTopLeftRadius) || 0]
				)
			);
			if (layer.part === 'image') {
				const targetImage = target.querySelector('img')!;
				for (const bitmap of [...layer.node.children]) {
					const image = bitmap as HTMLImageElement;
					const current = rect(image);
					const outer = rect(layer.node);
					const end = crop(targetImage, to);
					// Art-directed sources retain their own aspect ratio and crop during crossfade.
					const bitmapEnd =
						image.naturalWidth && image.naturalHeight
							? vector(
									coverBox(
										to,
										image.naturalWidth,
										image.naturalHeight,
										...getComputedStyle(targetImage)
											.objectPosition.split(' ')
											.map((v) => parseFloat(v) / 100)
									)
								)
							: end;
					animations.push(
						runTrack(
							layer,
							`bitmap:${image.src}`,
							image,
							[current.x - outer.x, current.y - outer.y, current.width, current.height],
							bitmapEnd,
							boxFrame,
							duration,
							() => {
								const b = rect(image),
									o = rect(layer.node);
								return [b.x - o.x, b.y - o.y, b.width, b.height];
							}
						)
					);
					if (layer.node.children.length > 1)
						animations.push(
							fade(
								layer,
								image,
								[
									{ opacity: getComputedStyle(image).opacity },
									{ opacity: image.src === targetImage.src ? 1 : 0 }
								],
								duration
							)
						);
				}
			} else if (layer.part === 'title') {
				const candidate = textCopy(target);
				let next = [...layer.node.children].find(
					(n) => (n as HTMLElement).dataset.typesetting === candidate.dataset.typesetting
				) as HTMLElement | undefined;
				if (!next) {
					// At most two typographic representations. Superseded low-opacity copy is discarded.
					if (layer.node.children.length >= 2) {
						const copies = [...layer.node.children] as HTMLElement[];
						copies.sort(
							(a, b) => Number(getComputedStyle(a).opacity) - Number(getComputedStyle(b).opacity)
						);
						const survivor = copies[1];
						survivor.style.opacity = String(
							Math.min(
								1,
								Number(survivor.style.opacity || 1) + Number(copies[0].style.opacity || 0)
							)
						);
						copies[0].remove();
					}
					next = candidate;
					next.style.opacity = '0';
					layer.node.append(next);
				}
				for (const copy of [...layer.node.children] as HTMLElement[]) {
					const opacity = Number(getComputedStyle(copy).opacity);
					animations.push(
						fade(
							layer,
							copy,
							copy === next
								? [
										{ opacity },
										{ opacity, offset: opacity ? 0 : 0.3 },
										{ opacity: 1, offset: 0.75 },
										{ opacity: 1 }
									]
								: [{ opacity }, { opacity: 0, offset: 0.4 }, { opacity: 0 }],
							duration
						)
					);
				}
			}
		}
		const start = document.timeline.currentTime;
		if (typeof start === 'number') animations.forEach((a) => (a.startTime = start));
		session.phase = 'playing';
		emit(reason, {
			id: session.id,
			revision,
			duration,
			scrollY,
			before,
			after: session.layers.map((l) => ({ part: l.part, box: rect(l.node) })),
			targets: targets.map((n) => ({ part: n.dataset.routePart, box: rect(n), clips: clips(n) }))
		});
		void Promise.all(animations.map((a) => a.finished))
			.then(() => {
				if (active === session && revision === session.revision) {
					finish('complete');
					revealRemainder();
				}
			})
			.catch(() => undefined);
	}
	function schedule(reason: string) {
		if (!active || active.phase !== 'playing' || scheduled) return;
		scheduled = requestAnimationFrame(() => {
			scheduled = 0;
			const session = active;
			if (session?.phase === 'playing') {
				const changed =
					reason === 'font-retarget' ||
					session.layers.some((layer) => {
						if (!layer.target?.isConnected) return true;
						const destination = vector(rect(layer.target));
						const old = layer.tracks.get('box')?.to;
						if (!old || destination.some((n, i) => Math.abs(n - old[i]) > 0.25)) return true;
						const ancestry = clips(layer.target);
						return layer.masks.some((_, i) =>
							(ancestry[i] ?? viewport()).some(
								(n, j) => Math.abs(n - (layer.tracks.get(`clip${i}`)?.to[j] ?? n)) > 0.25
							)
						);
					});
				if (!changed) return;
				try {
					animate(session, reason);
				} catch {
					finish('playback-error');
				}
			}
		});
	}
	async function commit(session: Session) {
		if (active !== session) return;
		session.phase = 'waiting';
		const targets = parts(session.id);
		if (!unique(targets)) return finish('missing-target');
		const imageTarget = targets.find((n) => n.dataset.routePart === 'image')!;
		const image = imageTarget.querySelector('img')!;
		const readiness = new AbortController();
		const abort = () => readiness.abort();
		session.abort.signal.addEventListener('abort', abort, { once: true });
		let decoded = false;
		const decode = image
			.decode()
			.then(() => {
				decoded = true;
			})
			.catch(() => undefined);
		await Promise.race([
			Promise.all([decode, wait(Number(imageTarget.dataset.readyDelay || 0), readiness.signal)]),
			wait(800, readiness.signal)
		]);
		readiness.abort();
		session.abort.signal.removeEventListener('abort', abort);
		if (active !== session) return;
		if (!decoded) {
			// Reserve the final image box and expose its placeholder; never leave an image hidden.
			emit('image-fallback', { loaded: image.complete, naturalWidth: image.naturalWidth });
			finish('readiness-budget');
			revealRemainder();
			return;
		}
		const imageLayer = session.layers.find((l) => l.part === 'image')!;
		const bitmap = imageLayer.node.firstElementChild as HTMLImageElement;
		if (
			bitmap.src !== image.src &&
			![...imageLayer.node.children].some((n) => (n as HTMLImageElement).src === image.src)
		) {
			if (imageLayer.node.children.length >= 2) {
				const copies = [...imageLayer.node.children] as HTMLImageElement[];
				copies.sort(
					(a, b) => Number(getComputedStyle(a).opacity) - Number(getComputedStyle(b).opacity)
				);
				const opacity = copies.reduce((sum, n) => sum + Number(getComputedStyle(n).opacity), 0);
				const removed = copies[0];
				imageLayer.tracks.get(`bitmap:${removed.src}`)?.animation?.cancel();
				imageLayer.tracks.delete(`bitmap:${removed.src}`);
				removed.remove();
				copies[1].style.opacity = String(Math.min(1, opacity));
			}
			const next = document.createElement('img');
			next.src = image.src;
			next.alt = '';
			next.style.cssText = 'position:absolute;max-width:none;opacity:0;';
			pin(next, crop(image, rect(imageLayer.node)));
			imageLayer.node.append(next);
			await next.decode().catch(() => undefined);
			if (active !== session) return;
		}
		animate(session, 'play');
		// Observe real destination geometry, never the animated visual proxies.
		session.resize = new ResizeObserver(() => schedule('resize-retarget'));
		for (const node of targets) session.resize.observe(node);
		for (const node of document.querySelectorAll<HTMLElement>(`${scope} [data-route-scroll]`))
			session.resize.observe(node);
	}

	onNavigate((navigation) => {
		if (!root) return;
		const id = options.identity(navigation.from?.url, navigation.to?.url);
		if (!id || reduced() || typeof HTMLElement.prototype.animate !== 'function') {
			finish(reduced() ? 'reduced' : 'unpaired');
			return () => revealRemainder(true);
		}
		const session = capture(id);
		if (!session) return () => revealRemainder(true);
		void navigation.complete.catch(() => {
			if (active === session) finish('navigation-error');
		});
		return () => {
			void commit(session).catch(() => {
				if (active === session) finish('playback-error');
			});
		};
	});
	onMount(() => {
		root = document.createElement('div');
		root.dataset.prototypeOverlay = '';
		root.setAttribute('aria-hidden', 'true');
		root.inert = true;
		root.style.cssText =
			'position:fixed;inset:0;z-index:30;pointer-events:none;overflow:hidden;isolation:isolate;';
		suppression = document.createElement('style');
		document.head.append(suppression);
		document.body.append(root);
		media = matchMedia('(prefers-reduced-motion: reduce)');
		const preference = () => {
			if (reduced()) finish('reduced');
		};
		const scroll = () => schedule('scroll-retarget');
		const resize = () => schedule('resize-retarget');
		const fonts = () => schedule('font-retarget');
		const pagehide = () => finish('pagehide');
		const pageshow = () => finish('pageshow');
		media.addEventListener('change', preference);
		window.addEventListener('scroll', scroll, true);
		window.addEventListener('resize', resize);
		window.addEventListener('pagehide', pagehide);
		window.addEventListener('pageshow', pageshow);
		document.fonts.addEventListener('loadingdone', fonts);
		return () => {
			finish('dispose');
			media?.removeEventListener('change', preference);
			window.removeEventListener('scroll', scroll, true);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pagehide', pagehide);
			window.removeEventListener('pageshow', pageshow);
			document.fonts.removeEventListener('loadingdone', fonts);
			root?.remove();
			suppression?.remove();
		};
	});
	return { settle: () => finish('manual-reduction') };
}
