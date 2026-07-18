"""
server.py — dev server for Signal.
Serves pages/ as static HTML, exposes /analyze for audio uploads,
and serves saved stems from stems/ at /stems/<track>/<file>.

Install: pip install flask flask-cors librosa numpy soundfile demucs
Run:     python3 server.py
Then open: http://localhost:5000
"""

import os
import tempfile
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BASE_DIR   = os.path.dirname(__file__)
PAGES_DIR  = os.path.join(BASE_DIR, "pages")
STEMS_DIR  = os.path.join(BASE_DIR, "stems")

os.makedirs(STEMS_DIR, exist_ok=True)

app = Flask(__name__, static_folder=PAGES_DIR, static_url_path="")
CORS(app)


@app.route("/")
def index():
    return send_from_directory(PAGES_DIR, "landing.html")


@app.route("/stems/<path:filename>")
def serve_stem(filename):
    return send_from_directory(STEMS_DIR, filename)


@app.route("/<path:filename>")
def pages(filename):
    return send_from_directory(PAGES_DIR, filename)


@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "no file attached"}), 400

    f = request.files["file"]
    original_name = f.filename or "upload"
    track_name = os.path.splitext(os.path.basename(original_name))[0]

    # Save with the original name so separator_pipeline uses it as the stem folder name
    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, original_name)
    f.save(tmp_path)

    try:
        try:
            from separator_pipeline import analyze_instrumental
            result = analyze_instrumental(tmp_path, output_dir=STEMS_DIR)
            result["vocals_url"]       = f"/stems/{track_name}/vocals.wav"
            result["instrumental_url"] = f"/stems/{track_name}/instrumental.wav"
            result.pop("vocals_path", None)
            result.pop("instrumental_path", None)
        except Exception:
            from music_analyzer import analyze_track
            result = analyze_track(tmp_path)
            result["source"] = "direct"
    finally:
        import shutil
        shutil.rmtree(tmp_dir, ignore_errors=True)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
