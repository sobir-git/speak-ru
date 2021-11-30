def morph_dict(doc):
    res = []
    for t in doc:
        res.append({
            'text': t.text,
            'lemma': t.lemma_,
            'morph': str(t.morph),
            'pos': t.pos_
        })
    return res


if __name__ == '__main__':
    import pprint
    import spacy

    nlp = spacy.load("ru_core_news_lg")
    # doc = nlp("получение стали - дело трудное.")
    while True:
        sentence = input('>> ')
        doc = nlp(sentence)
        pprint.pprint(morph_dict(doc))
