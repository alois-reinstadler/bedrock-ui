<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Copy from '@lucide/svelte/icons/copy';
	import List from '@lucide/svelte/icons/list';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import MessageSquarePlus from '@lucide/svelte/icons/message-square-plus';
	import X from '@lucide/svelte/icons/x';
	import type { FeedbackMode, FeedbackTarget } from './types.js';
	let {
		mode,
		openCount,
		uid,
		captureToolbar,
		focusPanel,
		dragToolbar,
		moveToolbar,
		stopToolbar,
		moveToolbarWithKeyboard,
		inspecting,
		draftTarget,
		toggleInspection,
		toolTip,
		showPins = $bindable(true),
		annotationCount,
		copy,
		tray,
		toggleTray,
		compose,
		close
	}: {
		mode: FeedbackMode;
		openCount: number;
		uid: string;
		captureToolbar: Attachment<HTMLDivElement>;
		focusPanel: Attachment<HTMLElement>;
		dragToolbar: (event: PointerEvent) => void;
		moveToolbar: (event: PointerEvent) => void;
		stopToolbar: () => void;
		moveToolbarWithKeyboard: (event: KeyboardEvent) => void;
		inspecting: boolean;
		draftTarget: FeedbackTarget | null;
		toggleInspection: () => void;
		toolTip: Snippet<[string, string?]>;
		showPins?: boolean;
		annotationCount: number;
		copy: () => void;
		tray: 'notes' | 'settings' | null;
		toggleTray: (tray: 'notes' | 'settings') => void;
		compose: (target: FeedbackTarget) => void;
		close: () => void;
	} = $props();
</script>

<div
	class="feedback-toolbar"
	role="group"
	aria-label={`${mode === 'developer' ? 'Feedback' : 'Your feedback'} ${openCount}`}
	id={`${uid}-panel`}
	{@attach captureToolbar}
	{@attach focusPanel}
>
	<button
		class="feedback-grip"
		aria-label="Move feedback toolbar"
		title="Drag to move; arrow keys to reposition"
		onpointerdown={dragToolbar}
		onpointermove={moveToolbar}
		onpointerup={stopToolbar}
		onpointercancel={stopToolbar}
		onlostpointercapture={stopToolbar}
		onkeydown={moveToolbarWithKeyboard}><GripVertical size={14} /></button
	>
	<button
		class="feedback-tool feedback-inspect"
		data-inspect
		class:feedback-tool-active={inspecting || !!draftTarget}
		aria-label={inspecting ? 'Pause selection' : 'Select element'}
		aria-pressed={inspecting}
		disabled={!!draftTarget}
		onclick={toggleInspection}
		>{#if inspecting || draftTarget}<Pause size={16} />{:else}<Play
				size={16}
			/>{/if}{@render toolTip(inspecting ? 'Pause selection' : 'Select element', 'I')}</button
	>
	<button
		class="feedback-tool"
		aria-label={showPins ? 'Hide markers' : 'Show markers'}
		aria-pressed={showPins}
		onclick={() => (showPins = !showPins)}
		>{#if showPins}<Eye size={16} />{:else}<EyeOff size={16} />{/if}{@render toolTip(
			showPins ? 'Hide markers' : 'Show markers'
		)}</button
	>
	<span class="feedback-separator"></span>
	<button
		class="feedback-tool"
		aria-label="Copy feedback"
		disabled={!annotationCount || !!draftTarget}
		onclick={copy}><Copy size={15} />{@render toolTip('Copy feedback', 'C')}</button
	>
	<button
		class="feedback-tool"
		class:feedback-tool-active={tray === 'notes'}
		aria-label="Preview notes"
		aria-expanded={tray === 'notes'}
		disabled={!!draftTarget}
		onclick={() => toggleTray('notes')}
		><List size={17} />{#if openCount}<span class="feedback-count">{openCount}</span
			>{/if}{@render toolTip('Preview notes')}</button
	>
	<button
		class="feedback-tool"
		aria-label="Page note"
		disabled={!!draftTarget}
		onclick={() => compose({ kind: 'page', selector: '', label: 'Whole page', text: '', tag: '' })}
		><MessageSquarePlus size={16} />{@render toolTip('Page note')}</button
	>
	<button
		class="feedback-tool"
		class:feedback-tool-active={tray === 'settings'}
		aria-label="Feedback settings"
		aria-expanded={tray === 'settings'}
		disabled={!!draftTarget}
		onclick={() => toggleTray('settings')}
		><Settings2 size={16} />{@render toolTip('Settings')}</button
	>
	<button class="feedback-tool" aria-label="Close feedback" onclick={close}
		><X size={17} />{@render toolTip('Close toolbar')}</button
	>
</div>
