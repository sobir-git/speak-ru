import itertools
import json
import re
import time
import unicodedata

import clipboard
import spacy
from selenium.common.exceptions import TimeoutException
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from seleniumwire import webdriver

from morph import morph_dict


class DeepLSelenium:
    def __init__(self, driver_path=None, target_lang='ru'):
        self.driver = webdriver.Chrome(driver_path)
        self.driver.get(f'https://www.deepl.com/{target_lang}/translator')

    def put_text(self, text):
        clipboard.copy(text)
        input_css = 'div.lmt__inner_textarea_container textarea'
        input_area = self.driver.find_element(By.CSS_SELECTOR, input_css)

        input_area.clear()  # self.sleep(1)

        # paste
        input_area.send_keys(Keys.SHIFT, Keys.INSERT)

    def get_translation(self):
        return self.driver.find_element(By.CSS_SELECTOR, 'textarea.lmt__target_textarea').get_attribute('value')

    def wait_until_request(self, pat, timeout=20):

        start = time.time()

        while time.time() - start < timeout:
            # request = self.driver.backend.storage.find(pat)
            request = self.driver.last_request
            if re.search(pat, request.url):
                if request.response:
                    return request
                else:
                    time.sleep(1 / 5)

        raise TimeoutException('Timed out after {}s waiting for request matching {}'.format(timeout, pat))

    def translate(self, text):
        # clear past requests
        del self.driver.requests

        print('putting text')
        self.put_text(text)
        print('waiting')
        request = self.wait_until_request('/web/statistics')
        print('done!')
        # time.sleep(max(2, len(text) / 800))
        print(len(self.get_translation()))
        for request in self.driver.iter_requests():
            print(request.response, request.url, request.response.status_code)

    def get_requests_by_keyword(self, keyword):
        requests = []
        for request in self.driver.requests:
            if request.response and (keyword in request.url) and request.response.status_code < 300:
                requests.append(request)
        return requests

    def parse_translated_sentences_from_json_responce(self, json_responce):
        sentences = []
        for b in json_responce['result']['translations']:
            if len(b['beams']) > 1:
                print('multiple beams:', b['beams'])

            sent = b['beams'][0]['postprocessed_sentence']
            sentences.append(sent)
            assert isinstance(sent, str)
        return sentences

    def parse_split_sentences_from_json_responce(self, json_responce):
        sentences = list(itertools.chain(*json_responce['result']['splitted_texts']))
        assert all((isinstance(sent, str) for sent in sentences))
        return sentences

    def get_pairs(self):
        split_requests = self.get_requests_by_keyword('split_into_sentences')
        # get the last one
        split_request = split_requests[-1]
        split_json = json.loads(split_request.response.body)
        source_sentences = self.parse_split_sentences_from_json_responce(split_json)

        # requests that respond with translations
        handle_jobs_requests = self.get_requests_by_keyword('handle_jobs')
        trans_sentences = []
        for request in handle_jobs_requests:
            responce_body = json.loads(request.response.body)
            trans_sentences.extend(self.parse_translated_sentences_from_json_responce(responce_body))

        assert len(source_sentences) == len(trans_sentences), (len(source_sentences), len(trans_sentences))
        return list(zip(source_sentences, trans_sentences))

    def __delete__(self, instance):
        self.driver.close()


def translate_text(text, nlp):
    deepL = DeepLSelenium('./chromedriver.exe', target_lang=args.target_lang)
    deepL.translate(text)

    pairs = deepL.get_pairs()
    del deepL

    result = []
    for a, b in pairs:
        pair = {
            args.source_lang: {
                'sentence': a,
            },
            args.target_lang: {
                'sentence': b
            }
        }
        assert 'ru' in (args.source_lang, args.target_lang)
        ru_text = a if args.source_lang == 'ru' else b
        doc = nlp(ru_text)
        pair['ru']['spacy_tokens'] = morph_dict(doc)
        result.append(pair)

    return result


def chunk_text(text: str, max_len=5000):
    lines = text.splitlines(keepends=True)
    chunk = ''
    for line in lines:
        if len(chunk) + len(line) < max_len:
            chunk += line
        else:
            yield chunk
            chunk = line

    if chunk:
        yield chunk


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('--output', default=None)
    parser.add_argument('--source_lang', default='en')
    parser.add_argument('--target_lang', default='ru')

    args = parser.parse_args()
    if args.output is None:
        assert args.input.endswith('.txt')
        args.output = args.input.replace('.txt', '.translated.json')

    with open(args.input, encoding='utf-8') as f:
        text = f.read()
        text = unicodedata.normalize('NFC', text)

    print('loading spacy...')
    try:
        nlp = spacy.load("ru_core_news_lg")
    except OSError:
        nlp = spacy.load("ru_core_news_sm")

    chunks = list(chunk_text(text))
    result = []
    for chunk in chunks:
        print('chunk size:', len(chunk))
        res = translate_text(chunk, nlp)
        result.extend(res)

    json.dump(result, open(args.output, 'w', encoding='utf-8'), indent=True, ensure_ascii=False)
    print("saved in:", args.output)
