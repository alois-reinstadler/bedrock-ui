<script lang="ts">
	import QR from 'qrcode';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	export type QRCodeProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		value: string;
		size?: number;
		label?: string;
		foreground?: string;
		background?: string;
		modules?: 'square' | 'dots';
		finder?: 'square' | 'rounded';
		errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
	};
	let {
		value,
		size = 192,
		label = 'QR code',
		foreground = '#111111',
		background = '#ffffff',
		modules = 'square',
		finder = 'square',
		errorCorrectionLevel = 'M',
		class: className,
		...rest
	}: QRCodeProps = $props();
	const code = $derived.by(() => {
		try {
			return value ? QR.create(value, { errorCorrectionLevel }) : null;
		} catch {
			return null;
		}
	});
	const cells = $derived.by(() => {
		if (!code) return [];
		const n = code.modules.size;
		const out: { x: number; y: number; finder: boolean }[] = [];
		for (let y = 0; y < n; y++)
			for (let x = 0; x < n; x++)
				if (code.modules.get(y, x))
					out.push({
						x: x + 4,
						y: y + 4,
						finder: (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
					});
		return out;
	});
	const corners = $derived(
		code
			? [
					{ x: 4, y: 4 },
					{ x: code.modules.size - 3, y: 4 },
					{ x: 4, y: code.modules.size - 3 }
				]
			: []
	);
</script>

<div
	{...rest}
	data-slot="qr-code"
	class={cn('inline-flex max-w-full flex-col items-center gap-2', className)}
>
	{#if code}
		<svg
			role="img"
			aria-label={`${label}: ${value}`}
			width={size}
			height={size}
			viewBox={`0 0 ${code.modules.size + 8} ${code.modules.size + 8}`}
			class="h-auto max-w-full"
		>
			<title>{label}: {value}</title>
			<rect width="100%" height="100%" fill={background} />
			<g fill={foreground}>
				{#each cells as cell (`${cell.x}:${cell.y}`)}
					{#if !cell.finder}
						{#if modules === 'dots'}<circle
								cx={cell.x + 0.5}
								cy={cell.y + 0.5}
								r="0.48"
							/>{:else}<rect x={cell.x} y={cell.y} width="1" height="1" />{/if}
					{/if}
				{/each}
				{#each corners as corner (corner.x + ':' + corner.y)}
					<rect x={corner.x} y={corner.y} width="7" height="7" rx={finder === 'rounded' ? 1 : 0} />
					<rect
						x={corner.x + 1}
						y={corner.y + 1}
						width="5"
						height="5"
						rx={finder === 'rounded' ? 0.65 : 0}
						fill={background}
					/>
					<rect
						x={corner.x + 2}
						y={corner.y + 2}
						width="3"
						height="3"
						rx={finder === 'rounded' ? 0.4 : 0}
					/>
				{/each}
			</g>
		</svg>
	{:else}<p role="status" class="text-sm text-muted-foreground">
			Unable to encode this value.
		</p>{/if}
</div>
