# Emoji

One component for an individual emoji or text containing emoji:

```svelte
<script lang="ts">
	import { Emoji } from '#lib/bedrock/ui/emoji';
</script>

<Emoji value="😊" size={24} label="Happy" />
<Emoji value="Ready to ship 🚀✨" />
```

The component preserves the actual Unicode in text nodes. Apple artwork is painted
with a CSS pseudo-element, so there are no image elements in the selectable
content. Native dragging is cancelled to prevent ghost images of selected text. Selecting
and copying uses the browser's normal behavior: text stays text, including skin
tones, flags, keycaps, and ZWJ sequences. There is no copy listener or global DOM
replacement. `value` is plain text, so HTML is escaped. Whitespace follows normal
CSS rules; use `class="whitespace-pre-wrap"` for visible line breaks and repeated
spaces. Unsupported emoji and failed images fall back to native Unicode.

`size` sets the content's font size (CSS length or numeric pixels); the default
inherits the surrounding font. `class`, `style`, native attributes, and `bind:ref`
target the outer span. A single emoji has image semantics; mixed text reads in
normal document order. `label` names the whole value. `decorative` hides it from
assistive technology when adjacent text or a button label already explains it.

Artwork resolution is internal. Images load on demand from
`emoji-datasource-apple@16.0.0/img/apple/64` on jsDelivr. Permit
`https://cdn.jsdelivr.net` in CSP `img-src`. Newer unsupported emoji remain native.
Without `Intl.Segmenter`, the component renders plain text.

**Artwork licensing remains unresolved.** Apple images are © Apple Inc.; the
public source does not grant commercial usage rights. The metadata MIT license
does not license Apple's artwork. See the
[upstream image licensing](https://github.com/iamcal/emoji-data#image-sources).

`codepoints.json` contains metadata derived from `emoji-datasource` 16.0.0's
`emoji.json`: canonical sequences with available Apple images, including skin
variations. Its MIT license is included in `LICENSE.metadata`. Asset filenames
are lowercase codepoints joined by hyphens. Lookup normalizes variation selectors
while retaining the canonical filename.
