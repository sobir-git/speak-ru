from pathlib import Path
from flask import Flask, json, send_from_directory, jsonify
import random

app = Flask(__name__)
# Path for our main Svelte page

# TEXTS_ROOT = r"C:\Users\sobir\PycharmProjects\speak-russian\texts"
TEXTS_ROOT = r"texts"

def get_passages():
    passage_folder = Path(TEXTS_ROOT)
    passages = []
    id = 0

    for folder in passage_folder.iterdir():
        if folder.is_dir():
            for passage_file in folder.glob('*.translated.json'):
                title = passage_file.name.replace('.translated.json', '')
                passages.append({
                    'title': title, 
                    'folder': folder.name,
                    'id': str(id),
                    'uri': str(passage_file.relative_to(passage_folder))
                    })
                id += 1
    return passages

PASSAGES = get_passages()

def get_passage_by_id(id):
    for passage in PASSAGES:
        if passage['id'] == id:
            return passage
    raise StopIteration(f'Passage with id={id} not found!')


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
    passages = PASSAGES
    return jsonify(passages)


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/api/get-passage/<path:id>")
def get_passage(id):
    passage = get_passage_by_id(id)
    passage_file = Path(TEXTS_ROOT) / passage['uri']
    sentence_pairs = json.load(passage_file.open(encoding='utf-8'), encoding='utf-8')
    return jsonify({
        'id': id,
        'title': passage['title'],
        'pairs': sentence_pairs,
    })


# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/api/audio/<passage_id>/<path:audio_path>")
def api_get_audio(passage_id, audio_path):
    passage = get_passage_by_id(passage_id)
    passage_full_path = (Path(TEXTS_ROOT) / passage['uri'])
    return send_from_directory(passage_full_path.parent.as_posix(), audio_path)



if __name__ == "__main__":
    app.run(threaded=True, port=5000, debug=True)
