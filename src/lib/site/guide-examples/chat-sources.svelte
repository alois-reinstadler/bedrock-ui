<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	const sources: Chat.ChatSource[] = [
		{
			id: 'release',
			title: 'Release notes',
			href: '/docs/components/chat',
			kind: 'Documentation',
			description: 'Conversation UI capabilities',
			excerpt: 'Optional voice input and recovery controls can be composed into Chat.'
		},
		{
			id: 'research',
			title: 'Customer interviews',
			kind: 'Internal document',
			description: 'Research summary',
			excerpt: 'People want to review transcripts before sending a message.'
		}
	];
</script>

<section data-demo="chat-sources" class="w-full max-w-xl space-y-4">
	<p class="text-sm leading-relaxed">
		Voice input should leave time to review the draft. <Chat.Citation
			source={sources[0]}
			label="1"
		/> Interview notes support this workflow. <Chat.Citation source={sources[1]} label="2" />
	</p>
	<Chat.Sources {sources} />
	<Chat.SourceCard source={sources[1]} />
	<p class="text-sm text-muted-foreground">
		Supply sources and citations from your retrieval layer. Sources without a safe web URL or local
		path stay readable without a link. Popovers open with keyboard or pointer; Escape restores
		focus.
	</p>
</section>
