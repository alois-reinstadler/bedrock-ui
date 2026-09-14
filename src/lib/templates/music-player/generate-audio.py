"""Render original Drift instrumental sketches with Python stdlib + ffmpeg.

Run from repository root: python3 src/lib/templates/music-player/generate-audio.py
No samples, external recordings, copyrighted melodies, or third-party artwork.
Original project assets. Deterministic seed per song.
"""
from array import array
from pathlib import Path
import math
import random
import subprocess
import tempfile
import wave

RATE = 22050
ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / 'static/templates/music-player'
OUT.mkdir(parents=True, exist_ok=True)
SONGS = [
    ('soft-static', 90, 57, [0, 5, 3, 7]),
    ('north-window', 84, 60, [0, 7, 5, 3]),
    ('blue-hour', 96, 55, [0, 3, 5, 7]),
    ('off-grid', 100, 62, [0, 5, 7, 3]),
    ('slow-current', 84, 53, [0, 3, 7, 5]),
    ('paper-moon', 92, 60, [0, 5, 3, 7]),
    ('room-tone', 88, 58, [0, 7, 3, 5]),
    ('green-line', 96, 57, [0, 5, 7, 3]),
    ('open-late', 86, 55, [0, 3, 5, 7]),
]
# Twelve four-beat bars plus a two-second tail: 30.8–36.3 seconds.
for song_index, (slug, bpm, tonic, progression) in enumerate(SONGS):
    beat = 60 / bpm
    duration = 48 * beat + 2
    samples = array('f', [0]) * int(duration * RATE)
    rng = random.Random(404 + song_index)

    def note(start, length, midi, gain, voice):
        frequency = 440 * 2 ** ((midi - 69) / 12)
        first = int(start * RATE)
        count = min(int(length * RATE), len(samples) - first)
        for i in range(count):
            t = i / RATE
            attack = min(1, t / (0.045 if voice == 'pad' else 0.012))
            release = min(1, max(0, (length - t) / 0.18))
            phase = 2 * math.pi * frequency * t
            if voice == 'pad':
                signal = (math.sin(phase) + 0.2 * math.sin(phase * 2.002)) * 0.8
                envelope = attack * release
            elif voice == 'bass':
                signal = math.sin(phase) + 0.13 * math.sin(phase * 2)
                envelope = attack * release * math.exp(-t * 2)
            else:
                signal = math.sin(phase) + 0.32 * math.sin(phase * 2) + 0.1 * math.sin(phase * 3)
                envelope = attack * release * math.exp(-t * 3.2)
            samples[first + i] += signal * envelope * gain

    def drum(start, kind):
        first = int(start * RATE)
        length = 0.22 if kind == 'kick' else 0.07
        for i in range(min(int(length * RATE), len(samples) - first)):
            t = i / RATE
            if kind == 'kick':
                value = math.sin(2 * math.pi * (48 * t + 55 * 0.018 * (1 - math.exp(-t / 0.018)))) * math.exp(-t * 22) * 0.22
            else:
                value = rng.uniform(-1, 1) * math.exp(-t * 85) * 0.026
            samples[first + i] += value

    melody_patterns = [[0, 7, 10, 7, 3, 5], [7, 3, 0, 10, 7, 5], [12, 10, 7, 3, 5, 7]]
    for bar in range(12):
        root = tonic + progression[bar % 4]
        start = bar * 4 * beat
        for degree in [0, 3, 7, 10]:
            note(start, 3.8 * beat, root + degree, 0.045, 'pad')
        for step in [0, 2]:
            note(start + step * beat, 1.7 * beat, root - 24, 0.13, 'bass')
            drum(start + step * beat, 'kick')
        for step in range(8):
            drum(start + step * beat / 2, 'hat')
        pattern = melody_patterns[(song_index + bar // 4) % 3]
        for n, degree in enumerate(pattern):
            note(start + (n * 0.5 + 0.25) * beat, beat * 1.05, root + degree + 12, 0.095, 'bell')

    # Quiet cross-fed delay, soft limiting, and full-track fade in/out.
    delay = int(beat * 0.75 * RATE)
    for i in range(len(samples) - 1, delay - 1, -1):
        samples[i] += samples[i - delay] * 0.16
    pcm = array('h')
    for i, sample in enumerate(samples):
        t = i / RATE
        fade = min(1, t / 1.2, max(0, (duration - t) / 2.5))
        pcm.append(int(math.tanh(sample * 1.6) * fade * 24000))
    with tempfile.TemporaryDirectory() as folder:
        wav = Path(folder) / 'source.wav'
        with wave.open(str(wav), 'wb') as stream:
            stream.setnchannels(1)
            stream.setsampwidth(2)
            stream.setframerate(RATE)
            stream.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '64k', '-map_metadata', '-1', str(OUT / f'{slug}.mp3')], check=True)
    print(f'{slug}: {duration:.2f}s, {(OUT / f"{slug}.mp3").stat().st_size} bytes')

# Original vector covers, generated from the same catalogue with no external assets.
COLORS = [('#813f57','#f1ad85'),('#513954','#d6a0bd'),('#263a62','#94b8ee'),('#355648','#b5d590'),('#395a6e','#91d7d0'),('#62533c','#e7c674'),('#62463d','#e7a783'),('#304b3a','#a7d684'),('#573848','#e9a0bc')]
for index, ((slug, *_), (tone, accent)) in enumerate(zip(SONGS, COLORS)):
    arcs = ''.join(f'<path d="M -40 {100 + n * 15} Q {130 + index * 12} {30 + n * 8} 460 {160 + n * 12}" fill="none" stroke="{accent}" stroke-opacity=".3" stroke-width="1"/>' for n in range(18))
    cover = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="{tone}"/><stop offset="1" stop-color="#171c2a"/></linearGradient><radialGradient id="sun"><stop stop-color="{accent}"/><stop offset="1" stop-color="{tone}"/></radialGradient></defs><rect width="400" height="400" fill="url(#g)"/><circle cx="{220 + index * 6}" cy="{150 + index * 7}" r="108" fill="url(#sun)"/>{arcs}<path d="M0 305 Q120 185 260 285 T450 245 V400 H0Z" fill="{tone}"/><path d="M0 350 Q170 235 400 330 V400 H0Z" fill="#171c2a" opacity=".6"/><text x="28" y="42" fill="{accent}" font-family="sans-serif" font-size="11" letter-spacing="4">DRIFT / ORIGINALS</text><text x="28" y="365" fill="#fff" font-family="sans-serif" font-size="20">{slug.replace('-', ' ').title()}</text></svg>'''
    (OUT / f'{slug}.svg').write_text(cover)
