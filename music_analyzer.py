"""
music_analyzer.py — extract audio features from a track using librosa.

Returns a dict whose keys match database.py's schema exactly:
    duration_sec, tempo_bpm, key, key_confidence,
    energy_pct, brightness_pct, density_pct, electronic_pct, melody_sample.

Requires: pip install librosa numpy soundfile
"""

import numpy as np
import librosa

# Krumhansl-Schmuckler key profiles
_MAJOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
_MINOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
_PITCH_CLASSES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Vocal range boundaries for melody extraction (C3–C6)
_C3_HZ = librosa.note_to_hz("C3")   # ≈ 130.81 Hz
_C6_HZ = librosa.note_to_hz("C6")   # ≈ 1046.50 Hz

# pyin hop length used consistently for times_like alignment
_PYIN_HOP = 512


def _detect_key(y: np.ndarray, sr: int) -> tuple[str, float]:
    """
    Krumhansl-Schmuckler key detection via chroma_cqt profile correlation.

    Returns (key_string, confidence) where confidence is the normalised
    score margin between the best and second-best key (0 = ambiguous, 1 = clear).
    A margin of ~0.30 is empirically a strongly unambiguous key match.
    """
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr).mean(axis=1)

    scores: list[tuple[float, int, str]] = []
    for i in range(12):
        rotated = np.roll(chroma, -i)
        scores.append((float(np.corrcoef(rotated, _MAJOR)[0, 1]), i, "major"))
        scores.append((float(np.corrcoef(rotated, _MINOR)[0, 1]), i, "minor"))

    scores.sort(reverse=True)
    best_score, best_root, best_mode = scores[0]
    second_score = scores[1][0]

    key_str = f"{_PITCH_CLASSES[best_root]} {best_mode}"
    confidence = float(np.clip((best_score - second_score) / 0.30, 0.0, 1.0))
    return key_str, confidence


def _extract_melody_sample(
    y_window: np.ndarray, sr: int, offset_sec: float
) -> list[dict]:
    """
    Extract pitched notes from a ~20-second harmonic window via HPSS + pyin.

    Steps:
      1. HPSS isolates the harmonic component (removes drums/noise).
      2. pyin tracks pitch within the vocal range (C3–C6) only.
      3. Voiced frames are sampled every ~0.2 s and converted to note names.

    Returns a list of {"time_sec": float, "note": str} dicts.
    """
    y_harmonic, _ = librosa.effects.hpss(y_window)

    f0, voiced_flag, _ = librosa.pyin(
        y_harmonic,
        fmin=_C3_HZ,
        fmax=_C6_HZ,
        sr=sr,
        hop_length=_PYIN_HOP,
    )

    times = librosa.times_like(f0, sr=sr, hop_length=_PYIN_HOP)

    # One output point per ~0.2 seconds
    stride = max(1, round(0.2 * sr / _PYIN_HOP))

    melody = []
    for i in range(0, len(f0), stride):
        if voiced_flag[i] and not np.isnan(f0[i]) and f0[i] > 0:
            melody.append({
                "time_sec": round(float(times[i]) + offset_sec, 3),
                "note": librosa.hz_to_note(f0[i]),
            })

    return melody


def analyze_track(path: str) -> dict:
    """
    Analyze an audio file and return a feature dict matching database.py's schema.

    Only the first 120 seconds are loaded for performance. Melody extraction
    runs on a single 20-second harmonic window to avoid slow full-track pyin.

    Calibration notes (tested against typical mastered tracks):
      energy_pct    — RMS range [0.02, 0.40]; quiet acoustic ≈ 10–25%,
                       loud pop ≈ 50–80%.
      brightness_pct — centroid range [500, 4000] Hz; bass-heavy ≈ 10–30%,
                       bright synth ≈ 60–90%.
      density_pct   — onset rate range [0.5, 4.0] onsets/sec; ambient ≈ 5–20%,
                       dense EDM ≈ 70–95%.
      electronic_pct — log-mapped flatness [0.001, 0.15]; acoustic ≈ 0–20%,
                       synth-heavy ≈ 50–90%.
    """
    y, sr = librosa.load(path, sr=None, mono=True, duration=120)
    duration_sec = float(librosa.get_duration(y=y, sr=sr))

    # ── Tempo ─────────────────────────────────────────────────────────────────
    tempo_arr, _ = librosa.beat.beat_track(y=y, sr=sr)
    tempo_bpm = float(np.atleast_1d(tempo_arr)[0])

    # ── Key ───────────────────────────────────────────────────────────────────
    key, key_confidence = _detect_key(y, sr)

    # ── Energy — RMS, calibrated for mastered audio (0.02–0.40) ───────────────
    rms_mean = float(librosa.feature.rms(y=y)[0].mean())
    energy_pct = float(np.clip((rms_mean - 0.02) / (0.40 - 0.02) * 100, 0.0, 100.0))

    # ── Brightness — spectral centroid, normalised to 500–4000 Hz ─────────────
    centroid_mean = float(librosa.feature.spectral_centroid(y=y, sr=sr)[0].mean())
    brightness_pct = float(np.clip((centroid_mean - 500) / (4000 - 500) * 100, 0.0, 100.0))

    # ── Density — onset rate, normalised to 0.5–4.0 onsets/sec ───────────────
    n_onsets = len(librosa.onset.onset_detect(y=y, sr=sr))
    onset_rate = n_onsets / max(duration_sec, 1.0)
    density_pct = float(np.clip((onset_rate - 0.5) / (4.0 - 0.5) * 100, 0.0, 100.0))

    # ── Electronic — log-mapped spectral flatness ([0.001, 0.15] → 0–100) ─────
    # Log scale gives better separation: acoustic ≈ 0.001–0.005, electronic ≈ 0.01–0.10
    flatness_mean = float(librosa.feature.spectral_flatness(y=y)[0].mean())
    flatness_mean = max(flatness_mean, 1e-9)
    _log_min = np.log10(0.001)
    _log_max = np.log10(0.15)
    electronic_pct = float(
        np.clip((np.log10(flatness_mean) - _log_min) / (_log_max - _log_min) * 100, 0.0, 100.0)
    )

    # ── Melody sample — HPSS + pyin on a 20-second window ────────────────────
    # Start 10% in (up to 10 s) to skip silent intros
    window_start = min(duration_sec * 0.10, 10.0)
    window_end = min(window_start + 20.0, duration_sec)
    y_window = y[int(window_start * sr): int(window_end * sr)]
    melody_sample = _extract_melody_sample(y_window, sr, offset_sec=window_start)

    return {
        "duration_sec":   round(duration_sec, 2),
        "tempo_bpm":      round(tempo_bpm, 1),
        "key":            key,
        "key_confidence": round(key_confidence, 3),
        "energy_pct":     round(energy_pct, 1),
        "brightness_pct": round(brightness_pct, 1),
        "density_pct":    round(density_pct, 1),
        "electronic_pct": round(electronic_pct, 1),
        "melody_sample":  melody_sample,
    }
