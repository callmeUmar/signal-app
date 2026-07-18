"""
melody_generate.py — melody-conditioned audio generation via MusicGen on Replicate.

IMPORTANT NOTES:
  - MusicGen's melody model variant caps output at 30 seconds. Requests for
    longer durations are reduced automatically — a warning is printed when
    this happens.
  - ``quantity`` means EACH variation is a separate Replicate API call.
    quantity=10 costs approximately 10× a single generation in compute credits.
  - ``speed`` is applied as post-processing time-stretch (librosa) that
    preserves pitch. speed=2.0 halves the duration; speed=0.5 doubles it.
  - Requires REPLICATE_API_TOKEN as an environment variable.
  - Requires an internet connection and a Replicate account.

DATABASE NOTE:
  database.py's get_track_by_filename() already returns melody_sample as a
  deserialized list[dict] — it is stored as JSON TEXT and _row_to_dict()
  calls json.loads() on retrieval. No changes to database.py are needed.

Install: pip install replicate librosa soundfile numpy
"""

import os
import random
import sys
import tempfile
import urllib.request
from pathlib import Path

import numpy as np

MUSICGEN_MODEL = "meta/musicgen"
MELODY_MODEL_MAX_DURATION = 30   # seconds — hard cap on the melody model variant
OUTPUT_DIR = Path(__file__).parent / "output"

_SR = 44100          # synthesis sample rate
_AMPLITUDE = 0.5     # per-note amplitude; leaves headroom for envelope overlap
_ATTACK_SEC = 0.010  # 10 ms linear attack
_RELEASE_SEC = 0.030 # 30 ms linear release

# ── Note → frequency ──────────────────────────────────────────────────────────

_NOTE_SEMITONES: dict[str, int] = {
    "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
    "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8,
    "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11,
}


def _note_to_hz(note_str: str) -> float:
    """
    Convert a note name such as 'D#4' or 'C3' to Hz using A4=440 equal temperament.
    Supports both sharps (C#) and flats (Db).
    """
    if len(note_str) >= 3 and note_str[1] in ("#", "b"):
        pitch, octave = note_str[:2], int(note_str[2:])
    else:
        pitch, octave = note_str[0], int(note_str[1:])
    midi = 12 * (octave + 1) + _NOTE_SEMITONES[pitch]  # C-1=0, C4=60, A4=69
    return 440.0 * 2.0 ** ((midi - 69) / 12.0)


# ── Melody synthesis ──────────────────────────────────────────────────────────

def synthesize_melody_audio(melody_sample: list[dict], output_path: str) -> None:
    """
    Render a melody_sample to a .wav file using numpy + soundfile only.

    Each {"time_sec", "note"} entry becomes a triangle-wave tone at the
    correct equal-temperament frequency. Note duration equals the gap to the
    next note (capped at 1.0 s); the final note uses the median inter-note gap.
    A 10 ms attack and 30 ms release envelope on every tone prevents clicks.
    The buffer is normalized to ±0.95 if overlapping envelopes cause clipping.
    """
    import soundfile as sf

    if not melody_sample:
        sf.write(output_path, np.zeros(_SR, dtype=np.float32), _SR)
        return

    times = [float(n["time_sec"]) for n in melody_sample]
    inter_durs = [min(times[i + 1] - times[i], 1.0) for i in range(len(times) - 1)]
    last_dur = float(np.median(inter_durs)) if inter_durs else 0.4
    note_durs = inter_durs + [last_dur]

    total_samples = int(np.ceil((times[-1] + note_durs[-1] + _RELEASE_SEC) * _SR))
    buffer = np.zeros(total_samples, dtype=np.float32)

    for note_info, dur in zip(melody_sample, note_durs):
        try:
            freq = _note_to_hz(note_info["note"])
        except (KeyError, ValueError):
            continue

        n = int(dur * _SR)
        if n < 2:
            continue

        t = np.arange(n, dtype=np.float64) / _SR
        # Triangle wave: y ∈ [-1, 1], richer than sine, no scipy needed
        wave = (2.0 * np.abs(2.0 * ((t * freq) % 1.0) - 1.0) - 1.0).astype(np.float32)

        env = np.ones(n, dtype=np.float32)
        atk = min(int(_ATTACK_SEC * _SR), n)
        rel = min(int(_RELEASE_SEC * _SR), n - atk)
        env[:atk] = np.linspace(0.0, 1.0, atk)
        if rel > 0:
            env[-rel:] = np.linspace(1.0, 0.0, rel)

        start = int(note_info["time_sec"] * _SR)
        end = min(start + n, total_samples)
        span = end - start
        buffer[start:end] += wave[:span] * env[:span] * _AMPLITUDE

    peak = float(np.abs(buffer).max())
    if peak > 0.95:
        buffer *= 0.95 / peak

    sf.write(output_path, buffer, _SR)


# ── Replicate helpers ─────────────────────────────────────────────────────────

def _save_replicate_output(output, dest: Path) -> None:
    """Write whatever Replicate returns (URL string, FileOutput, or list) to dest."""
    if isinstance(output, list):
        output = output[0]
    if hasattr(output, "read"):
        dest.write_bytes(output.read())
    else:
        urllib.request.urlretrieve(str(output), dest)


# ── Core generation ───────────────────────────────────────────────────────────

