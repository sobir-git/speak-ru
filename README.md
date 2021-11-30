# SpeakRussian

A simple web application in which humans practice speaking russian, learn russian grammar, and read russian passages.
Built with Svelte and Flask.

# Setup
Recommended to create a virtual environment first. The python3.9.7 was used, although different versions should also work. 
1. Install python requirements
```
python -m pip install -r requirements.txt
```

2. Compile svelte app
```
cd client/
npm install
npm run build
cd ..
```

3. Launch server
```
cd backend/
export FLASK_APP=backend/server.py
python -m flask run
```


## To add your own passage
Install spacy and selenium:
```
pip install -U pip setuptools wheel
pip install -U spacy
pip install clipboard==0.0.4 selenium==4.0.0 selenium-wire==4.5.4
python -m spacy download ru_core_news_lg
```

Also, download a chrome driver from https://chromedriver.chromium.org/downloads and put it in the root directory.

The passage should be in a plain txt file located at a "texts" subdirectories like "texts/some folder/" with no specific formatting.

The command below will split the passage into sentences, translate them, add morphological analysis to each russian word.
The translation and sentence splitting is done using [DeepL.com](https://www.deepl.com/translator) translator.
```
python deepl_w_selenium.py "texts/some folder/<file.txt>" --source_lang=ru --target_lang=en
```

Optionally, you can synthesize audio for each russian sentence. This requires having [Yandex SpeechKit](https://cloud.yandex.ru/services/speechkit) api token.

```
export YA_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export YSK_FOLDER_ID=xxxxxxxxxxxxxxxxxxxx

# run curl to obtain iamToken from YA_TOKEN
curl -d "{'yandexPassportOauthToken':'$YA_TOKEN'}" 'https://iam.api.cloud.yandex.net/iam/v1/tokens'
{
 "iamToken": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
 "expiresAt": "2021-11-02T23:00:58.431682016Z"
}
# store iamToken it into the environment variable
export YSK_IAM_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# run speech synthesis
python synthesize_passage.py "texts/some folder/<generated-translation-json-file>"
```


# License and attributions

- This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.

- Integrated the work done by Alexandre Gattiker at this repo https://github.com/algattik/SlavaTranslator that helps to fetch the russian word definitions from Wiktionary.

- The passages in texts folder (with an exception of a few) were taken  from the website https://pa-russki.com/.