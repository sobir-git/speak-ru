import os
from pathlib import Path

from flask import Flask, json, jsonify, send_from_directory

from passages import PASSAGES

app = Flask(__name__)


@app.route("/")
@app.route("/<path:path>")
def svelte(path=None):
    return send_from_directory('client/public', 'index.html')


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/svelte/<path:path>")
def svelte_dirs(path):
    return send_from_directory('client/public', path)


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/api/passage-list")
def passage_list():
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


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/api/get-passage/<path:id>")
def get_passage(id):
    passage = PASSAGES.get_passage_by_id(id)

    return jsonify({
        'id': passage.id,
        'title': passage.title,
        'pairs': passage.sentence_pairs,
    })


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/api/audio/<passage_id>/<path:audio_path>")
def api_get_audio(passage_id, audio_path):
    passage = PASSAGES.get_passage_by_id(passage_id)
    return send_from_directory(passage.folder, audio_path)


if __name__ == "__main__":
    app.run(threaded=True, port=5000)
