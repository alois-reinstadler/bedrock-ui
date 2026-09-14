"""Original silent motion landscapes authored for Bedrock. Requires existing numpy + ffmpeg.
Run from this directory: python3 render-films.py. No downloaded source material.
"""
import math
import subprocess
from pathlib import Path
import numpy as np

WIDTH, HEIGHT, FPS, SECONDS = 960, 540, 24, 24
Y, X = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
x, y = X / WIDTH, Y / HEIGHT
rng = np.random.default_rng(214)
stars = [(rng.uniform(0, 1), rng.uniform(0, .62), rng.uniform(.6, 1.6)) for _ in range(95)]
root = Path(__file__).parent
star_base = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
star_sin = star_base.copy()
star_cos = star_base.copy()
for sx, sy, size in stars:
    glow = np.exp(-((X - sx * WIDTH)**2 + (Y - sy * HEIGHT)**2) / (size * 2)**2)
    star_base += glow * 95
    star_sin += glow * 20 * math.cos(sx * 9)
    star_cos += glow * 20 * math.sin(sx * 9)

def image(kind, t):
    if kind == 'signal-above':
        dawn = (1 - math.cos(t / SECONDS * math.pi)) * .5
        top = np.array([8, 14, 35]) + np.array([15, 8, 16]) * dawn
        bottom = np.array([34, 77, 89]) + np.array([60, 22, 10]) * dawn
        frame = np.broadcast_to(top + (bottom - top) * y[..., None], (HEIGHT, WIDTH, 3)).copy()
        starfield = star_base + star_sin * math.sin(t * .4) + star_cos * math.cos(t * .4)
        frame += starfield[..., None] * (1 - dawn * .6)
        for i in range(3):
            ribbon = .25 + i * .052 + .06 * np.sin(x * 7 + t * .13 + i)
            curtain = np.exp(-((y - ribbon) / (.032 + i * .009))**2)
            curtain *= np.clip(np.sin(x * 2.8 + t * .07), 0, 1) * (1 - y)
            frame += curtain[..., None] * np.array([17, 70, 48])
        for i in range(4):
            ridge = .61 + i * .084 + .065 * np.sin(x * (8 + i * 3) + i * 2 + t * .009 * i) + .022 * np.cos(x * 31 + i)
            shade = np.array([19, 35, 47]) * (1 - i * .2)
            frame[y > ridge] = shade
        # A single distant signal slowly sweeps across the observatory sky.
        point_x = .18 + .65 * t / SECONDS
        point_y = .26 - .065 * math.sin(t / SECONDS * math.pi)
        signal = np.exp(-((x - point_x)**2 + (y - point_y)**2) / .000018)
        frame += signal[..., None] * np.array([150, 160, 120])
    else:
        top, bottom = np.array([64, 49, 79]), np.array([235, 165, 109])
        frame = np.broadcast_to(top + (bottom - top) * y[..., None], (HEIGHT, WIDTH, 3)).copy()
        sun_y = .48 - t / SECONDS * .19
        distance = ((x - .68)**2 + ((y - sun_y) * HEIGHT / WIDTH)**2)**.5
        glow = np.exp(-(distance / .16)**2)
        frame += glow[..., None] * np.array([45, 28, 9])
        frame[distance < .052] = [254, 226, 161]
        for i in range(5):
            ridge = .59 + i * .084 + .045 * np.sin(x * 6 + i * 1.9 + t * .015 * (i + 1))
            shade = np.array([157, 91, 88]) - np.array([23, 16, 11]) * i
            frame[y > ridge] = shade
        for i in range(7):
            px = .10 + i * .125 + math.sin(t * .18 + i) * .018
            py = .56 - ((t * .012 + i * .075) % .48)
            size = .008 + i * .001
            diamond = np.abs(x - px) / size + np.abs(y - py) / (size * 1.8)
            frame[diamond < 1] = [245, 191 + i * 4, 137]
            frame[(diamond < 1) & (x < px)] = [200, 130 + i * 5, 107]
    vignette = np.clip(1 - .23 * ((x - .5)**2 * 2 + (y - .5)**2), .7, 1)
    fade = min(1, t / 1.3, (SECONDS - t) / 1.3)
    return np.clip(frame * vignette[..., None] * max(0, fade), 0, 255).astype(np.uint8)

for kind in ['signal-above', 'paper-suns']:
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{WIDTH}x{HEIGHT}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-pix_fmt', 'yuv420p', '-threads', '2', '-movflags', '+faststart', str(root / f'{kind}.mp4')]
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for frame in range(FPS * SECONDS):
        process.stdin.write(image(kind, frame / FPS).tobytes())
    process.stdin.close()
    if process.wait(): raise RuntimeError('ffmpeg encoding failed')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '12', '-i', str(root / f'{kind}.mp4'), '-frames:v', '1', '-q:v', '2', str(root / f'{kind}.jpg')], check=True)
    print(kind, (root / f'{kind}.mp4').stat().st_size, 'bytes', flush=True)
