/** Make a transparent text mask; the semantic text remains in the HTML component. */
export async function textMask(text: string, document: Document): Promise<string> {
	await document.fonts.ready;
	const canvas = document.createElement('canvas');
	canvas.width = 1200;
	canvas.height = 480;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Text mask could not be created');
	ctx.font = '800 240px "Instrument Sans Variable", sans-serif';
	const width = ctx.measureText(text).width;
	const size = Math.min(240, (240 * 1080) / Math.max(width, 1));
	ctx.font = `800 ${size}px "Instrument Sans Variable", sans-serif`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillText(text, 600, 240);
	return canvas.toDataURL('image/png');
}
export async function loadShaderImage(src: string): Promise<HTMLImageElement> {
	const image = new Image();
	image.crossOrigin = 'anonymous';
	image.src = src;
	await image.decode();
	if (!image.naturalWidth) throw new Error('Image could not be decoded');
	return image;
}
export async function loadShaderBlob(blob: Blob): Promise<HTMLImageElement> {
	const url = URL.createObjectURL(blob);
	try {
		return await loadShaderImage(url);
	} finally {
		URL.revokeObjectURL(url);
	}
}
