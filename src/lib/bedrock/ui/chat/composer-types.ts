import type { IconType } from '#lib/bedrock/ui/icon';

export type ChatModelOption = {
	value: string;
	label: string;
	provider?: string;
	description?: string;
	/** Optional section, such as Legacy models. */
	group?: string;
	icon?: IconType;
	disabled?: boolean;
};
export type ChatReasoningOption = {
	value: string;
	label: string;
	description?: string;
	default?: boolean;
	disabled?: boolean;
};
export type ChatServiceTierOption = ChatReasoningOption;
export type ChatComposerSubmission = {
	files: File[];
	model?: string;
	reasoning?: string;
	serviceTier?: string;
};
export type ChatFileRejection = { file: File; reason: 'type' | 'size' | 'count' };
export type ChatFileConstraints = {
	multiple?: boolean;
	accept?: string;
	maxFiles?: number;
	maxFileSize?: number;
};

/** Display choices only. Pass the subset supported by your model and transport. */
export const defaultReasoningOptions: ChatReasoningOption[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium', default: true },
	{ value: 'high', label: 'High' },
	{ value: 'xhigh', label: 'Extra High' },
	{ value: 'max', label: 'Max' },
	{ value: 'ultra', label: 'Ultra' }
];

/** App-owned upload state. File identity must match an entry in Composer.files. */
export type ChatUpload = {
	file: File;
	status: 'queued' | 'uploading' | 'processing' | 'complete' | 'error' | 'cancelled';
	/** Upload percentage from 0 to 100; omit for indeterminate progress. */
	progress?: number;
	error?: string;
};
