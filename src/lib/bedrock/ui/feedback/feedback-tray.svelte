<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import X from '@lucide/svelte/icons/x';
	import MessageSquarePlus from '@lucide/svelte/icons/message-square-plus';
	import Download from '@lucide/svelte/icons/download';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import type { FeedbackAnnotation, FeedbackMode, FeedbackTarget } from './types.js';
	let {
		tray,
		trayPoint,
		observeTray,
		resizeSurface,
		filter = $bindable('open'),
		visibleNotes,
		pageNotes,
		missing,
		exportText,
		uid,
		annotations,
		storageKey,
		project,
		mode,
		onSubmit,
		submitting,
		compose,
		previewNote,
		toggleStatus,
		deleteNote,
		download,
		submit,
		onClose,
		onResetPosition
	}: {
		tray: 'notes' | 'settings';
		trayPoint: { x: number; y: number };
		observeTray: Attachment<HTMLElement>;
		resizeSurface: Attachment<HTMLElement>;
		filter?: 'open' | 'resolved' | 'all';
		visibleNotes: FeedbackAnnotation[];
		pageNotes: FeedbackAnnotation[];
		missing: string[];
		exportText: string;
		uid: string;
		annotations: FeedbackAnnotation[];
		storageKey?: string;
		project: string;
		mode: FeedbackMode;
		onSubmit: boolean;
		submitting: boolean;
		compose: (target: FeedbackTarget, note?: FeedbackAnnotation) => void;
		previewNote: (note: FeedbackAnnotation | null) => void;
		toggleStatus: (note: FeedbackAnnotation) => void;
		deleteNote: (note: FeedbackAnnotation) => void;
		download: () => void;
		submit: () => void;
		onClose: () => void;
		onResetPosition: () => void;
	} = $props();
</script>

<section
	class="feedback-panel feedback-tray"
	style:left={`${trayPoint.x}px`}
	style:top={`${trayPoint.y}px`}
	{@attach observeTray}
	{@attach resizeSurface}
	aria-label={tray === 'notes' ? 'Feedback notes' : 'Feedback settings'}
>
	<header class="feedback-header">
		<h2>{tray === 'notes' ? 'Preview notes' : 'Feedback settings'}</h2>
		<button class="feedback-icon" aria-label="Close panel" onclick={onClose}><X size={14} /></button
		>
	</header>
	{#if tray === 'notes'}
		<div class="feedback-body feedback-scroll">
			<div class="feedback-filters" aria-label="Filter feedback">
				{#each ['open', 'resolved', 'all'] as status (status)}<button
						type="button"
						aria-pressed={filter === status}
						onclick={() => (filter = status as typeof filter)}
						>{status === 'open' ? 'Open' : status === 'resolved' ? 'Resolved' : 'All'}</button
					>{/each}
			</div>
			{#if !visibleNotes.length}<div class="feedback-empty">
					<MessageSquarePlus size={22} />
					<p>
						{filter === 'resolved' ? 'No resolved notes yet.' : 'No notes on this page yet.'}
					</p>
					<span>Press <kbd>I</kbd> to inspect, then click or drag to select.</span>
				</div>{/if}
			<ol class="feedback-notes">
				{#each visibleNotes as note (note.id)}
					<li>
						<button
							class="feedback-note-preview"
							onclick={() => compose(note.target, note)}
							onpointerenter={() => previewNote(note)}
							onpointerleave={() => previewNote(null)}
							onfocus={() => previewNote(note)}
							onblur={() => previewNote(null)}
							aria-label={`Edit: ${note.comment || 'Text suggestion'}`}
						>
							<span class="feedback-note-heading"
								><span>NOTE {pageNotes.indexOf(note) + 1}</span><span class="feedback-badge"
									>{note.status === 'resolved' ? 'Resolved' : note.target.kind}</span
								></span
							>
							<span class="feedback-target">{note.target.label}</span><span class="feedback-comment"
								>{note.comment}</span
							>
							{#if note.textChange}<span class="feedback-text-diff"
									><del>{note.textChange.before}</del><ins
										>{note.textChange.after || '(remove text)'}</ins
									></span
								>{/if}
						</button>
						{#if missing.includes(note.id)}<p class="feedback-hint">
								This element has changed or is no longer on the page.
							</p>{/if}
						<div class="feedback-note-actions">
							<button onclick={() => compose(note.target, note)}>Edit</button><button
								onclick={() => toggleStatus(note)}
								>{note.status === 'open' ? 'Resolve' : 'Reopen'}</button
							><button onclick={() => deleteNote(note)}>Delete</button>
						</div>
					</li>
				{/each}
			</ol>
			{#if exportText}<label class="feedback-label" for={`${uid}-export`}>Copy feedback</label
				><textarea id={`${uid}-export`} value={exportText} readonly rows={5}></textarea>{/if}
		</div>
		<footer class="feedback-footer">
			<span
				>{annotations.length}
				{annotations.length === 1 ? 'note' : 'notes'} across all pages · {storageKey
					? 'Browser drafts'
					: 'This session only'}</span
			>
		</footer>
	{:else}
		<div class="feedback-body feedback-settings">
			<p class="feedback-project">
				{project}<span>{mode === 'developer' ? 'Developer annotations' : 'Customer review'}</span>
			</p>
			<button class="feedback-menu-item" disabled={!annotations.length} onclick={download}
				><Download size={15} />Export JSON<span>{annotations.length} notes</span></button
			>
			{#if onSubmit}<button
					class="feedback-menu-item"
					disabled={!annotations.length || submitting}
					onclick={submit}
					><MessageSquarePlus size={15} />{submitting ? 'Sending…' : 'Send feedback'}</button
				>{/if}
			<button class="feedback-menu-item" onclick={onResetPosition}
				><GripVertical size={15} />Reset toolbar position</button
			>
			<div class="feedback-shortcuts">
				<span>Inspect / pause <kbd>I</kbd></span><span>Copy feedback <kbd>C</kbd></span><span
					>Save note <kbd>Enter</kbd></span
				><span>New line <kbd>Shift Enter</kbd></span><span>Cancel <kbd>Esc</kbd></span>
			</div>
			<p class="feedback-hint">
				{storageKey ? 'Drafts stay in this browser.' : 'Notes last for this session.'} Copy or export
				to share.
			</p>
		</div>
	{/if}
</section>
