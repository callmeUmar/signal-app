"""
separator_pipeline.py — submit music -> separate vocals/instrumental -> analyze
the instrumental stem only -> return data.

This extends music_analyzer.py with a real separation step using Demucs
(Meta's open-source source-separation model). It requires downloading
pretrained weights on first run, which needs a normal internet connection —
this script will NOT run inside a network-restricted sandbox, only on a
regular machine or server.

Install:
    pip install demucs librosa soundfile numpy

Usage:
    python3 separator_pipeline.py your_song.mp3
"""

import os
import shutil
import subprocess
import sys

from music_analyzer import analyze_track


def separate_track(input_path: str, output_dir: str) -> dict:
    """
    Runs Demucs to split a track into stems, returning paths to each.
    Demucs' default 4-stem model gives: vocals, drums, bass, other.
    We combine drums+bass+other into a single "instrumental" mix.
    """
    subprocess.run(
        ["python3", "-m", "demucs", "-n", "htdemucs", "-o", output_dir, input_path],
        check=True,
    )

    track_name = os.path.splitext(os.path.basename(input_path))[0]
    stem_dir = os.path.join(output_dir, "htdemucs", track_name)

    return {
        "vocals": os.path.join(stem_dir, "vocals.wav"),
        "drums": os.path.join(stem_dir, "drums.wav"),
        "bass": os.path.join(stem_dir, "bass.wav"),
        "other": os.path.join(stem_dir, "other.wav"),
    }


def combine_instrumental_stems(stems: dict, output_path: str):
    """Mixes drums + bass + other into a single instrumental-only file."""
    import librosa
    import numpy as np
    import soundfile as sf

    combined = None
    sr = None
    for key in ("drums", "bass", "other"):
        y, sr = librosa.load(stems[key], sr=None, mono=True)
        combined = y if combined is None else combined[: len(y)] + y[: len(combined)]

    sf.write(output_path, combined, sr)


def analyze_instrumental(input_path: str, output_dir: str | None = None) -> dict:
    """
    Full pipeline: separate -> combine instrumental stems -> analyze that
    instrumental-only mix -> return the same feature set as analyze_track,
    but now grounded in the instrumental alone (no vocal interference on
    tempo/key/melody detection).

    If output_dir is given, vocals.wav and instrumental.wav are saved there
    permanently. Otherwise a temp directory is used and cleaned up on return.
    """
    import tempfile

    track_name = os.path.splitext(os.path.basename(input_path))[0]
    tmp_ctx = None

    if output_dir:
        save_dir = os.path.join(output_dir, track_name)
        os.makedirs(save_dir, exist_ok=True)
        work_dir = save_dir
    else:
        tmp_ctx = tempfile.TemporaryDirectory()
        work_dir = tmp_ctx.name

    try:
        stems = separate_track(input_path, work_dir)

        instrumental_path = os.path.join(work_dir, "instrumental.wav")
        combine_instrumental_stems(stems, instrumental_path)

        # Copy vocals stem into the save dir with a clean name
        vocals_path = os.path.join(work_dir, "vocals.wav")
        if stems["vocals"] != vocals_path:
            shutil.copy2(stems["vocals"], vocals_path)

        result = analyze_track(instrumental_path)
        result["source"] = "instrumental_only"
        result["vocals_path"] = vocals_path
        result["instrumental_path"] = instrumental_path

        from database import save_track_features
        save_track_features(os.path.basename(input_path), result)

        return result
    finally:
        if tmp_ctx:
            tmp_ctx.cleanup()


if __name__ == "__main__":
    import json
    path = sys.argv[1] if len(sys.argv) > 1 else "your_song.mp3"
    print(json.dumps(analyze_instrumental(path), indent=2))