def generate_variations(
    features: dict,
    melody_sample: list[dict],
    direction: str | None = None,
    duration_sec: float = 8.0,
    speed: float = 1.0,
    quantity: int = 1,
) -> list[Path]:
    """
    Generate melody-conditioned variations and save them to output/.

    COST WARNING: each of the ``quantity`` iterations is a separate Replicate
    API call. quantity=10 costs approximately 10× a single generation.

    DURATION CAP: MusicGen's melody model variant accepts at most 30 seconds.
    If duration_sec > 30, it is reduced and a warning is printed.

    SPEED: applied as librosa.effects.time_stretch(rate=speed) after download,
    which changes duration while preserving pitch. speed=2.0 doubles playback
    speed (halves file duration); speed=0.5 halves playback speed.

    Args:
        features:      Feature dict from music_analyzer / database query.
        melody_sample: Pitch sequence from the same analysis, used as the
                       melody conditioning audio sent to the API.
        direction:     Optional freeform guidance appended to the text prompt.
        duration_sec:  Requested output length (capped at 30 s by the model).
        speed:         Post-generation playback speed factor (default 1.0).
        quantity:      Variations to generate, clamped to 1–10.

    Returns:
        List of Paths — output/variation_1.wav … output/variation_N.wav.
        Re-running overwrites previous variations with the same indices.
    """
    token = os.environ.get("REPLICATE_API_TOKEN")
    if not token:
        sys.exit(
            "Error: REPLICATE_API_TOKEN is not set.\n"
            "Get your key at https://replicate.com/account/api-tokens and run:\n"
            "  export REPLICATE_API_TOKEN=r8_..."
        )

    import librosa
    import replicate
    import soundfile as sf

    quantity = max(1, min(quantity, 10))
    effective_duration = int(min(duration_sec, MELODY_MODEL_MAX_DURATION))
    if duration_sec > MELODY_MODEL_MAX_DURATION:
        print(
            f"Warning: MusicGen melody model caps duration at {MELODY_MODEL_MAX_DURATION}s. "
            f"Requested {duration_sec:.1f}s → reduced to {MELODY_MODEL_MAX_DURATION}s."
        )

    from generator import build_prompt
    prompt = build_prompt(features, direction)

    print("── Prompt sent to MusicGen (melody) " + "─" * 36)
    print(prompt)
    print("─" * 72 + "\n")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    melody_wav = str(OUTPUT_DIR / "melody_conditioning.wav")
    synthesize_melody_audio(melody_sample, melody_wav)
    print(f"Melody conditioning audio → {melody_wav}\n")

    saved: list[Path] = []

    for i in range(quantity):
        seed = random.randint(0, 2**31 - 1)
        print(f"Generating variation {i + 1}/{quantity} (seed={seed})…")

        with open(melody_wav, "rb") as audio_file:
            output = replicate.run(
                MUSICGEN_MODEL,
                input={
                    "prompt": prompt,
                    "model_version": "melody",
                    "input_audio": audio_file,
                    "duration": effective_duration,
                    "seed": seed,
                },
            )

        out_path = OUTPUT_DIR / f"variation_{i + 1}.wav"
        tmp_path: Path | None = None

        try:
            if abs(speed - 1.0) > 1e-6:
                # Download to a temp file, time-stretch, then write final output
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                    tmp_path = Path(tmp.name)
                _save_replicate_output(output, tmp_path)

                y, sr = librosa.load(str(tmp_path), sr=None, mono=False)
                if y.ndim == 1:
                    y = librosa.effects.time_stretch(y, rate=speed)
                else:
                    # time_stretch expects 1-D; process each channel separately
                    y = np.stack([librosa.effects.time_stretch(ch, rate=speed) for ch in y])
                sf.write(str(out_path), y.T if y.ndim == 2 else y, sr)
            else:
                _save_replicate_output(output, out_path)
        finally:
            if tmp_path and tmp_path.exists():
                tmp_path.unlink()

        print(f"  Saved → {out_path}")
        saved.append(out_path)

    return saved


# ── CLI ───────────────────────────────────────────────────────────────────────

def _cli() -> None:
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate melody-conditioned variations from a track in tracks.db.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Notes:\n"
            "  - Each variation is a separate Replicate API call (quantity=5 → 5 calls).\n"
            "  - Duration is capped at 30 s by the MusicGen melody model.\n"
            "  - speed=2.0 halves the output file duration while preserving pitch.\n\n"
            "Examples:\n"
            '  python3 melody_generate.py --track "my_song.mp3"\n'
            '  python3 melody_generate.py --track "my_song.mp3" '
            "--duration 20 --speed 1.5 --quantity 3 --direction \"darker, cinematic\""
        ),
    )
    parser.add_argument("--track",     required=True,        help="Filename as stored in tracks.db")
    parser.add_argument("--direction", default=None,         help='Freeform style guidance, e.g. "make it darker"')
    parser.add_argument("--duration",  type=float, default=8.0,  help="Output duration in seconds, max 30 (default 8)")
    parser.add_argument("--speed",     type=float, default=1.0,  help="Post-generation speed factor (default 1.0 = unchanged)")
    parser.add_argument("--quantity",  type=int,   default=1,    help="Variations to generate, 1–10 (each is a paid API call)")
    args = parser.parse_args()

    from database import get_track_by_filename
    rows = get_track_by_filename(args.track)
    if not rows:
        sys.exit(f"Error: '{args.track}' not found in tracks.db. Run the analyzer first.")

    row = rows[0]
    melody_sample = row.get("melody_sample") or []

    if not melody_sample:
        print(
            "Warning: no melody_sample stored for this track. "
            "The conditioning audio will be silence — output may be less targeted."
        )

    print(f"Using features for '{args.track}' (analyzed at {row['analyzed_at']})")
    print(f"Melody: {len(melody_sample)} note(s) found in DB\n")

    generate_variations(
        features=row,
        melody_sample=melody_sample,
        direction=args.direction,
        duration_sec=args.duration,
        speed=args.speed,
        quantity=args.quantity,
    )


if __name__ == "__main__":
    _cli()
