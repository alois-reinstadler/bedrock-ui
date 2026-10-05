import type { ComponentDoc } from '../registry.js';
import type { ComponentGuides } from './types.js';

type Expansion = ComponentDoc & {
	behavior: string[];
	useWhen: [string, string];
	avoidWhen: [string, string];
};

const colorBehavior = [
	'Import individual controls to build a custom editor, or use ColorPicker for the assembled interface. Shared picker context synchronizes controls; standalone controls accept their own value.',
	'Preserve a useful hue when changing through gray or black. Alpha, parsing and serialization share the same color model.',
	'Give interactive controls visible labels. Allow partial text editing; do not use color alone to convey selection or errors.'
];

const definitions: Expansion[] = [
	{
		slug: 'shapes',
		title: 'Shapes',
		category: 'display',
		description:
			'72 individual SVG components from ShapesGallery, styled with native SVG attributes and CSS.',
		behavior: [
			'Import individual components such as Shape01 and Shape18 from #lib/bedrock/ui/shapes. Each has its own .svelte file with an inline SVG path; there is no generic renderer or runtime shape registry.',
			'The component names preserve the original ShapesGallery numbering. Use class for size, text color and rotation, or native SVG attributes such as fill, width and height. The default fill is currentColor.',
			'Each shape accepts the same ShapeProps contract and a bindable SVG ref. Supply label for meaningful artwork; omit it for decoration.',
			'The picker, catalog and SVG copy/download helpers belong to this documentation site. Preserve ATTRIBUTION.txt when copying the components.'
		],
		useWhen: [
			'Add a graphic accent to cards, hero sections or empty states.',
			'Compose a local collection of scalable, recolorable SVG artwork.'
		],
		avoidWhen: [
			'Use an icon with a familiar meaning for interface actions.',
			'Do not use decorative shapes as the only way to communicate information.'
		]
	},
	{
		slug: 'color-area',
		title: 'Color Area',
		category: 'form',
		description:
			'A two-dimensional saturation and brightness control for a shared or standalone color.',
		behavior: colorBehavior,
		useWhen: [
			'Users need to explore saturation and brightness together.',
			'A custom picker combines an area with hue and alpha controls.'
		],
		avoidWhen: [
			'Use ColorSwatchPicker for a constrained palette.',
			'Do not make pointer dragging the only way to edit the color.'
		]
	},
	{
		slug: 'color-field',
		title: 'Color Field',
		category: 'form',
		description: 'Editable color text with parsing, format selection and validation feedback.',
		behavior: colorBehavior,
		useWhen: [
			'Users paste or enter a precise brand color.',
			'A graphical picker also needs an editable text value.'
		],
		avoidWhen: [
			'Use ColorSwatch for a read-only preview.',
			'Do not overwrite incomplete input on every keystroke.'
		]
	},
	{
		slug: 'color-slider',
		title: 'Color Slider',
		category: 'form',
		description: 'A labeled color-channel slider for hue, saturation, brightness or alpha.',
		behavior: colorBehavior,
		useWhen: [
			'One color channel needs precise keyboard or pointer adjustment.',
			'A custom editor exposes hue or transparency separately.'
		],
		avoidWhen: [
			'Use Slider for values unrelated to color.',
			'Do not omit the channel name or current value.'
		]
	},
	{
		slug: 'color-swatch',
		title: 'Color Swatch',
		category: 'display',
		description: 'A reusable color preview with a transparency checkerboard and accessible label.',
		behavior: colorBehavior,
		useWhen: [
			'Show the current brand, category or palette color.',
			'Preview transparency against a checkerboard.'
		],
		avoidWhen: [
			'Use ColorSwatchPicker when selection is required.',
			'Do not convey status through a swatch without text.'
		]
	},
	{
		slug: 'color-swatch-picker',
		title: 'Color Swatch Picker',
		category: 'form',
		description: 'A selectable palette of named colors with a visible current selection.',
		behavior: colorBehavior,
		useWhen: ['Users choose from an approved palette.', 'A picker offers reusable preset colors.'],
		avoidWhen: [
			'Use ColorArea and ColorField for arbitrary colors.',
			'Do not rely on color differences alone to identify the selected swatch.'
		]
	},
	{
		slug: 'phone-input',
		title: 'Phone Input',
		category: 'form',
		description:
			'An international telephone field with country selection and normalized number metadata.',
		behavior: [
			'Uses libphonenumber-js metadata for calling codes and parsing. The editable text remains separate from normalized E.164 output.',
			'International pasted numbers retain their prefix. Country selection provides context for national numbers; default country is configurable.',
			'Use a visible label, autocomplete="tel" and a meaningful error message. A valid format does not verify ownership or that a number can receive calls.'
		],
		useWhen: [
			'Collect international contact numbers.',
			'A form needs both editable input and normalized phone metadata.'
		],
		avoidWhen: [
			'Use a simple text input for extension-only internal identifiers.',
			'Do not treat format validation as phone ownership verification.'
		]
	},
	{
		slug: 'qr-code',
		title: 'QR Code',
		importName: 'QRCode',
		category: 'display',
		description:
			'An SVG QR code with configurable module styling and an accessible text alternative.',
		behavior: [
			'Install qrcode when copying this component.',
			'A four-module quiet zone surrounds the code. Keep strong foreground/background contrast and test the final rendered size with real scanners.',
			'Provide an equivalent link or readable value. Encoding is presentation, not a trust or verification mechanism.'
		],
		useWhen: [
			'Transfer a link from desktop to a phone.',
			'Display pairing, ticket or sharing data in a scannable form.'
		],
		avoidWhen: [
			'Do not make scanning the only way to access a destination.',
			'Avoid decorative styling that makes the final code hard to scan.'
		]
	},
	{
		slug: 'marquee',
		title: 'Marquee',
		category: 'display',
		description:
			'A continuous horizontal or vertical content track with accessible pause behavior.',
		behavior: [
			'Provide a pause control for continuously moving content. Hover and keyboard focus pause the track.',
			'Repeated visual copies are hidden from assistive technology and inert. Only the original content participates in keyboard navigation.',
			'Reduced motion presents static content. Keep essential announcements available independently of the moving track.'
		],
		useWhen: [
			'Show a decorative strip of customer logos.',
			'Present short repeatable highlights with pause controls.'
		],
		avoidWhen: [
			'Use a list for content that requires careful reading.',
			'Do not hide essential actions in a continuously moving track.'
		]
	},
	{
		slug: 'animated-signature',
		title: 'Animated Signature',
		category: 'display',
		description: 'A decorative handwriting reveal from SVG paths or text with a supplied font.',
		behavior: [
			'Font-to-path conversion uses opentype.js and is loaded only when needed. Supply a licensed, reachable font URL or prepared paths.',
			'The accessible original text remains available while the decorative paths draw. Reduced motion shows the settled signature.',
			'This is a visual effect, not a signature capture or identity verification control.'
		],
		useWhen: [
			'Add a restrained personal sign-off to a portfolio.',
			'Reveal a prepared handwritten brand mark.'
		],
		avoidWhen: [
			'Use a signature capture workflow for user signing.',
			'Do not animate essential long-form reading text as a signature.'
		]
	},
	{
		slug: 'spotlight',
		title: 'Spotlight',
		category: 'display',
		description:
			'Pointer-following surface and border illumination, individually or across a card group.',
		behavior: [
			'SpotlightGroup shares pointer coordinates across its cards. Each surface clips its own fill and border light so gaps stay unpainted.',
			'The decorative layers do not capture input. Keep semantic links/buttons and focus rings in the content.',
			'Use Spotlight alone or compose it with TiltCard. Motion reduction preserves readable content without pointer-driven movement.'
		],
		useWhen: [
			'Give a feature card a subtle pointer highlight.',
			'Illuminate nearby card borders across a shared grid.'
		],
		avoidWhen: [
			'Do not rely on pointer light to communicate focus or selection.',
			'Avoid bright effects behind low-contrast text.'
		]
	},
	{
		slug: 'tilt-card',
		title: 'Tilt Card',
		category: 'display',
		description:
			'A perspective card surface with bounded pointer tilt and a neutral touch presentation.',
		behavior: [
			'Tilt owns an inner transform layer so outer positioning and entrance transforms remain independent.',
			'Pointer leave returns the surface to rest; touch and reduced motion retain a neutral presentation.',
			'The optional Astra Tilt primitive owns pointer springs. Bedrock owns the spotlight surface, styling and application motion policy.'
		],
		useWhen: [
			'Add depth to a product or image preview.',
			'Compose a small perspective effect with a spotlight surface.'
		],
		avoidWhen: [
			'Keep dense forms and long reading surfaces stable.',
			'Do not make hover motion necessary to discover controls.'
		]
	},
	{
		slug: 'text-shimmer',
		title: 'Text Shimmer',
		category: 'content',
		description: 'A restrained moving highlight across text with a readable static presentation.',
		behavior: [
			'The original text remains semantic and selectable; shimmer is decorative.',
			'Reduced motion disables the repeating effect. Use ordinary text for essential labels that must remain visually stable.'
		],
		useWhen: [
			'Highlight a short decorative headline.',
			'Give a brief status phrase a subtle visual treatment.'
		],
		avoidWhen: [
			'Do not shimmer an entire article or form.',
			'Do not communicate loading or status through shimmer alone.'
		]
	},
	{
		slug: 'text-highlight',
		title: 'Text Highlight',
		category: 'content',
		description:
			'Semantic highlighted text with an optional animated background or underline treatment.',
		behavior: [
			'Apply emphasis to a short phrase while preserving the underlying text.',
			'Reduced motion settles the decoration immediately. Check text contrast over the highlighted background in both themes.'
		],
		useWhen: [
			'Emphasize a phrase in a heading or paragraph.',
			'Show a short marked passage with optional motion.'
		],
		avoidWhen: [
			'Do not use decorative highlight as the only error indicator.',
			'Use ordinary emphasis when a colored surface would harm readability.'
		]
	},
	{
		slug: 'light-rays',
		title: 'Light Rays',
		category: 'display',
		requirements: ['webgl2'],
		description:
			'Spell UI’s light rays, ported to Svelte with the original shader and defaults. Requires WebGL2.',
		behavior: [
			'Uses Spell UI’s two overhead ray sources, original color blending and animation timing. intensity, rays, reach and position use the original 0–100 scale; defaults are 13, 32, 16 and 50.',
			'Give the surface height or padding, or place it absolutely inside a positioned parent. Content can be supplied as children; the decorative canvas ignores pointer input.',
			'raysColor supports single, multi and random modes. Single defaults to #639AFF. Supply hex or RGB colors for the rays; backgroundColor also accepts CSS variables and defaults to #000.',
			'animation defaults to { animate: true, speed: 10 }. Use paused or animation.animate=false to stop playback. Reduced motion settles to a static frame; offscreen and hidden-document rendering pauses.',
			'The background color remains during loading or unavailable WebGL2. Context restoration rebuilds the shader. Rendering defaults to one million physical pixels. Preserve the Spell UI MIT license and Paper renderer notices when redistributing.'
		],
		useWhen: [
			'Add Spell UI’s overhead light rays to a hero or feature panel.',
			'A solid background is an acceptable fallback when WebGL2 is unavailable.'
		],
		avoidWhen: [
			'Do not encode essential information in decorative shader pixels.',
			'Avoid mounting large numbers of animated WebGL surfaces in dense lists.'
		]
	},
	{
		slug: 'animated-gradient',
		title: 'Animated Gradient',
		category: 'display',
		requirements: ['webgl2'],
		description: 'A flowing mesh gradient with a static CSS fallback. Requires WebGL2.',
		behavior: [
			'Requires WebGL2 and the pinned @paper-design/shaders@0.0.81 vanilla dependency. The static CSS gradient remains during SSR, loading, unsupported rendering and context loss.',
			'Give the surface height or padding. Place readable content over it; the background is decorative and ignores pointer input.',
			'Colors accept up to ten hex strings. CSS variables and OKLCH are not accepted shader colors.',
			'Use paused or speed=0 to stop playback. Reduced motion settles to a static frame; offscreen and hidden-document rendering pauses automatically.',
			'Rendering defaults to a one-million physical-pixel budget per surface. Unmounting disposes the GPU resources. Preserve the Paper LICENSE and NOTICE when redistributing its code.'
		],
		useWhen: [
			'An atmospheric hero or feature panel benefits from an animated background.',
			'A static gradient is an acceptable fallback for unavailable WebGL2.'
		],
		avoidWhen: [
			'Do not encode essential data in decorative shader pixels.',
			'Avoid mounting large numbers of animated WebGL surfaces in dense lists.'
		]
	},
	...(['dot-pattern', 'grid-pattern', 'noise-overlay'] as const).map((slug): Expansion => ({
		slug,
		title: {
			'dot-pattern': 'Dot Pattern',
			'grid-pattern': 'Grid Pattern',
			'noise-overlay': 'Noise Overlay'
		}[slug],
		category: 'display',
		description: {
			'dot-pattern': 'A static dot texture with adjustable spacing, contrast and radial fading.',
			'grid-pattern': 'A static line grid with adjustable spacing, weight and radial fading.',
			'noise-overlay': 'A deterministic SVG noise texture for gently textured surfaces.'
		}[slug],
		behavior: [
			'Uses CSS/SVG and does not require WebGL. Place the layer in a positioned container.',
			'Decorative layers are hidden from assistive technology and do not intercept pointer events.',
			'Keep contrast subtle and verify foreground readability. DotPattern includes a subtle preset; patterns expose spacing/scale and opacity.'
		],
		useWhen: [
			'Give a quiet section a little texture.',
			'Compose a static background with independent foreground content.'
		],
		avoidWhen: [
			'Avoid dense textures behind small low-contrast text.',
			'Do not use a decorative pattern to convey essential information.'
		]
	}))
];

export const expansionComponents: ComponentDoc[] = definitions.map(
	({ slug, title, category, description, importName, requirements }) => ({
		slug,
		title,
		category,
		description,
		importName,
		requirements
	})
);

export const expansionGuides: ComponentGuides = Object.fromEntries(
	definitions.map((component) => [
		component.slug,
		{
			purpose: component.description,
			useWhen: component.useWhen,
			avoidWhen: component.avoidWhen,
			anatomy:
				component.slug === 'shapes'
					? Array.from({ length: 72 }, (_, index) => ({
							name: `Shape${String(index + 1).padStart(2, '0')}`,
							description: `Independent SVG component for ShapesGallery shape ${index + 1}.`
						}))
					: [
							{
								name: component.importName ?? component.title.replaceAll(' ', ''),
								description: component.description,
								required: true
							}
						],
			behavior: component.behavior,
			examplePlan: [
				{
					title: 'Composition and variants',
					demonstrates: component.useWhen.join(' '),
					priority: 'primary'
				}
			]
		}
	])
);
