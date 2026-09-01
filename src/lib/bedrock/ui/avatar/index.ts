import Badge from './avatar-badge.svelte';
import Fallback from './avatar-fallback.svelte';
import GroupCount from './avatar-group-count.svelte';
import Group from './avatar-group.svelte';
import Image from './avatar-image.svelte';
import Stack from './avatar-stack.svelte';
import Root from './avatar.svelte';

export { type AvatarStackItem } from './avatar-stack.svelte';

export {
	Root,
	Image,
	Fallback,
	Badge,
	Group,
	GroupCount,
	Stack,
	//
	Root as Avatar,
	Image as AvatarImage,
	Fallback as AvatarFallback,
	Badge as AvatarBadge,
	Group as AvatarGroup,
	GroupCount as AvatarGroupCount,
	Stack as AvatarStack
};
