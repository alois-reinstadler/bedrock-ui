<script lang="ts">
	import { appear, vanish } from '#lib/bedrock/motion/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';

	import XIcon from '@lucide/svelte/icons/x';
	import {
		LayoutGroup,
		autoSize,
		layout,
		motionEasings,
		motionPresets
	} from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	type Toast = { id: number; gate: string; body: string };
	const notices = [
		{ gate: '18L', body: 'Hold short, bird sweep' },
		{ gate: 'B12', body: 'De-ice truck on Bravo' },
		{ gate: 'T3', body: 'Pushback delayed 6 min' },
		{ gate: '09', body: 'Low vis protocol' }
	];
	let toasts = $state<Toast[]>([]);
	let toastSeq = $state(0);
	const layoutTransition = motionPresets.layout;
	const toastCard = layout({ type: 'position', transition: layoutTransition });
	const stackShell = autoSize({ duration: motionPresets.reveal.duration });
	function pushToast() {
		const notice = notices[toastSeq % notices.length];
		if (!notice) return;
		toastSeq += 1;
		toasts = [{ id: toastSeq, gate: notice.gate, body: notice.body }, ...toasts].slice(0, 4);
	}
	function dismissToast(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id);
	}
</script>

<Scene
	index="06"
	title="Stack"
	hint="Notices enter and pack while the stack grows at its natural height."
>
	<button
		type="button"
		class="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
		onclick={pushToast}
	>
		<PlusIcon class="size-3.5" />
		Post notice
	</button>
	<div id="motion-stack-shell" {@attach stackShell} class="overflow-hidden">
		<LayoutGroup
			class="relative flex flex-col gap-2"
			role="log"
			aria-label="Live notices"
			aria-live="polite"
			aria-relevant="additions"
		>
			{#each toasts as toast (toast.id)}
				<article
					{@attach toastCard}
					class="flex items-start justify-between gap-3 rounded-2xl bg-muted/80 px-4 py-3"
					in:appear={{
						duration: motionPresets.enter.duration,
						easing: motionEasings.enter,
						start: 0.98
					}}
					out:vanish={{
						duration: motionPresets.exit.duration,
						easing: motionEasings.exit,
						end: 0.98
					}}
				>
					<div>
						<p class="font-mono text-[0.7rem] tracking-widest uppercase">{toast.gate}</p>
						<p class="mt-1 text-sm">{toast.body}</p>
					</div>
					<button
						type="button"
						class="rounded-full p-1 text-muted-foreground hover:text-foreground"
						aria-label={`Dismiss notice for gate ${toast.gate}`}
						onclick={() => dismissToast(toast.id)}
					>
						<XIcon class="size-3.5" />
					</button>
				</article>
			{:else}
				<p class="px-1 py-4 text-sm text-muted-foreground">No live notices.</p>
			{/each}
		</LayoutGroup>
	</div>
</Scene>

<style>
</style>
