import os
import json
from pathlib import Path
from typing import List




class Passage:
    def __init__(self, passage_folder, passage_file) -> None:
        passage_file = Path(passage_file)
        passage_folder = Path(passage_folder)
        
        self.title = passage_file.name.replace('.translated.json', '')
        self.folder = passage_folder
        self.id = open(passage_folder / (passage_file.name + '.id')).read().strip()
        self.passage_file = passage_file

    @property
    def uri(self):
        return str(self.passage_file.relative_to(self.folder))

    @property
    def sentence_pairs(self):
        sentence_pairs = json.load(
            self.passage_file.open(encoding='utf-8')
        )
        return sentence_pairs


class Passages:
    def __init__(self, texts_root) -> None:
        self.texts_root = Path(texts_root)
        self._passages = self._retrieve_passage_list()

    def get_passages_list(self):
        return self._passages

    def _retrieve_passage_list(self) -> List[Passage]:
        root = self.texts_root
        passages = []

        for folder in root.iterdir():
            if folder.is_dir():
                for passage_file in folder.glob('*.translated.json'):
                    passage = Passage(folder, passage_file)
                    passages.append(passage)
        return passages

    def get_passage_by_id(self, id_):
        for passage in self._passages:
            if passage.id == id_:
                return passage
        raise StopIteration(f'Passage with id={id_} not found!')


# TEXTS_ROOT = r"C:\Users\sobir\PycharmProjects\speak-russian\texts"
TEXTS_ROOT = os.getenv('TEXTS_ROOT', r"texts")
PASSAGES = Passages(TEXTS_ROOT)
