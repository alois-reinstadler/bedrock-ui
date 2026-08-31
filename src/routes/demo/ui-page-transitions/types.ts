export type TransitionKind =
	| 'switch'
	| 'shared-forward'
	| 'shared-back'
	| 'push-forward'
	| 'push-back'
	| 'depth-forward'
	| 'depth-back'
	| 'commit'
	| 'reset';

export type RunTransition = (
	kind: TransitionKind,
	update: () => void,
	prepare?: () => void
) => void;
