export const defaultLabels = {
	play: 'Play',
	pause: 'Pause',
	replay: 'Replay',
	mute: 'Mute',
	volume: 'Volume',
	unmute: 'Unmute',
	scrubber: 'Seek',
	timeOf: (current: string, duration: string) => `${current} of ${duration}`,
	captionsOn: (track: string) => `Captions: ${track}`,
	captionsOff: 'Captions off',
	playbackRate: (rate: number) => `Playback speed ${rate}×`,
	fullscreen: 'Full screen',
	exitFullscreen: 'Exit full screen',
	pip: 'Picture in picture',
	pipPlaceholder: 'Playing in picture in picture',
	pipReturn: 'Return to inline playback',
	buffering: 'Buffering',
	error: 'The video could not be played.',
	retry: 'Try again',
	playing: 'Playing',
	paused: 'Paused',
	seekedTo: (time: string) => `Moved to ${time}`
};

export type VideoPlayerLabels = Partial<typeof defaultLabels>;

export type VideoSource = string | { src: string; type?: string }[];

export type VideoCaptionTrack = {
	src: string;
	srclang: string;
	label: string;
	default?: boolean;
};
