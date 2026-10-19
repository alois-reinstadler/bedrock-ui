"""Regenerate compact spectra from the exact catalog audio (requires ffmpeg and numpy).

The NCS host permits playback but not CORS analysis. These non-reconstructable
frequency magnitudes let the static demo visualize audio without proxying media
or rerouting the player's audio graph. Downloaded MP3/PCM files are temporary.
"""
from pathlib import Path
import concurrent.futures
import re
import struct
import subprocess
import tempfile
import urllib.request
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FPS, BANDS, RATE, FFT = 20, 48, 22050, 2048
source = (ROOT / 'src/lib/templates/music-player/data.ts').read_text()
source = source.split('export const tracks: Track[] = [', 1)[1].split('\n];', 1)[0]
tracks = re.findall(r"id: '([^']+)'.*?audio:\s*'([^']+)'", source, re.S)
output = ROOT / 'static/templates/music-player/spectra'
output.mkdir(parents=True, exist_ok=True)

def generate(track):
    track_id, url = track
    with tempfile.TemporaryDirectory() as directory:
        media = Path(directory) / 'track.mp3'
        with urllib.request.urlopen(url, timeout=60) as response:
            media.write_bytes(response.read())
        pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(media), '-f', 'f32le', '-ac', '1', '-ar', str(RATE), '-'])
    samples = np.frombuffer(pcm, dtype='<f4')
    edges = np.geomspace(35, 10000, BANDS + 1)
    bins = np.fft.rfftfreq(FFT, 1 / RATE)
    window = np.hanning(FFT)
    rows = []
    for position in np.arange(0, len(samples), RATE / FPS).astype(int):
        start = position - FFT // 2
        frame = np.zeros(FFT)
        lo, hi = max(0, start), min(len(samples), start + FFT)
        frame[lo-start:hi-start] = samples[lo:hi]
        magnitude = np.abs(np.fft.rfft(frame * window)) / (FFT / 2)
        values = []
        for low, high in zip(edges[:-1], edges[1:]):
            selected = magnitude[(bins >= low) & (bins < high)]
            value = selected.max() if len(selected) else magnitude[np.argmin(abs(bins - low))]
            values.append(np.clip((20 * np.log10(max(value, 1e-6)) + 72) / 66, 0, 1) * 255)
        rows.append(values)
    data = np.asarray(rows, dtype=np.uint8)
    target = output / (track_id + '.bin')
    target.write_bytes(struct.pack('<4sHHI', b'DRFT', FPS, BANDS, len(rows)) + data.tobytes())
    return f'{track_id}: {len(rows)} frames, {target.stat().st_size} bytes'

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for result in pool.map(generate, tracks):
            print(result, flush=True)
