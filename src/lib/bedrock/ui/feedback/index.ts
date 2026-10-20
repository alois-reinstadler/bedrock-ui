export {
	default as PageAnnotations,
	default as Feedback,
	default as Root
} from './feedback.svelte';
export { feedbackMarkdown, feedbackPage, parseFeedback } from './model.js';
export type {
	FeedbackAnnotation,
	FeedbackElementTarget,
	FeedbackMode,
	FeedbackPayload,
	FeedbackProps,
	FeedbackStatus,
	FeedbackTarget
} from './types.js';
