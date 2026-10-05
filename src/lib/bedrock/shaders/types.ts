import type {
	MeshGradientParams,
	WarpParams,
	GrainGradientParams,
	DitheringParams,
	NeuroNoiseParams,
	GodRaysParams,
	LiquidMetalParams,
	HeatmapParams,
	FlutedGlassParams,
	ImageDitheringParams,
	HalftoneDotsParams,
	WaterParams
} from '@paper-design/shaders';
import type { ShaderId } from './catalog.js';
type VisualOptions<T> = Omit<T, 'image' | 'speed' | 'frame'>;
export interface ShaderOptions {
	'mesh-gradient': VisualOptions<MeshGradientParams>;
	warp: VisualOptions<WarpParams>;
	'grain-gradient': VisualOptions<GrainGradientParams>;
	dithering: VisualOptions<DitheringParams>;
	'neuro-noise': VisualOptions<NeuroNoiseParams>;
	'god-rays': VisualOptions<GodRaysParams>;
	'liquid-metal': VisualOptions<LiquidMetalParams>;
	heatmap: VisualOptions<HeatmapParams>;
	'fluted-glass': VisualOptions<FlutedGlassParams>;
	'image-dithering': VisualOptions<ImageDitheringParams>;
	'halftone-dots': VisualOptions<HalftoneDotsParams>;
	water: VisualOptions<WaterParams>;
}
export type ShaderState = 'loading' | 'ready' | 'unsupported' | 'error';
export interface ShaderSettings {
	effect: ShaderId;
	text?: string;
	src?: string;
	speed?: number;
	paused: boolean;
	reduced: boolean;
	maxPixelCount: number;
	options: ShaderOptions[ShaderId];
}
