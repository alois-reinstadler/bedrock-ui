import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
import CaptionsIcon from '@lucide/svelte/icons/captions';
import MaximizeIcon from '@lucide/svelte/icons/maximize';
import MinimizeIcon from '@lucide/svelte/icons/minimize';
import PauseIcon from '@lucide/svelte/icons/pause';
import PictureInPicture2Icon from '@lucide/svelte/icons/picture-in-picture-2';
import PlayIcon from '@lucide/svelte/icons/play';
import Volume2Icon from '@lucide/svelte/icons/volume-2';
import VolumeXIcon from '@lucide/svelte/icons/volume-x';
import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
import CalendarIcon from '@lucide/svelte/icons/calendar';
import CheckCheckIcon from '@lucide/svelte/icons/check-check';
import CheckIcon from '@lucide/svelte/icons/check';
import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
import CircleXIcon from '@lucide/svelte/icons/circle-x';
import ClockIcon from '@lucide/svelte/icons/clock';
import Columns3Icon from '@lucide/svelte/icons/columns-3';
import CopyIcon from '@lucide/svelte/icons/copy';
import DownloadIcon from '@lucide/svelte/icons/download';
import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
import EyeOffIcon from '@lucide/svelte/icons/eye-off';
import FileIcon from '@lucide/svelte/icons/file';
import FunnelIcon from '@lucide/svelte/icons/funnel';
import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
import ImageIcon from '@lucide/svelte/icons/image';
import InfoIcon from '@lucide/svelte/icons/info';
import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
import MenuIcon from '@lucide/svelte/icons/menu';
import MicIcon from '@lucide/svelte/icons/mic';
import PaperclipIcon from '@lucide/svelte/icons/paperclip';
import PlusIcon from '@lucide/svelte/icons/plus';
import SearchIcon from '@lucide/svelte/icons/search';
import SquareIcon from '@lucide/svelte/icons/square';
import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
import WrenchIcon from '@lucide/svelte/icons/wrench';
import XIcon from '@lucide/svelte/icons/x';
import type { IconComponent, IconName, IconType } from './types.js';

const defaultIcons: Record<IconName, IconComponent> = {
	close: XIcon,
	chevronUp: ChevronUpIcon,
	chevronDown: ChevronDownIcon,
	chevronLeft: ChevronLeftIcon,
	chevronRight: ChevronRightIcon,
	chevronsLeft: ChevronsLeftIcon,
	chevronsRight: ChevronsRightIcon,
	check: CheckIcon,
	success: CircleCheckIcon,
	error: CircleXIcon,
	warning: TriangleAlertIcon,
	info: InfoIcon,
	calendar: CalendarIcon,
	clock: ClockIcon,
	externalLink: ExternalLinkIcon,
	menu: MenuIcon,
	moreHorizontal: EllipsisIcon,
	search: SearchIcon,
	arrowUp: ArrowUpIcon,
	arrowDown: ArrowDownIcon,
	arrowsUpDown: ArrowUpDownIcon,
	funnel: FunnelIcon,
	eyeSlash: EyeOffIcon,
	viewColumns: Columns3Icon,
	copy: CopyIcon,
	checkDouble: CheckCheckIcon,
	wrench: WrenchIcon,
	stop: SquareIcon,
	microphone: MicIcon,
	download: DownloadIcon,
	add: PlusIcon,
	send: ArrowUpIcon,
	drag: GripVerticalIcon,
	attachment: PaperclipIcon,
	image: ImageIcon,
	file: FileIcon,
	loading: LoaderCircleIcon,
	play: PlayIcon,
	pause: PauseIcon,
	volume: Volume2Icon,
	volumeMuted: VolumeXIcon,
	fullscreen: MaximizeIcon,
	exitFullscreen: MinimizeIcon,
	pip: PictureInPicture2Icon,
	captions: CaptionsIcon
};

const registry = $state({ icons: { ...defaultIcons } });

/** Replace registry entries globally so an application can swap the icon set.
 * Mounted components pick the change up reactively. */
export function setIcons(overrides: Partial<Record<IconName, IconComponent>>): void {
	registry.icons = { ...registry.icons, ...overrides };
}

/** Restore the default lucide-based registry (useful in tests). */
export function resetIcons(): void {
	registry.icons = { ...defaultIcons };
}

/** Resolve a semantic name or pass a direct component through. */
export function resolveIcon(icon: IconType): IconComponent {
	return typeof icon === 'string' ? registry.icons[icon] : icon;
}
