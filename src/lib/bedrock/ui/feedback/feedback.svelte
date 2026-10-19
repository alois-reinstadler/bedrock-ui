<script lang="ts">
	import './feedback.css';
	import FeedbackToolbar from './feedback-toolbar.svelte';
	import FeedbackTray from './feedback-tray.svelte';
	import FeedbackComposer from './feedback-composer.svelte';
	import { motionPresets } from '#lib/bedrock/motion/tokens.js';
	import { onMount, tick, untrack } from 'svelte';
	import { autoSize } from '#lib/bedrock/motion/auto-size.js';
	import { editText, textEditTarget, type TextEditor } from './text-edit.js';
	import { composerPosition } from './position.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
	import Plus from '@lucide/svelte/icons/plus';
	import {
		feedbackMarkdown,
		feedbackPage,
		MAX_ANNOTATIONS,
		MAX_COMMENT,
		parseFeedback
	} from './model.js';
	import {
		canInspect,
		describeElement,
		captureTarget,
		captureGroup,
		elementsInBox,
		captureBoxCandidates,
		candidatesInBox,
		type BoxCandidate,
		resolveTargets,
		unionRect,
		MAX_GROUP_ELEMENTS,
		type SelectionRect
	} from './target.js';
	import type {
		FeedbackAnnotation,
		FeedbackPayload,
		FeedbackProps,
		FeedbackTarget
	} from './types.js';

	let {
		open = $bindable(false),
		showLauncher = true,
		trigger = null,
		placement = 'bottom-right',
		mode = 'developer',
		enabled = true,
		annotations = $bindable([]),
		project = 'Website review',
		revision,
		pageUrl,
		scope,
		storageKey,
		onChange,
		onSubmit
	}: FeedbackProps = $props();

	const uid = $props.id();
	const motionPolicy = useMotionPolicy();
	const resizeSurface = autoSize({ duration: motionPresets.state.duration, axis: 'both' });
	let inlineEditor: TextEditor | null = null;
	let textEditing = $state(false);
	let canEditText = $state(false);
	let textChangeEnabled = $state(false);
	let textBefore = $state('');
	let textAfter = $state('');
	let smoothHighlight = $state(false);
	const textChange = $derived(
		textChangeEnabled && textBefore !== textAfter
			? { before: textBefore, after: textAfter }
			: undefined
	);
	let tray = $state<'notes' | 'settings' | null>(null);
	let showPins = $state(true);
	let resumeInspection = false;
	let toolbar: HTMLElement | null = null;
	let composer: HTMLElement | null = null;
	let trayElement: HTMLElement | null = null;
	let trayPoint = $state({ x: 12, y: 12 });
	let dockPosition = $state<{ x: number; y: number } | null>(null);
	let dockDrag: { id: number; x: number; y: number; left: number; top: number } | null = null;
	let composerPoint = $state({ x: 12, y: 12 });
	let hoverDescription = '';
	let noticeTimer: ReturnType<typeof setTimeout> | undefined;
	let mounted = $state(false);
	let location = $state('');
	let inspecting = $state(false);
	let draftTarget = $state<FeedbackTarget | null>(null);
	let draftPage = $state('');
	let draft = $state('');
	let editing = $state<string | null>(null);
	let notice = $state('');
	let submitting = $state(false);
	let filter = $state<'open' | 'resolved' | 'all'>('open');
	let textarea = $state<HTMLTextAreaElement | null>(null);
	let launcher = $state<HTMLButtonElement | null>(null);
	let hovered = $state.raw<Element | null>(null);
	let previewTarget = $state<FeedbackTarget | null>(null);
	let dragBox = $state<SelectionRect | null>(null);
	let dragMembers = $state.raw<Element[]>([]);
	let memberRects = $state<SelectionRect[]>([]);
	let pointerSession: { id: number; x: number; y: number; element: Element } | null = null;
	let suppressClick = false;
	let boxCandidates: BoxCandidate[] | null = null;
	let pinsDirty = true;
	let highlight = $state<{
		x: number;
		y: number;
		width: number;
		height: number;
		label: string;
		labelX: number;
		labelY: number;
	} | null>(null);
	let pins = $state<{ id: string; number: number; x: number; y: number; label: string }[]>([]);
	let missing = $state<string[]>([]);
	let exportText = $state('');
	let storageNotice = $state('');
	let frame = 0;
	let returnFocus: HTMLElement | null = null;
	let draftStorage: string | undefined;
	const currentPage = $derived(pageUrl ?? location);
	const pageNotes = $derived(annotations.filter((note) => note.page === currentPage));
	const visibleNotes = $derived(
		pageNotes.filter((note) => filter === 'all' || note.status === filter)
	);
	const openCount = $derived(pageNotes.filter((note) => note.status === 'open').length);

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return () => node.remove();
	}

	function focusPanel(node: HTMLElement) {
		// Let the host router finish its navigation focus reset before focusing the panel.
		const focusFrame = requestAnimationFrame(() => {
			node
				.querySelector<HTMLButtonElement>('[aria-label="Close feedback"]')
				?.focus({ preventScroll: true });
		});
		return () => cancelAnimationFrame(focusFrame);
	}

	function measurePins() {
		pinsDirty = false;
		const nextPins: typeof pins = [];
		const nextMissing: string[] = [];
		pageNotes.forEach((note, index) => {
			if (note.target.kind === 'page') return;
			const elements = resolveTargets(note.target, scope);
			if (elements.length < (note.target.elements?.length ?? 1)) nextMissing.push(note.id);
			if (!elements.length) {
				return;
			}
			const rect = new DOMRect(
				...rectArgs(unionRect(elements.map((element) => element.getBoundingClientRect()))!)
			);
			if (
				note.status === 'resolved' ||
				!rect.width ||
				!rect.height ||
				rect.bottom < 0 ||
				rect.top > innerHeight ||
				rect.right < 0 ||
				rect.left > innerWidth
			)
				return;
			nextPins.push({
				id: note.id,
				number: index + 1,
				x: Math.min(innerWidth - 40, Math.max(8, rect.right - 16)),
				y: Math.min(innerHeight - 40, Math.max(8, rect.top - 16)),
				label: note.target.label
			});
		});
		pins = nextPins;
		missing = nextMissing;
	}

	function measure() {
		frame = 0;
		if (!enabled || !open) return;
		if (pinsDirty) measurePins();
		if (trayElement && toolbar) {
			const next = composerPosition(
				toolbar.getBoundingClientRect(),
				trayElement.getBoundingClientRect(),
				{ width: innerWidth, height: innerHeight }
			);
			if (next.x !== trayPoint.x || next.y !== trayPoint.y) trayPoint = next;
		}
		const target = draftTarget ?? previewTarget;
		const selected = dragBox
			? candidatesInBox(dragBox, (boxCandidates ??= captureBoxCandidates(scope)))
			: null;
		if (selected) dragMembers = selected.map(({ element }) => element);
		const elements = dragBox
			? dragMembers
			: target
				? inlineEditor && draftTarget
					? [inlineEditor.element]
					: resolveTargets(target, scope)
				: inspecting && hovered?.isConnected
					? [hovered]
					: [];
		const rects = selected
			? selected.map(({ rect }) => rect)
			: elements.map((element) => element.getBoundingClientRect());
		memberRects = elements.length > 1 ? rects.slice(0, MAX_GROUP_ELEMENTS) : [];
		const bounds = dragBox ?? unionRect(rects);
		if (draftTarget && composer) placeComposer(bounds ?? draftTarget.rect);
		const rect = bounds ? new DOMRect(...rectArgs(bounds)) : null;
		highlight =
			rect &&
			rect.width &&
			rect.height &&
			rect.bottom > 0 &&
			rect.top < innerHeight &&
			rect.right > 0 &&
			rect.left < innerWidth
				? {
						x: rect.x,
						y: rect.y,
						width: rect.width,
						height: rect.height,
						label: dragBox
							? `${dragMembers.length} elements · release to select`
							: inspecting && !target
								? hoverDescription
								: target?.kind === 'group'
									? `${elements.length} elements`
									: (target?.label ?? elements[0]?.localName ?? ''),
						labelX: Math.max(8, Math.min(rect.left, innerWidth - 260)),
						labelY: Math.min(
							innerHeight - 40,
							Math.max(8, rect.top >= 36 ? rect.top - 30 : rect.top + rect.height + 6)
						)
					}
				: null;
	}

	function rectArgs(rect: SelectionRect): [number, number, number, number] {
		return [rect.x, rect.y, rect.width, rect.height];
	}

	function invalidateGeometry() {
		pinsDirty = true;
		boxCandidates = null;
		scheduleMeasure();
	}

	function scheduleMeasure() {
		if (!frame) frame = requestAnimationFrame(measure);
	}

	function outsideUI(event: Event): Element | null {
		const element = event.composedPath().find((node) => node instanceof Element);
		return element instanceof Element && !element.closest('[data-feedback-ui]') ? element : null;
	}

	function move(event: PointerEvent) {
		if (!inspecting || draftTarget) return;
		if (pointerSession && event.pointerId === pointerSession.id) {
			const x = Math.max(0, Math.min(innerWidth, event.clientX));
			const y = Math.max(0, Math.min(innerHeight, event.clientY));
			if (dragBox || Math.hypot(x - pointerSession.x, y - pointerSession.y) >= 6) {
				dragBox = {
					x: Math.min(x, pointerSession.x),
					y: Math.min(y, pointerSession.y),
					width: Math.abs(x - pointerSession.x),
					height: Math.abs(y - pointerSession.y)
				};
				hovered = null;
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			scheduleMeasure();
			return;
		}
		const element = outsideUI(event);
		const next = element && canInspect(element, scope) ? element : null;
		if (next === hovered) return;
		smoothHighlight = Boolean(hovered && next);
		hovered = next;
		hoverDescription = next ? describeElement(next) : '';
		scheduleMeasure();
	}

	async function compose(target: FeedbackTarget, note?: FeedbackAnnotation) {
		stopTextEdit();
		canEditText = mode === 'review' && !!textEditTarget(target, scope);
		textChangeEnabled = !!note?.textChange;
		textBefore = note?.textChange?.before ?? '';
		textAfter = note?.textChange?.after ?? '';
		resumeInspection = inspecting;
		tray = null;
		composerPoint = composerPosition(
			target.rect,
			{ width: Math.min(300, innerWidth - 24), height: 210 },
			{ width: innerWidth, height: innerHeight },
			toolbar?.getBoundingClientRect()
		);
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		draftTarget = target;
		draftPage = note?.page ?? currentPage;
		draft = note?.comment ?? '';
		editing = note?.id ?? null;
		inspecting = false;
		hovered = null;
		previewTarget = null;
		highlight = null;
		exportText = '';
		await tick();
		if (composer) placeComposer(target.rect);
		await tick();
		textarea?.focus({ preventScroll: true });
	}

	function inspectClick(event: MouseEvent) {
		if (suppressClick && event.detail > 0) {
			suppressClick = false;
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		if (!inspecting || draftTarget || event.button !== 0) return;
		const element = outsideUI(event);
		if (!element || !canInspect(element, scope)) return;
		event.preventDefault();
		event.stopImmediatePropagation();
		void compose(captureTarget(element, mode));
	}

	// Prevent pointer-driven controls from opening before the capture-phase click selects them.
	function inspectPointer(event: PointerEvent) {
		suppressClick = false;
		if (!inspecting || event.button !== 0) return;
		const element = outsideUI(event);
		if (element && canInspect(element, scope)) {
			event.preventDefault();
			event.stopImmediatePropagation();
			if (event.pointerType === 'mouse' && event.isPrimary) {
				suppressClick = false;
				pointerSession = { id: event.pointerId, x: event.clientX, y: event.clientY, element };
				try {
					document.documentElement.setPointerCapture(event.pointerId);
				} catch {
					/* Synthetic pointers need no capture. */
				}
			}
		}
	}

	function cancelPointer() {
		const session = pointerSession;
		pointerSession = null;
		if (session) {
			suppressClick = true;
			if (document.documentElement.hasPointerCapture(session.id))
				document.documentElement.releasePointerCapture(session.id);
		}
		dragBox = null;
		boxCandidates = null;
		dragMembers = [];
		memberRects = [];
		scheduleMeasure();
	}

	function finishPointer(event: PointerEvent) {
		if (!pointerSession || event.pointerId !== pointerSession.id) {
			if (inspecting && event.button === 0) {
				const element = outsideUI(event);
				if (element && canInspect(element, scope)) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			}
			return;
		}
		event.preventDefault();
		event.stopImmediatePropagation();
		move(event);
		const box = dragBox;
		const elements = box ? elementsInBox(box, scope) : [pointerSession.element];
		cancelPointer();
		if (!elements.length) {
			notice = 'No elements inside the box. Drag around the whole element to include it.';
			return;
		}
		if (elements.length > MAX_GROUP_ELEMENTS) {
			notice = `Select up to ${MAX_GROUP_ELEMENTS} elements at a time. Try a smaller box.`;
			return;
		}
		if (elements.every((element) => element.isConnected && canInspect(element, scope))) {
			notice = '';
			void compose(captureGroup(elements, mode));
		}
	}

	function viewportChanged() {
		smoothHighlight = false;
		if (pointerSession) cancelPointer();
		if (dockPosition && toolbar) dockPosition = clampDock(dockPosition.x, dockPosition.y);
		invalidateGeometry();
	}

	function windowBlur(event: FocusEvent) {
		if (event.target === window) cancelPointer();
	}

	async function cancelDraft() {
		stopTextEdit();
		textChangeEnabled = false;
		draftTarget = null;
		draft = '';
		editing = null;
		inspecting = resumeInspection;
		hovered = null;
		await tick();
		if (returnFocus?.isConnected) returnFocus.focus();
		else
			toolbar?.querySelector<HTMLButtonElement>('[data-inspect]')?.focus({ preventScroll: true });
	}

	async function close() {
		stopTextEdit();
		open = false;
		tray = null;
		inspecting = false;
		hovered = null;
		draftTarget = null;
		exportText = '';
		await tick();
		(launcher ?? trigger)?.focus();
	}

	async function togglePanel() {
		if (open) {
			await close();
			return;
		}
		open = true;
		scheduleMeasure();
		await tick();
		toolbar?.querySelector<HTMLButtonElement>('[data-inspect]')?.focus({ preventScroll: true });
	}

	function keydown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.isComposing || event.repeat) return;
		const active = event.composedPath().find((node) => node instanceof Element) as
			Element | undefined;
		const editable = active?.closest(
			'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
		);
		if (
			!editable &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey &&
			event.key.toLowerCase() === 'i'
		) {
			event.preventDefault();
			if (!open) {
				open = true;
				inspecting = true;
				tray = null;
			} else toggleInspection();
			return;
		}
		if (!open) return;
		if (
			draftTarget &&
			(active === textarea ||
				(inlineEditor && active instanceof Node && inlineEditor.element.contains(active))) &&
			event.key === 'Enter' &&
			!event.shiftKey
		) {
			event.preventDefault();
			if (draft.trim() || textChange) textarea?.form?.requestSubmit();
			return;
		}
		if (
			!editable &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey &&
			event.key.toLowerCase() === 'c' &&
			annotations.length
		) {
			event.preventDefault();
			void copy();
			return;
		}
		if (event.key === 'Escape') {
			if (tray) {
				event.preventDefault();
				tray = null;
				toolbar?.querySelector<HTMLButtonElement>('[data-inspect]')?.focus();
				return;
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			cancelPointer();
			if (draftTarget) void cancelDraft();
			else if (inspecting) {
				inspecting = false;
				hovered = null;
				highlight = null;
			} else void close();
		} else if (inspecting && (event.key === 'Enter' || event.key === ' ')) {
			const element = outsideUI(event);
			if (element && canInspect(element, scope)) {
				event.preventDefault();
				event.stopImmediatePropagation();
				void compose(captureTarget(element, mode));
			}
		}
	}

	function payload(): FeedbackPayload {
		return { version: 1, project, revision, annotations: $state.snapshot(annotations) };
	}

	function commit(next: FeedbackAnnotation[]) {
		annotations = next;
		storageNotice = '';
		if (draftStorage) {
			try {
				localStorage.setItem(draftStorage, JSON.stringify(payload()));
			} catch {
				storageNotice = 'Browser storage is unavailable. Keep this page open or export your notes.';
			}
		}
		try {
			onChange?.($state.snapshot(next));
		} catch {
			notice = 'Notes changed locally, but the application could not process the update.';
		}
		scheduleMeasure();
	}

	function save(event: SubmitEvent) {
		event.preventDefault();
		const comment = draft.trim();
		if (!draftTarget || (!comment && !textChange) || comment.length > MAX_COMMENT) return;
		if (!editing && annotations.length >= MAX_ANNOTATIONS) {
			notice = 'The 200-note limit has been reached. Export and remove older notes first.';
			return;
		}
		const now = new Date().toISOString();
		const existing = annotations.find((note) => note.id === editing);
		const note: FeedbackAnnotation = existing
			? { ...existing, comment, textChange, updatedAt: now }
			: {
					id: [...crypto.getRandomValues(new Uint32Array(4))]
						.map((part) => part.toString(16).padStart(8, '0'))
						.join(''),
					page: draftPage,
					comment,
					status: 'open',
					createdAt: now,
					updatedAt: now,
					viewport: { width: innerWidth, height: innerHeight, pixelRatio: devicePixelRatio },
					target: draftTarget,
					textChange
				};
		stopTextEdit();
		notice = textChange
			? 'Text suggestion saved. The page has been restored.'
			: existing
				? 'Note updated locally.'
				: 'Note added locally.';
		commit(
			existing
				? annotations.map((item) => (item.id === existing.id ? note : item))
				: [...annotations, note]
		);
		void cancelDraft();
	}

	function toggleStatus(note: FeedbackAnnotation) {
		notice = note.status === 'open' ? 'Note resolved.' : 'Note reopened.';
		commit(
			annotations.map((item) =>
				item.id === note.id
					? {
							...item,
							status: item.status === 'open' ? 'resolved' : 'open',
							updatedAt: new Date().toISOString()
						}
					: item
			)
		);
	}

	async function copy() {
		const markdown = feedbackMarkdown(payload());
		try {
			await navigator.clipboard.writeText(markdown);
			notice = 'Feedback copied.';
		} catch {
			exportText = markdown;
			tray = 'notes';
			inspecting = false;
			notice = 'Select and copy the feedback below.';
		}
	}

	function download() {
		const url = URL.createObjectURL(
			new Blob([JSON.stringify(payload(), null, 2)], { type: 'application/json' })
		);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'bedrock-feedback.json';
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		notice = 'Feedback exported.';
	}

	async function submit() {
		if (!onSubmit || submitting) return;
		submitting = true;
		notice = 'Sending feedback…';
		try {
			await onSubmit(payload());
			notice = 'Feedback sent. Your local notes are still available.';
		} catch {
			notice = 'Feedback could not be sent. Your notes are still here; please try again.';
		} finally {
			submitting = false;
		}
	}

	onMount(() => {
		mounted = true;
		location = feedbackPage(window.location.href);
		draftStorage = storageKey;
		if (draftStorage && annotations.length === 0) {
			try {
				const saved = localStorage.getItem(draftStorage);
				if (saved) annotations = parseFeedback(saved);
			} catch {
				storageNotice =
					'Saved drafts could not be loaded. Export existing browser data before replacing it.';
			}
		}
		const navigation = () => {
			location = feedbackPage(window.location.href);
		};
		window.addEventListener('popstate', navigation);
		return () => {
			stopTextEdit();
			window.removeEventListener('popstate', navigation);
			cancelAnimationFrame(frame);
			clearTimeout(noticeTimer);
		};
	});

	// A route attachment cancels transient UI without deriving or copying annotation state.
	function trackPage() {
		const page = currentPage;
		const active = enabled;
		void mode;
		void scope;
		untrack(() => {
			stopTextEdit();
			cancelPointer();
			if (!active) open = false;
			if (!active || draftPage !== page) {
				draftTarget = null;
				editing = null;
				draft = '';
			}
			tray = null;
			inspecting = false;
			hovered = null;
			previewTarget = null;
			highlight = null;
		});
	}

	// All document inspection and geometry observation belongs to an open, enabled session.
	function trackOpen() {
		const shown = open;
		untrack(() => {
			if (shown) return;
			stopTextEdit();
			cancelPointer();
			tray = null;
			inspecting = false;
			hovered = null;
			previewTarget = null;
			highlight = null;
			draftTarget = null;
			exportText = '';
		});
	}

	function observeSession() {
		void pageNotes;
		void scope;
		void draftTarget;
		void previewTarget;
		void inspecting;
		const controller = new AbortController();
		const options = { capture: true, signal: controller.signal };
		window.addEventListener('pointermove', move, options);
		window.addEventListener('pointerdown', inspectPointer, options);
		window.addEventListener('pointerup', finishPointer, options);
		window.addEventListener('pointercancel', cancelPointer, options);
		window.addEventListener('blur', windowBlur, options);
		window.addEventListener('click', inspectClick, options);

		window.addEventListener('scroll', viewportChanged, options);
		window.addEventListener('resize', viewportChanged, options);
		const observer = new MutationObserver((records) => {
			if (
				records.some((record) => {
					const element =
						record.target instanceof Element ? record.target : record.target.parentElement;
					return element && !element.closest('[data-feedback-ui]');
				})
			)
				invalidateGeometry();
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: [
				'class',
				'style',
				'hidden',
				'contenteditable',
				'id',
				'data-feedback-id',
				'data-testid',
				'data-feedback-ignore'
			]
		});
		const resize = new ResizeObserver(invalidateGeometry);
		resize.observe(document.body);
		untrack(invalidateGeometry);
		return () => {
			cancelPointer();
			controller.abort();
			observer.disconnect();
			resize.disconnect();
			cancelAnimationFrame(frame);
			frame = 0;
		};
	}
	function stopTextEdit() {
		inlineEditor?.stop();
		inlineEditor = null;
		textEditing = false;
	}

	function startTextEdit() {
		if (!draftTarget || mode !== 'review') return;
		if (inlineEditor) {
			inlineEditor.element.focus({ preventScroll: true });
			return;
		}
		const element = textEditTarget(draftTarget, scope);
		if (!element || (textChangeEnabled && element.textContent !== textBefore)) {
			notice = 'This text has changed. Select it again to edit the current copy.';
			return;
		}
		if (!textChangeEnabled) {
			textBefore = element.textContent ?? '';
			textAfter = textBefore;
		}
		textChangeEnabled = true;
		textEditing = true;
		inlineEditor = editText(
			element,
			textAfter,
			(value) => {
				textAfter = value;
				scheduleMeasure();
			},
			() => {
				inlineEditor = null;
				void cancelDraft();
				notice = 'The page updated while you were editing. Select the text again to continue.';
			}
		);
		scheduleMeasure();
	}

	function discardTextChange() {
		stopTextEdit();
		textChangeEnabled = false;
		textBefore = '';
		textAfter = '';
		scheduleMeasure();
	}

	function placeComposer(anchor?: SelectionRect) {
		if (!composer) return;
		const size = composer.getBoundingClientRect();
		const next = composerPosition(
			anchor,
			size,
			{ width: innerWidth, height: innerHeight },
			toolbar?.getBoundingClientRect()
		);
		if (next.x !== composerPoint.x || next.y !== composerPoint.y) composerPoint = next;
	}

	function observeTray(node: HTMLElement) {
		trayElement = node;
		const observer = new ResizeObserver(scheduleMeasure);
		observer.observe(node);
		scheduleMeasure();
		return () => {
			observer.disconnect();
			trayElement = null;
		};
	}

	function observeComposer(node: HTMLElement) {
		composer = node;
		const observer = new ResizeObserver(scheduleMeasure);
		observer.observe(node);
		scheduleMeasure();
		return () => {
			observer.disconnect();
			composer = null;
		};
	}

	function shortcuts() {
		window.addEventListener('keydown', keydown, true);
		return () => window.removeEventListener('keydown', keydown, true);
	}

	function announce() {
		const message = notice;
		clearTimeout(noticeTimer);
		if (message)
			noticeTimer = setTimeout(() => {
				notice = '';
			}, 5000);
		return () => clearTimeout(noticeTimer);
	}

	function toggleInspection() {
		if (draftTarget) return;
		cancelPointer();
		inspecting = !inspecting;
		tray = null;
		hovered = null;
		previewTarget = null;
		highlight = null;
	}

	function toggleTray(next: 'notes' | 'settings') {
		if (draftTarget) return;
		cancelPointer();
		inspecting = false;
		hovered = null;
		highlight = null;
		previewTarget = null;
		tray = tray === next ? null : next;
	}

	function clampDock(x: number, y: number) {
		const rect = toolbar?.getBoundingClientRect();
		return {
			x: Math.max(12, Math.min(x, innerWidth - (rect?.width ?? 288) - 12)),
			y: Math.max(12, Math.min(y, innerHeight - (rect?.height ?? 46) - 12))
		};
	}

	function dragToolbar(event: PointerEvent) {
		if (event.button !== 0 || !toolbar) return;
		const rect = toolbar.getBoundingClientRect();
		dockDrag = {
			id: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			left: rect.x,
			top: rect.y
		};
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		event.preventDefault();
	}

	function moveToolbar(event: PointerEvent) {
		if (!dockDrag || dockDrag.id !== event.pointerId) return;
		dockPosition = clampDock(
			dockDrag.left + event.clientX - dockDrag.x,
			dockDrag.top + event.clientY - dockDrag.y
		);
		tray = null;
		scheduleMeasure();
	}

	function stopToolbar() {
		dockDrag = null;
	}

	function previewNote(note: FeedbackAnnotation | null) {
		previewTarget = note?.target ?? null;
	}

	function deleteNote(note: FeedbackAnnotation) {
		commit(annotations.filter((item) => item.id !== note.id));
		notice = 'Note removed.';
		if (editing === note.id) void cancelDraft();
	}
	function captureTextarea(node: HTMLTextAreaElement) {
		textarea = node;
		return () => {
			textarea = null;
		};
	}

	function captureToolbar(node: HTMLDivElement) {
		toolbar = node;
		return () => {
			toolbar = null;
		};
	}
	function moveToolbarWithKeyboard(event: KeyboardEvent) {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || !toolbar)
			return;
		event.preventDefault();
		const rect = toolbar.getBoundingClientRect();
		dockPosition = clampDock(
			rect.x + (event.key === 'ArrowLeft' ? -24 : event.key === 'ArrowRight' ? 24 : 0),
			rect.y + (event.key === 'ArrowUp' ? -24 : event.key === 'ArrowDown' ? 24 : 0)
		);
	}
