# Slider and checkbox feedback

The slider keeps the Bits single-value, range, vertical and keyboard contracts.
Its thumb is slightly larger with a surface-colored fill, subtle shadow and a focus
ring. Hover and active-thumb states gently thicken the track; the active thumb gains
12% scale. Only paint and independent `scale` change: Bits remains the sole owner
of position, so dragging never waits for an animation. Disabled tracks do not react.
Touch targets include the root's 24px cross-axis minimum and the thumb's hit area.

The checkbox and decorative checkbox indicator share a Lucide Check renderer. Its
stroke draws from the short leg to the long leg using CSS dash offset. The checked
state and form value update immediately; unchecking removes the mark immediately.
The indeterminate mark and caller-supplied decorative indicator children retain
their existing behavior. No strikethrough is added.

Both treatments use Bedrock timing tokens and the engine-free motion policy.
Application reduction or OS reduced motion disables movement and immediately
settles a running check drawing. Focus and checked state remain visible.

Verification: seven focused shared-Chrome tests across the control-polish and
indicator suites cover immediate form/state updates, real Lucide geometry,
stroke animation, live application reduction and scalar/range/vertical/disabled
keyboard behavior. Parent integration owns the final page appearance review.
