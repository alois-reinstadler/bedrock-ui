import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { SkeletonVariant } from './skeleton.svelte';

export const [getSkeletonGroup, setSkeletonGroup, hasSkeletonGroup] = createContext<{
	readonly variant: SkeletonVariant;
	register: Attachment<HTMLElement>;
}>();