</script>

<svelte:document
	{@attach trackPage}
	{@attach trackOpen}
	{@attach mounted && enabled && shortcuts}
	{@attach mounted && enabled && open && observeSession}
/>

{#snippet toolTip(label: string, key = '')}
	<span class="feedback-tooltip" aria-hidden="true"
		>{label}{#if key}<kbd>{key}</kbd>{/if}</span
	>
{/snippet}

{#if mounted && enabled}
	<div
		data-feedback-ui
		data-placement={placement}
		class="feedback-root"
		{@attach portal}
		{@attach motionPolicy.attach}
	>
		{#if open && highlight}
			<div class="feedback-indicators" aria-hidden="true">
				{#each memberRects as rect, index (index)}
					<div
						class="feedback-member-highlight"
						style:left={`${rect.x}px`}
						style:top={`${rect.y}px`}
						style:width={`${rect.width}px`}
						style:height={`${rect.height}px`}
					></div>
				{/each}
				<div
					class="feedback-highlight"
					class:feedback-box={!!dragBox}
					class:feedback-smooth={smoothHighlight && inspecting && !dragBox}
					style:left={`${highlight.x}px`}
					style:top={`${highlight.y}px`}
					style:width={`${highlight.width}px`}
					style:height={`${highlight.height}px`}
				></div>
				{#if !draftTarget}<div
						class="feedback-highlight-label"
						style:left={`${highlight.labelX}px`}
						style:top={`${highlight.labelY}px`}
					>
						{highlight.label}
					</div>{/if}
				{#if draftTarget && draftTarget.kind !== 'page'}<span
						class="feedback-active-anchor"
						style:left={`${Math.max(8, Math.min(innerWidth - 30, highlight.x + highlight.width / 2 - 11))}px`}
						style:top={`${Math.max(8, highlight.y + Math.min(highlight.height / 2, 24) - 11)}px`}
						><Plus size={14} /></span
					>{/if}
			</div>
		{/if}
		{#if dragBox}<span class="sr-only" role="status">{dragMembers.length} elements selected</span
			>{/if}
		{#if open && showPins && !draftTarget}
			{#each pins as pin (pin.id)}
				<button
					type="button"
					class="feedback-pin"
					style:left={`${pin.x}px`}
					style:top={`${pin.y}px`}
					aria-label={`Edit note ${pin.number}: ${pin.label}`}
					onpointerenter={() => previewNote(annotations.find((note) => note.id === pin.id) ?? null)}
					onpointerleave={() => previewNote(null)}
					onfocus={() => previewNote(annotations.find((note) => note.id === pin.id) ?? null)}
					onblur={() => previewNote(null)}
					onclick={() => {
						const note = annotations.find((item) => item.id === pin.id);
						if (note) void compose(note.target, note);
					}}>{pin.number}</button
				>
			{/each}
		{/if}

		{#if open}
			<div
				class="feedback-dock"
				class:feedback-dock-moved={!!dockPosition}
				style:left={dockPosition ? `${dockPosition.x}px` : undefined}
				style:top={dockPosition ? `${dockPosition.y}px` : undefined}
			>
				{#if tray}
					<FeedbackTray
						{tray}
						{trayPoint}
						{observeTray}
						{resizeSurface}
						bind:filter
						{visibleNotes}
						{pageNotes}
						{missing}
						{exportText}
						{uid}
						{annotations}
						{storageKey}
						{project}
						{mode}
						onSubmit={!!onSubmit}
						{submitting}
						{compose}
						{previewNote}
						{toggleStatus}
						{deleteNote}
						{download}
						{submit}
						onClose={() => {
							tray = null;
							toolbar?.querySelector<HTMLButtonElement>('[data-inspect]')?.focus();
						}}
						onResetPosition={() => {
							dockPosition = null;
							scheduleMeasure();
						}}
					/>
				{/if}
				{#if inspecting && !draftTarget && !dragBox}<div class="feedback-inspect-hint">
						Click to annotate · drag to select <kbd>Esc</kbd>
					</div>{/if}
				<FeedbackToolbar
					{mode}
					{openCount}
					{uid}
					{captureToolbar}
					{focusPanel}
					{dragToolbar}
					{moveToolbar}
					{stopToolbar}
					{moveToolbarWithKeyboard}
					{inspecting}
					{draftTarget}
					{toggleInspection}
					{toolTip}
					bind:showPins
					annotationCount={annotations.length}
					{copy}
					{tray}
					{toggleTray}
					{compose}
					{close}
				/>
			</div>

			{#if draftTarget}
				<FeedbackComposer
					{draftTarget}
					{editing}
					{composerPoint}
					{observeComposer}
					{resizeSurface}
					{save}
					{mode}
					{canEditText}
					{startTextEdit}
					{textEditing}
					{textChangeEnabled}
					{discardTextChange}
					{textBefore}
					{textAfter}
					{uid}
					{captureTextarea}
					bind:draft
					{textChange}
					{annotations}
					{deleteNote}
					{cancelDraft}
				/>
			{/if}
			{#if storageNotice}<p class="feedback-toast" role="alert">{storageNotice}</p>{/if}
			<p class="feedback-toast" role="status" {@attach announce}>{notice}</p>
		{/if}
		{#if showLauncher && !open}<button
				type="button"
				class="feedback-launcher"
				aria-label={mode === 'developer' ? 'Feedback' : 'Leave feedback'}
				aria-expanded={open}
				onclick={togglePanel}
				{@attach (node) => {
					launcher = node;
					return () => {
						launcher = null;
					};
				}}
				><MousePointer2 size={19} />{#if openCount}<span class="feedback-count">{openCount}</span
					>{/if}{@render toolTip('Open feedback', 'I')}</button
			>{/if}
	</div>
{/if}
