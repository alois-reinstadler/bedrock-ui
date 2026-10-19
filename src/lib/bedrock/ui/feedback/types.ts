export type FeedbackMode = 'developer' | 'review';
export type FeedbackStatus = 'open' | 'resolved';

export type FeedbackElementTarget = {
	kind: 'element';
	selector: string;
	label: string;
	text: string;
	tag: string;
	/** Viewport coordinates at capture time, not a live position. */
	rect?: { x: number; y: number; width: number; height: number };
	styles?: Record<string, string>;
};

export type FeedbackTarget = Omit<FeedbackElementTarget, 'kind'> & {
	kind: 'element' | 'page' | 'group';
	/** A box selection stores each element separately; groups cannot nest. */
	elements?: FeedbackElementTarget[];
};

export type FeedbackAnnotation = {
	id: string;
	page: string;
	comment: string;
	status: FeedbackStatus;
	createdAt: string;
	updatedAt: string;
	viewport: { width: number; height: number; pixelRatio: number };
	target: FeedbackTarget;
	/** A customer copy suggestion. The host page is never permanently changed. */
	textChange?: { before: string; after: string };
};

export type FeedbackPayload = {
	version: 1;
	project: string;
	revision?: string;
	annotations: FeedbackAnnotation[];
};

export type FeedbackProps = {
	/** Bind to open the toolbar from an application-owned control. */
	open?: boolean;
	/** Hide the built-in launcher when the application supplies its own trigger. */
	showLauncher?: boolean;
	/** External trigger to restore focus to when the panel closes. */
	trigger?: HTMLElement | null;
	/** Anchor the toolbar above bottom controls when needed. Note composers position beside their target. */
	placement?: 'bottom-right' | 'top-right';
	/** Developer mode exposes selectors and style context; review mode uses plain language. */
	mode?: FeedbackMode;
	/** Unmounts the UI and removes inspection listeners when false. Not an authorization boundary. */
	enabled?: boolean;
	/** Bind for application-owned state. */
	annotations?: FeedbackAnnotation[];
	project?: string;
	revision?: string;
	/** Pass a reactive route identifier for SPA navigation. Query strings are omitted by default. */
	pageUrl?: string;
	/** Optional CSS selector limiting which part of the page can be inspected. */
	scope?: string;
	/** Explicit opt-in to browser draft storage. Use a different key for each project/reviewer. */
	storageKey?: string;
	onChange?: (annotations: FeedbackAnnotation[]) => void;
	/** The application owns authentication, authorization and durable storage. Reject on failure. */
	onSubmit?: (payload: FeedbackPayload) => void | Promise<void>;
};
