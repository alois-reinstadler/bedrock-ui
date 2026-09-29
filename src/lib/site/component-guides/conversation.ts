import type { ComponentGuides } from './types';

export const conversationGuides = {
	attachment: {
		purpose:
			'Attachment presents a file or image with its upload state, metadata, and independently operable actions. It is a composable display family; the application owns uploading and retrying.',
		useWhen: [
			'Showing files in a conversation or composer.',
			'Displaying upload progress, failures, and completed files.'
		],
		avoidWhen: [
			'Use FileInput to choose or drop files.',
			'Keep existing Chat.Attachment usage when its compact preview API is sufficient.'
		],
		anatomy: [
			{
				name: 'Attachment.Root',
				description: 'Container with state, size, and orientation.',
				required: true
			},
			{ name: 'Attachment.Media', description: 'Icon or image preview.' },
			{ name: 'Attachment.Content', description: 'Groups the file metadata.' },
			{
				name: 'Attachment.Title',
				description: 'File name; shimmers while uploading or processing.'
			},
			{ name: 'Attachment.Description', description: 'File size, progress, or a readable error.' },
			{
				name: 'Attachment.Actions',
				description: 'Positions independent actions above the stretched trigger.'
			},
			{
				name: 'Attachment.Action',
				description: 'A Button, defaulting to an icon-sized ghost action.'
			},
			{
				name: 'Attachment.Trigger',
				description: 'Whole-card button or child snippet for a link or dialog trigger.'
			},
			{ name: 'Attachment.Group', description: 'Horizontally scrollable, snapping group.' }
		],
		behavior: [
			'States are idle, uploading, processing, error, and done. State styling does not perform uploads or announce progress automatically.',
			'Sizes are default, sm, and xs; orientation is horizontal or vertical. Upload shimmer stops when reduced motion is requested.',
			'Give icon actions and the stretched trigger distinct accessible names. Keyboard users must be able to open a file and operate its actions independently.'
		],
		examplePlan: [
			{
				title: 'Upload lifecycle',
				demonstrates:
					'Retry a failed upload, advance through processing, open a file preview, and operate an independent action.',
				priority: 'primary'
			}
		]
	},
	bubble: {
		purpose:
			'Bubble provides the visible surface of a conversation message, with seven variants, sender alignment, and anchored reactions. Compose it inside Message for sender identity and metadata.',
		useWhen: [
			'Displaying conversational text or rich content.',
			'Attaching reactions or interactive suggested replies to a message.'
		],
		avoidWhen: [
			'Use Message for the surrounding avatar and metadata layout.',
			'Use Card for unrelated dashboard or document content.'
		],
		anatomy: [
			{ name: 'Bubble.Root', description: 'Sets variant and start/end alignment.', required: true },
			{
				name: 'Bubble.Content',
				description: 'Message surface; accepts a child snippet for a native button or link.',
				required: true
			},
			{
				name: 'Bubble.Reactions',
				description: 'Anchors reactions at the top/bottom and start/end edge.'
			},
			{ name: 'Bubble.Group', description: 'Stacks consecutive bubbles.' }
		],
		behavior: [
			'Choose default, secondary, muted, tinted, outline, ghost, or destructive. Ghost permits full-width unframed content.',
			'Interactive content uses a child snippet with a real button or link; spread props onto that element to preserve styling and the bound ref.',
			'Label emoji-only reactions and use aria-pressed for toggle buttons. Allow vertical spacing for reactions extending beyond the bubble.'
		],
		examplePlan: [
			{
				title: 'Reply and react',
				demonstrates:
					'Keyboard-operable suggested replies, a toggle reaction, and the seven surface variants.',
				priority: 'primary'
			}
		]
	},
	message: {
		purpose:
			'Message arranges a conversation row with an avatar, sender header, message content, and footer actions. It handles alignment and grouping while Bubble supplies the visible message surface.',
		useWhen: [
			'Building a conversation with sender identity and delivery metadata.',
			'Grouping consecutive messages from one sender.'
		],
		avoidWhen: [
			'Use Bubble alone for a simple suggested reply.',
			'Use Marker for system notes without a sender.'
		],
		anatomy: [
			{ name: 'Message.Root', description: 'Row with start/end alignment.', required: true },
			{
				name: 'Message.Avatar',
				description: 'Slot for an Avatar component; an empty slot preserves alignment.'
			},
			{
				name: 'Message.Content',
				description: 'Stacks header, Bubble, and footer.',
				required: true
			},
			{ name: 'Message.Header', description: 'Sender name or contextual heading.' },
			{
				name: 'Message.Footer',
				description: 'Time, delivery status, or actions aligned with the sender.'
			},
			{ name: 'Message.Group', description: 'Groups consecutive rows from the same sender.' }
		],
		behavior: [
			'Use align="end" for outgoing rows. DOM order stays meaningful while the visual row reverses.',
			'Message adds no live region. The application owns conversation announcements and scrolling.',
			'An adjacent sender name can make an avatar decorative. Keep footer actions named and keyboard operable.'
		],
		examplePlan: [
			{
				title: 'Grouped conversation',
				demonstrates:
					'Incoming and outgoing rows, avatars, sender headers, delivery metadata, and a reply action.',
				priority: 'primary'
			}
		]
	},
	marker: {
		purpose:
			'Marker presents conversation status, system notes, bordered activity rows, and labeled separators. Its icon and content parts also support native links and buttons through a child snippet.',
		useWhen: [
			'Showing a date separator or system event between messages.',
			'Reporting task progress without inventing a message sender.'
		],
		avoidWhen: [
			'Use Alert for an urgent error requiring attention.',
			'Use Message and Bubble for content authored by a person.'
		],
		anatomy: [
			{
				name: 'Marker.Root',
				description: 'Default, separator, or border treatment; supports a child snippet.',
				required: true
			},
			{ name: 'Marker.Icon', description: 'Decorative icon, hidden from assistive technology.' },
			{ name: 'Marker.Content', description: 'Readable status or separator label.', required: true }
		],
		behavior: [
			'Add role="status" only to a mounted marker whose updates should be announced.',
			'The separator variant supplies visual rules; it does not automatically add a separator role or live announcements.',
			'Interactive markers must render a real button or link through child and spread the supplied props. Keep a visible focus indicator.'
		],
		examplePlan: [
			{
				title: 'Conversation activity',
				demonstrates:
					'A labeled separator, an updating status, a bordered event, and a keyboard-operable marker action.',
				priority: 'primary'
			}
		]
	}
} satisfies ComponentGuides;
