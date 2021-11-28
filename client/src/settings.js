

const settingsKey = {}


const settings = {
    ruWordRegex: /[а-яА-Я]+[-]*[а-яА-Я]*/,
    grammarWhitelist: {
        revealTags: [
            'NUM',
            'ADP',
            'PROPN',
            'CCONJ',
            'SCONJ',
            'ADV',
        ],
    }
}

export { settingsKey, settings }