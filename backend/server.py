import os
from flask import Flask, jsonify, send_from_directory
from pathlib import Path
from passages import PASSAGES

app = Flask(__name__)

# Fallback: index.html
@app.route("/")
@app.route("/<path:path>")
def svelte(path=None):
    return send_from_directory('../client/public', 'index.html')


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/svelte/<path:path>")
def get_from_svelte_dirs(path):
    return send_from_directory('../client/public', path)


@app.route("/api/passage-list")
def api_get_passage_list():
    passages_list = PASSAGES.get_passages_list()
    return jsonify([
        {
            'id': passage.id,
            'title': passage.title,
            'uri': passage.uri,
            'folder': (passage.folder.name),
        }
        for passage in passages_list
    ])


@app.route("/api/get-passage/<path:id>")
def api_get_passage(id):
    passage = PASSAGES.get_passage_by_id(id)

    return jsonify({
        'id': passage.id,
        'title': passage.title,
        'folder': passage.folder.name,
        'pairs': passage.sentence_pairs,
    })


@app.route("/api/audio/<passage_id>/<path:audio_path>")
def api_get_audio(passage_id, audio_path):
    passage = PASSAGES.get_passage_by_id(passage_id)
    passage_folder = str(passage.folder)
    return send_from_directory(passage_folder, audio_path)


if __name__ == "__main__":
    app.run(threaded=True, port=5000)
