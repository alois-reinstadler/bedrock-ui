import type { SVGAttributes } from 'svelte/elements';

export type ShapeProps = Omit<SVGAttributes<SVGSVGElement>, 'children'> & {
	/** Reference to the rendered SVG element. */
	ref?: SVGSVGElement | null;
	/** Accessible name. Omit for decorative artwork. */
	label?: string;
};
