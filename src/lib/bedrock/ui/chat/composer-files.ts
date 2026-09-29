import type { ChatFileConstraints, ChatFileRejection } from './composer-types';

/** Shared validation for picker, paste, and drop. No network or browser-only globals. */
export function selectComposerFiles(
	incoming: File[],
	existing: File[],
	constraints: ChatFileConstraints = {}
) {
	const { multiple = true, accept, maxFiles, maxFileSize } = constraints;
	const rules =
		accept
			?.split(',')
			.map((rule) => rule.trim().toLowerCase())
			.filter(Boolean) ?? [];
	const accepted: File[] = [];
	const rejected: ChatFileRejection[] = [];
	const count = multiple ? existing.length : 0;
	const limit = Math.max(0, Math.floor(maxFiles ?? Infinity));
	for (const file of incoming) {
		if (
			[...accepted, ...(multiple ? existing : [])].some(
				(item) =>
					item.name === file.name &&
					item.size === file.size &&
					item.type === file.type &&
					item.lastModified === file.lastModified
			)
		)
			continue;
		const type = file.type.toLowerCase();
		const supported =
			!rules.length ||
			rules.some(
				(rule) =>
					rule === '*/*' ||
					(rule.startsWith('.')
						? file.name.toLowerCase().endsWith(rule)
						: rule.endsWith('/*')
							? type.startsWith(rule.slice(0, -1))
							: type === rule)
			);
		if (!supported) rejected.push({ file, reason: 'type' });
		else if (maxFileSize !== undefined && file.size > maxFileSize)
			rejected.push({ file, reason: 'size' });
		else if ((!multiple && accepted.length >= 1) || count + accepted.length >= limit)
			rejected.push({ file, reason: 'count' });
		else accepted.push(file);
	}
	return {
		accepted,
		rejected,
		files: accepted.length ? (multiple ? [...existing, ...accepted] : accepted) : existing
	};
}
