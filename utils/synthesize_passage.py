import argparse
import json
import os
from synthesize import synthesize
from pathlib import Path

FOLDER_ID = os.environ['YSK_FOLDER_ID']
IAM_TOKEN = os.environ['YSK_IAM_TOKEN']


def synthesize_passage(json_file):
    """Argument:
    json_file: file containing pairs of sentences
    """
    json_file = Path(json_file)
    pairs = json.load(json_file.open(encoding='utf-8'))
    for i, pair in enumerate(pairs):
        sent_ru = pair['ru']['sentence']
        audio_folder_name = json_file.name+'.audio'
        audio_folder = json_file.parent / audio_folder_name
        audio_folder.mkdir(exist_ok=True)
        output_file = audio_folder / (str(i) + '.ogg')

        if not output_file.exists():
            with open(output_file, "wb") as f:
                print(f'{i}/{len(pairs)}: {sent_ru}')
                for audio_content in synthesize(FOLDER_ID, IAM_TOKEN, sent_ru):
                    f.write(audio_content)
        pair['ru']['audio'] = output_file.relative_to(json_file.parent).__str__()

    json.dump(pairs, open(json_file, 'w', encoding='utf-8'), indent=True, ensure_ascii=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("json_file", help="json file of sentences")
    args = parser.parse_args()

    synthesize_passage(args.json_file)

