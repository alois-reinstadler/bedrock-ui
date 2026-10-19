<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { MAX_COMMENT } from './model.js';
	import type { FeedbackAnnotation, FeedbackMode, FeedbackTarget } from './types.js';
	let {
		draftTarget,
		editing,
		composerPoint,
		observeComposer,
		resizeSurface,
		save,
		mode,
		canEditText,
		startTextEdit,
		textEditing,
		textChangeEnabled,
		discardTextChange,
		textBefore,
		textAfter,
		uid,
		captureTextarea,
		draft = $bindable(''),
		textChange,
		annotations,
		deleteNote,
		cancelDraft
	}: {
		draftTarget: FeedbackTarget;
		editing: string | null;
		composerPoint: { x: number; y: number };
		observeComposer: Attachment<HTMLElement>;
		resizeSurface: Attachment<HTMLElement>;
		save: (event: SubmitEvent) => void;
		mode: FeedbackMode;
		canEditText: boolean;
		startTextEdit: () => void;
		textEditing: boolean;
		textChangeEnabled: boolean;
		discardTextChange: () => void;
		textBefore: string;
		textAfter: string;
		uid: string;
		captureTextarea: Attachment<HTMLTextAreaElement>;
		draft?: string;
		textChange?: { before: string; after: string };
		annotations: FeedbackAnnotation[];
		deleteNote: (note: FeedbackAnnotation) => void;
		cancelDraft: () => void;
	} = $props();
</script>

<section
	class="feedback-panel feedback-composer"
	aria-label={editing ? 'Edit feedback note' : 'New feedback note'}
	style:left={`${composerPoint.x}px`}
	style:top={`${composerPoint.y}px`}
	{@attach observeComposer}
	{@attach resizeSurface}
>
	<form onsubmit={save}>
		<div class="feedback-selection-summary" aria-label="Selected target">
			<div class="feedback-selection-kind">
				<MousePointer2 size={12} /><span
					>{draftTarget.kind === 'page'
						? 'Whole page'
						: draftTarget.kind === 'group'
							? `${draftTarget.elements?.length} selected elements`
							: `${draftTarget.tag}: “${draftTarget.label}”`}</span
				>
			</div>
			{#if draftTarget.elements}<ol class="feedback-group-members" aria-label="Selected elements">
					{#each draftTarget.elements as element (element.selector)}<li>
							<span class="feedback-badge">{element.tag}</span><span>{element.label}</span>
						</li>{/each}
				</ol>{/if}
			{#if mode === 'developer'}<details class="feedback-context">
					<summary>Element details</summary
					>{#each draftTarget.elements ?? [draftTarget] as element, index (index)}{#if element.selector}<code
								class="feedback-selector">{element.selector}</code
							>{/if}{/each}
				</details>{/if}
		</div>
		{#if mode === 'review' && canEditText}<div class="feedback-copy-tools">
				<button type="button" class="feedback-edit-copy" onclick={startTextEdit}
					>{textEditing ? 'Focus page text' : 'Edit text on page'}</button
				>
				{#if textChangeEnabled}<button
						type="button"
						class="feedback-cancel"
						onclick={discardTextChange}>Undo text edit</button
					>{/if}
			</div>{/if}
		{#if textChangeEnabled}<div class="feedback-copy-preview">
				<p>
					{textEditing ? 'Type directly on the selected text.' : 'Proposed text change'}
				</p>
				<div class="feedback-text-diff">
					<del>{textBefore}</del><ins>{textAfter || '(remove text)'}</ins>
				</div>
				<p>Saved as a suggestion. The original page text is restored when you finish.</p>
			</div>{/if}
		<label class="sr-only" for={`${uid}-comment`}>What would you like to change?</label>
		<textarea
			id={`${uid}-comment`}
			{@attach captureTextarea}
			bind:value={draft}
			maxlength={MAX_COMMENT}
			required={!textChange}
			rows={3}
			placeholder={textChangeEnabled ? 'Add a note (optional)…' : 'What should change?'}></textarea>
		<div class="feedback-actions">
			{#if editing}<button
					type="button"
					class="feedback-icon feedback-delete"
					aria-label="Delete note"
					onclick={() => {
						const note = annotations.find((note) => note.id === editing);
						if (note) deleteNote(note);
					}}><Trash2 size={14} /></button
				>{:else}<span class="feedback-enter-hint"><kbd>↵</kbd> to save</span>{/if}<button
				type="button"
				class="feedback-cancel"
				onclick={cancelDraft}>Cancel</button
			><button
				type="submit"
				class="feedback-submit"
				aria-label={editing ? 'Save note' : 'Add note'}
				disabled={!draft.trim() && !textChange}>{editing ? 'Save' : 'Add'}</button
			>
		</div>
	</form>
</section>
