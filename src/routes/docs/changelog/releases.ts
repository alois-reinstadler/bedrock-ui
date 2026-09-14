export type ReleaseNote = {
	version: string;
	date: string;
	summary: string;
	additions: string[];
	changes: string[];
	migrations: string[];
	accessibility: string[];
};
/** Keep navigation hidden while this list is empty. */
export const releases: ReleaseNote[] = [];
