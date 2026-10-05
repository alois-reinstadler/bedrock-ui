# Color family

The six color components use the same HSV model and canonical `#rrggbb` output (`#rrggbbaa` with `alpha`). They accept hex, RGB/RGBA, and HSL/HSLA input. They do not require WebGL or extra dependencies.

`ColorPicker` keeps its existing assembled panel, `variant="swatches"`, labels, format binding, and value binding. Supply children to assemble a custom picker: descendant controls inherit its value, alpha mode, and disabled state. An explicit control value opts out of that shared value. A named picker submits one canonical value through a hidden form input; disabled controls are excluded.

```svelte
<ColorPicker bind:value alpha name="accent">
	<ColorArea />
	<ColorSlider channel="hue" />
	<ColorSlider channel="alpha" />
	<div class="flex items-center gap-2">
		<ColorSwatch />
		<ColorField format="rgb" />
	</div>
	<ColorSwatchPicker swatches={['#ef4444', '#10b981', '#8b5cf6']} />
</ColorPicker>
```

Every control also supports standalone `bind:value`. `ColorSwatch` is a display, with an optional label and a checkerboard showing transparency. `ColorSwatchPicker` is a labeled group of toggle buttons; normalized colors determine the pressed state. Each choice is keyboard reachable and duplicate palette values are supported.

`ColorArea` edits saturation horizontally and brightness vertically. Its accessible description explains arrow keys for saturation, Alt+arrows for brightness, Shift for larger increments, and Home/End/PageUp/PageDown endpoints and jumps. `ColorSlider` edits hue, saturation, brightness, or alpha with the same keys. Both capture the active pointer, clamp out-of-bounds dragging, and suppress touch scrolling only on the control.

`ColorField` preserves the draft while typing, updates the canonical value only for complete valid colors, and leaves the last valid form value intact on invalid input. Escape discards the draft; blur or Enter formats valid input. Switching format or changing the shared color discards stale drafts. RGB and HSL display alpha when enabled.

Keep a visible label or surrounding field description when the control's purpose is not obvious. Override `label`, `invalidMessage`, or the picker's `labels` for localization. The color does not communicate a semantic status by itself.
