"""
generator.py — generate audio from track features via Meta's MusicGen on Replicate.

Calls a hosted third-party model (meta/musicgen on replicate.com). Requires:
  - An active Replicate account and API key
  - The environment variable REPLICATE_API_TOKEN set before running
  - An internet connection during generation

Install: pip install replicate
"""

import argparse
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

MUSICGEN_MODEL = "meta/musicgen"
OUTPUT_DIR = Path(__file__).parent / "output"


# ── Feature → natural language ────────────────────────────────────────────────

def _tempo_label(bpm: float) -> str:
    if bpm < 70:  return f"very slow at {bpm:.0f} BPM"
    if bpm < 100: return f"slow at {bpm:.0f} BPM"
    if bpm < 130: return f"moderate tempo at {bpm:.0f} BPM"
    if bpm < 160: return f"upbeat at {bpm:.0f} BPM"
    return f"fast at {bpm:.0f} BPM"


def _energy_label(pct: float) -> str:
    if pct < 25: return "very low energy, calm and subdued"
    if pct < 50: return "moderate energy"
    if pct < 75: return "high energy, driving"
    return "very high energy, intense"


def _brightness_label(pct: float) -> str:
    if pct < 25: return "dark, muted tone"
    if pct < 50: return "warm tone"
    if pct < 75: return "bright tone"
    return "very bright, airy and open sound"


def _density_label(pct: float) -> str:
    if pct < 25: return "sparse, minimal arrangement"
    if pct < 50: return "moderately arranged"
    if pct < 75: return "dense, layered arrangement"
    return "very dense, full arrangement with many layers"


def _electronic_label(pct: float) -> str:
    if pct < 25: return "acoustic"
    if pct < 50: return "mostly acoustic with some electronic elements"
    if pct < 75: return "electronic"
    return "fully electronic and synthetic"


# ── Blending ─────────────────────────────────────────────────────────────────

def _blend_features(refs: list[dict]) -> dict:
    """
    Weighted average of numeric fields across multiple reference tracks.
    The key is taken from the highest-weighted reference.
    """
    numeric = ["tempo_bpm", "energy_pct", "brightness_pct", "density_pct", "electronic_pct"]
    total_weight = sum(r["weight"] for r in refs)
    blended: dict = {}
    for field in numeric:
        blended[field] = sum(
            r["features"].get(field, 0) * r["weight"] for r in refs
        ) / total_weight
    top = max(refs, key=lambda r: r["weight"])
    blended["key"] = top["features"].get("key")
    return blended


# ── Prompt builder ────────────────────────────────────────────────────────────

def build_prompt(features: dict, direction: str | None = None) -> str:
    """
    Convert a feature dict into a MusicGen text prompt.
    Appends the user's freeform direction at the end if provided.
    """
    parts = []

    if features.get("key"):
        parts.append(f"in {features['key']}")
    if features.get("tempo_bpm") is not None:
        parts.append(_tempo_label(float(features["tempo_bpm"])))
    if features.get("energy_pct") is not None:
        parts.append(_energy_label(float(features["energy_pct"])))
    if features.get("brightness_pct") is not None:
        parts.append(_brightness_label(float(features["brightness_pct"])))
    if features.get("density_pct") is not None:
        parts.append(_density_label(float(features["density_pct"])))
    if features.get("electronic_pct") is not None:
        parts.append(_electronic_label(float(features["electronic_pct"])))

    prompt = ", ".join(parts)
    if direction:
        prompt += f". {direction.strip()}"
    return prompt


# ── Core generation ───────────────────────────────────────────────────────────

def generate(
    features: dict,
    direction: str | None = None,
    refs: list[dict] | None = None,
    duration: int = 8,
) -> Path:
    """
    Generate audio from extracted features and save it to output/.

    Args:
        features:  Feature dict from music_analyzer / separator_pipeline.
                   Ignored when ``refs`` is provided.
        direction: Optional freeform user guidance appended to the prompt.
        refs:      Optional list of {"features": dict, "weight": float} for
                   blending multiple reference tracks by weighted average.
        duration:  Output length in seconds (default 8).

    Returns:
        Path to the saved .wav file.
    """
    token = os.environ.get("REPLICATE_API_TOKEN")
    if not token:
        sys.exit(
            "Error: REPLICATE_API_TOKEN is not set.\n"
            "Get your key at https://replicate.com/account/api-tokens and run:\n"
            "  export REPLICATE_API_TOKEN=r8_..."
        )

    import replicate  # not stdlib — guarded so import errors surface clearly

    effective = _blend_features(refs) if refs else features
    prompt = build_prompt(effective, direction)

    print("── Prompt sent to MusicGen " + "─" * 46)
    print(prompt)
    print("─" * 72 + "\n")

    output = replicate.run(
        MUSICGEN_MODEL,
        input={"prompt": prompt, "duration": duration},
    )

    # Replicate may return a URL string, a FileOutput object, or a list of either
    if isinstance(output, list):
        output = output[0]

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_path = OUTPUT_DIR / f"generated_{timestamp}.wav"

    if hasattr(output, "read"):
        out_path.write_bytes(output.read())
    else:
        urllib.request.urlretrieve(str(output), out_path)

    print(f"Saved → {out_path}")
    return out_path


# ── CLI ───────────────────────────────────────────────────────────────────────

def _cli() -> None:
    parser = argparse.ArgumentParser(
        description="Generate audio from a track stored in tracks.db.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            '  python3 generator.py --track "my_song.mp3"\n'
            '  python3 generator.py --track "my_song.mp3" '
            '--direction "moody, for a rainy scene" --duration 15'
        ),
    )
    parser.add_argument("--track",     required=True, help="Filename as stored in tracks.db")
    parser.add_argument("--direction", default=None,  help='Freeform guidance, e.g. "moody, rainy scene"')
    parser.add_argument("--duration",  type=int, default=8, help="Output duration in seconds (default: 8)")
    args = parser.parse_args()

    from database import get_track_by_filename
    rows = get_track_by_filename(args.track)
    if not rows:
        sys.exit(f"Error: '{args.track}' not found in tracks.db. Run the analyzer first.")

    # Most recent analysis wins if the same file was analyzed multiple times
    features = rows[0]
    print(f"Using features for '{args.track}' (analyzed at {features['analyzed_at']})")

    generate(features, direction=args.direction, duration=args.duration)


if __name__ == "__main__":
    _cli()
