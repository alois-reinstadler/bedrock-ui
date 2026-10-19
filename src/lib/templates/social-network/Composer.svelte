<script lang="ts">
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Button } from '#lib/bedrock/ui/button';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import Image from '@lucide/svelte/icons/image';
	import X from '@lucide/svelte/icons/x';
	import { useSocial } from './state.svelte.js';
	let { replyTo, quote, ondone }: { replyTo?: string; quote?: string; ondone?: () => void } =
		$props();
	const social = useSocial();
	let text = $state('');
	let attached = $state(false);
	const value = $derived(!replyTo && !quote ? social.draft : text);
	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (replyTo) social.reply(replyTo, value);
		else social.publish(value, quote, attached ? 'coast' : undefined);
		text = '';
		if (!replyTo && !quote) social.draft = '';
		attached = false;
		ondone?.();
	}
</script>

<form class="composer" onsubmit={submit}>
	<img class="avatar" src="/templates/social-network/mina.jpg" alt="" />
	<div class="composer-content">
		<Textarea
			id={!replyTo && !quote ? 'social-compose' : undefined}
			aria-label={replyTo ? 'Write a reply' : quote ? 'Write a quote' : 'Write a post'}
			placeholder={replyTo ? 'Post your reply' : quote ? 'Add your thoughts…' : 'What’s happening?'}
			maxlength={500}
			{value}
			oninput={(event) => {
				if (!replyTo && !quote) social.draft = event.currentTarget.value;
				else text = event.currentTarget.value;
			}}
		></Textarea>
		{#if attached}<div class="attachment">
				<img
					src="/templates/social-network/coast.jpg"
					alt="Misty green mountain landscape"
				/><IconButton
					icon={X}
					label="Remove image"
					type="button"
					class={['control-templates-social-network-composer', 'icon-button']}
					onclick={() => (attached = false)}
				/>
			</div>{/if}
		<div class="composer-tools">
			<div>
				{#if !replyTo}<IconButton
						icon={Image}
						label="Attach sample landscape photo"
						class={['control-templates-social-network-composer', 'icon-button accent']}
						type="button"
						aria-pressed={attached}
						onclick={() => (attached = !attached)}
					/>{/if}<span class="audience">{replyTo ? 'Replying publicly' : 'Everyone can reply'}</span
				>
			</div>
			<div>
				<span class="character-count">{value.length}/500</span><Button
					type="submit"
					class="primary-button"
					disabled={!value.trim() && !attached}>{replyTo ? 'Reply' : 'Post'}</Button
				>
			</div>
		</div>
	</div>
</form>
