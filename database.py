"""
database.py — SQLite persistence for track analysis results.

Schema mirrors the dict returned by music_analyzer.analyze_track() and
separator_pipeline.analyze_instrumental():
    duration_sec, tempo_bpm, key, key_confidence, energy_pct,
    brightness_pct, density_pct, electronic_pct,
    melody_sample (JSON), source

Usage:
    python3 database.py          # print a table of all stored tracks
"""

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent / "tracks.db"

_CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS tracks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    filename        TEXT    NOT NULL,
    analyzed_at     TEXT    NOT NULL,
    duration_sec    REAL,
    tempo_bpm       REAL,
    key             TEXT,
    key_confidence  REAL,
    energy_pct      REAL,
    brightness_pct  REAL,
    density_pct     REAL,
    electronic_pct  REAL,
    melody_sample   TEXT,
    source          TEXT
);
"""


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn


def _init_db(conn: sqlite3.Connection) -> None:
    conn.execute(_CREATE_TABLE)
    conn.commit()


def save_track_features(filename: str, data: dict) -> int:
    """
    Insert one row into the tracks table.

    ``data`` is the dict returned by analyze_track() / analyze_instrumental().
    Unknown keys in ``data`` are silently ignored.
    Returns the new row's id.
    """
    melody = data.get("melody_sample")
    row = (
        filename,
        datetime.now(timezone.utc).isoformat(),
        data.get("duration_sec"),
        data.get("tempo_bpm"),
        data.get("key"),
        data.get("key_confidence"),
        data.get("energy_pct"),
        data.get("brightness_pct"),
        data.get("density_pct"),
        data.get("electronic_pct"),
        json.dumps(melody) if melody is not None else None,
        data.get("source"),
    )
    with _connect() as conn:
        _init_db(conn)
        cur = conn.execute(
            """
            INSERT INTO tracks (
                filename, analyzed_at,
                duration_sec, tempo_bpm, key, key_confidence,
                energy_pct, brightness_pct, density_pct, electronic_pct,
                melody_sample, source
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            row,
        )
        return cur.lastrowid


def get_all_tracks() -> list[dict]:
    """Return every row in tracks as a list of plain dicts."""
    with _connect() as conn:
        _init_db(conn)
        rows = conn.execute(
            "SELECT * FROM tracks ORDER BY analyzed_at DESC"
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def get_track_by_filename(filename: str) -> list[dict]:
    """Return all rows whose filename matches (may be more than one)."""
    with _connect() as conn:
        _init_db(conn)
        rows = conn.execute(
            "SELECT * FROM tracks WHERE filename = ? ORDER BY analyzed_at DESC",
            (filename,),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def _row_to_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    if d.get("melody_sample"):
        d["melody_sample"] = json.loads(d["melody_sample"])
    return d


# ── CLI ──────────────────────────────────────────────────────────────────────

def _print_table(tracks: list[dict]) -> None:
    if not tracks:
        print("No tracks in database yet.")
        return

    cols = ["id", "filename", "analyzed_at", "tempo_bpm", "key", "energy_pct"]
    widths = {c: max(len(c), *(len(str(t.get(c) or "")) for t in tracks)) for c in cols}

    sep = "+-" + "-+-".join("-" * widths[c] for c in cols) + "-+"
    header = "| " + " | ".join(c.ljust(widths[c]) for c in cols) + " |"

    print(sep)
    print(header)
    print(sep)
    for t in tracks:
        row = "| " + " | ".join(str(t.get(c) or "").ljust(widths[c]) for c in cols) + " |"
        print(row)
    print(sep)
    print(f"{len(tracks)} track(s) stored in {DB_PATH}")


if __name__ == "__main__":
    _print_table(get_all_tracks())
