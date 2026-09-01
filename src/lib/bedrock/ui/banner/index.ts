import Close from './banner-close.svelte';
import Content from './banner-content.svelte';
import Root from './banner.svelte';

export { bannerVariants, type BannerVariant } from './banner.svelte';

export {
	Root,
	Content,
	Close,
	//
	Root as Banner,
	Content as BannerContent,
	Close as BannerClose
};
