// Copied and adapted from https://github.com/algattik/SlavaTranslator
// Original author: Alexandre Gattiker
// licensed under CC BY-SA 3.0

const slavaConfig = {
    "langpairs": {
        "en": {
            "ru": {
                "lang_span_name": "Russian",
                "lang_span_id": "Russian",
                "include": [
                    {
                        "category": "Russian lemmas",
                        "recurse": 1
                    },
                    {
                        "category": "Russian proper nouns"
                    },
                    {
                        "category": "Russian participles"
                    },
                    {
                        "category": "Russian adjective superlative forms"
                    }
                ],
                "exclude": [
                    {
                        "category": "Russian spellings with е instead of ё"
                    },
                    {
                        "category": "Russian phrases"
                    },
                    {
                        "category": "Russian proverbs"
                    },
                    {
                        "category": "Russian obsolete forms"
                    }
                ]
            }
        },
        "ru": {
            "ru": {
                "lang_span_name": "Русский",
                "lang_span_id": "Русский"
            }
        },
        "fr": {
            "ru": {
                "lang_span_name": "Russe",
                "lang_span_id": "Russe"
            }
        }
    },
    "languages": {
        "ru": {
            "frequency_file": "https://github.com/Baksalyar/mc.hertzbeat.ru-Frequency-Dictionaries/raw/master/mc.hertzbeat.ru_frequency_dict.txt"
        }
    },
    "wiktionary": {
        "en": {
            "name": "English",
            "language_heading": "h2",
            "heading_is_class": true,
            "definition_headings": [
                "Circumfix",
                "Interfix",
                "Prefix",
                "Affix",
                "Suffix",
                "Abbreviation",
                "Adjective",
                "Adverb",
                "Conjunction",
                "Combining form",
                "Diacritical mark",
                "Determiner",
                "Interjection",
                "Idiom",
                "Morpheme",
                "Letter",
                "Noun",
                "Numeral",
                "Particle",
                "Participle",
                "Phrase",
                "Predicative",
                "Preposition",
                "Prepositional phrase",
                "Pronoun",
                "Proper noun",
                "Proverb",
                "Symbol",
                "Verb"
            ]
        },
        "ru": {
            "name": "Russian (русский)",
            "language_heading": "h1",
            "heading_is_class": false,
            "definition_headings": [
                "Значение"
            ]
        },
        "fr": {
            "name": "French (français)",
            "language_heading": "h2",
            "heading_is_class": true,
            "definition_headings": [
                "Circonfixe",
                "Interfixe",
                "Préfixe",
                "Affixe",
                "Suffixe",
                "Abréviation",
                "Adjectif",
                "Adverbe",
                "Conjonction",
                "Déterminant",
                "Interjection",
                "Idiome",
                "Morphème",
                "Lettre",
                "Nom commun",
                "Adjectif numéral",
                "Particule",
                "Participe",
                "Phrase",
                "Prédicatif",
                "Préposition",
                "Pronom",
                "Nom propre",
                "Proverbe",
                "Symbole",
                "Verbe"
            ]
        }
    }
}


// parse document without loading images. See https://stackoverflow.com/questions/15113910
var virtualDocument = document.implementation.createHTMLDocument('virtual');
// Unicode COMBINING ACUTE ACCENT character, used to mark stress on Russian words
const UNICODE_COMBINING_ACUTE_ACCENT = '\u0301';


function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

function xpath_list(jquery_elements, expr) {

    var nodes = [];
    $.each(jquery_elements.get(), function (i, e) {
        var iterator = document.evaluate(expr, e, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        var thisNode = iterator.iterateNext();
        while (thisNode) {
            nodes.push(thisNode);
            thisNode = iterator.iterateNext();
        }
    });
    return nodes;
}

function normalize(str) {
    str = str.replace(UNICODE_COMBINING_ACUTE_ACCENT, '');
    str = str.toLowerCase();
    str = str.replace('ё', 'е');
    return str;
}

function parse_table(table) {
    var rows = table.children('tbody').children('tr');
    var t = [];
    for (var i = 0; i < rows.length; i++) {
        var r = [];
        var row = rows[i];
        var td = $(row).children('td,th');
        for (var j = 0; j < td.length; j++) {
            var c = td.get(j);
            // apply colspan
            for (var j2 = 0; j2 < c.colSpan; j2++) {
                r.push([c, c.rowSpan, $(c).text()]);
            }
        }
        t.push(r);
    }
    for (var i = 0; i < t.length; i++) {
        var r = t[i];
        for (var j = 0; j < r.length; j++) {
            var c = r[j];
            var c0 = $(c[0]);
            // apply rowspan
            if (c[1] > 1) {
                t[i + 1].splice(j, 0, [c[0], c[1] - 1, c[2]]);
            }
            // remove span e.g. animate / inanimate in Владимир
            if (c[0].tagName == 'TH') {
                c0.children('span[style]').remove();
            }
        }
    }
    return t;
}

function add_grammar(grammar, element) {
    var text = $(element).text().trim();
    if (!grammar.includes(text)) {
        grammar.push(text);
    }
}

function grammar_from_table(table, element, cases) {
    var t = parse_table(table);

    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            var c = t[i][j];
            //multiple elements can match because of colspan
            if (c[0] != element) {
                continue;
            }

            var grammar_tokens = [];
            var in_th = false;
            for (var i2 = i - 1; i2 >= 0; i2--) {
                if (t[i2][j][0].tagName == 'TH') {
                    add_grammar(grammar_tokens, t[i2][j][0]);
                    in_th = true;
                } else if (in_th) {
                    break;
                }
            }
            in_th = false;
            for (var j2 = j - 1; j2 >= 0; j2--) {
                if (t[i][j2][0].tagName == 'TH') {
                    add_grammar(grammar_tokens, t[i][j2][0]);
                    in_th = true;
                } else if (in_th) {
                    break;
                }
            }
            if (grammar_tokens) {
                var grammarText = grammar_tokens.reverse().join(" ");
                if (!cases.includes(grammarText)) {
                    cases.push(grammarText);
                }
            }
        }
    }
}

function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a.join("");
}

function parse_wiki(dom, word, lemma, freq, src_lang, lang_pair) {
    var page_url = 'https://' + src_lang + '.wiktionary.org/wiki/' + lemma;
    var lang_span_id = lang_pair.lang_span_id; // FIXME may be _1
    var lang_conf = slavaConfig.wiktionary[src_lang];
    var language_heading = lang_conf.language_heading;
    var langspan = dom.find(language_heading + " > span#" + lang_span_id + ".mw-headline");
    var langsection = langspan.parent().nextUntil(language_heading);

    var wordClasses = _.object(_.map(lang_conf.definition_headings, function (v) {
        return [v, 1];
    }));
    //Words may have multiple classes, e.g. под
    //Will be h3, or h4 if multiple etymologies, e.g. погрузиться
    var wordClassHeadings = langsection.find("span.mw-headline").filter(function () {
        return wordClasses[$(this).text().trim()];
    });

    // Add word class within definition (since word class heading is removed)
    // Add frequency within definition
    if (freq) {
        var freq_span = ' <span class="slava-wordfreq">' + freq + '</span>';
        wordClassHeadings.each(function () {
            var s = $('<span class="slava-wordclass">' + $(this).text() + '</span>');
            if (lang_conf.heading_is_class) {
                $(this).parent().next().children(':first-child').after(s).after(' ');
                s.after(freq_span);
            } else {
                $(this).parent().next().prepend(freq_span);
            }
        });
    }


    var defn = wordClassHeadings.parent().nextUntil('hr,h1,h2,h3,h4,h5'); // e.g. with hr: после
    var full_def = wordClassHeadings.parent().nextUntil(wordClassHeadings.prop('tagName'));


    var upper = genCharArray('A', 'Z') + genCharArray('А', 'Я') + 'Ë';
    var lower = upper.toLowerCase();
    var expr1 = '//td/span[@lang="ru"]';
    var expr2s = ['', '/a']; // свое́й under свой is once not full content of the cell
    var expr3 = '[translate(.,"' + upper + UNICODE_COMBINING_ACUTE_ACCENT + '", "' + lower + '")=translate("' + escapeHtml(word) + '","' + upper + UNICODE_COMBINING_ACUTE_ACCENT + '", "' + lower + '")]/ancestor::td[1]';

    var cases = [];
    $.each(expr2s, function (i, expr2) {
        var nodes = xpath_list(full_def, expr1 + expr2 + expr3);

        $.each(nodes, function (j, element) {
            grammar_from_table($(element).closest('table'), element, cases);
        });
    });

    var comparatives = xpath_list(full_def, "b[@lang='ru' and preceding-sibling::*[1][name()='i' and text()='comparative']]");
    $.each(comparatives, function (i, element) {
        var comparative = element.textContent;
        var prefix = "по";
        var test;
        if (comparative.startsWith("(" + prefix + ")")) {
            comparative = comparative.slice(prefix.length + 2);
            test = [comparative, prefix + comparative];
        } else {
            test = [comparative];
        }
        for (var i = 0; i < test.length; i++) {
            if (test[i] == word) {
                cases.push("comparative");
                break;
            }
        }
    });

    defn = defn.filter(":not(table.flextable)");

    // Remove transliterations

    defn.find("a[title='Wiktionary:Russian transliteration']").remove();

    var translit = defn.find("span.tr, i.tr"); //e.g. with <i>: свет

    // Remove parentheses / dashes before / after transliteration
    $.each(translit.get(), function (i, e) {
        var prev = e.previousSibling;
        var next = e.nextSibling;
        if (prev && next) {
            if (prev.textContent.slice(-1) == "(" && next.textContent.slice(0, 1) == ")") {
                prev.textContent = prev.textContent.slice(0, -1);
                next.textContent = next.textContent.slice(1);
            }
            if (prev.textContent.trim() == "―") { //e.g. свет
                prev.textContent = "";
            }
            if (next.textContent.slice(0, 2) == ", ") { //e.g. погрузиться
                next.textContent = next.textContent.slice(2);
            }
        }
    });


    translit.remove();


    // Add hyperlink to original wiktionary page
    // NB e.g. не#Prefix has no headword
    var page_link = document.createElement('a');
    page_link.href = page_url;
    var headword = defn.find("strong.headword");
    if (headword.length) {
        headword.wrap(page_link);
    } else {
        page_link.innerText = lemma;
        defn.prepend('<br/>').prepend(page_link);
    }


    // Change relative hyperlinks to absolute
    var page_base = page_link.protocol + "//" + page_link.host; // e.g. "https://en.wiktionary.org"
    defn.find('a:not([href*="://"],[href^="mailto:"])').each(function () {
        $(this).attr('href', function (index, value) {
            if (!value) {
                return value;
            }
            if (value.slice(0, 1) == "#") {
                return null;
            }
            if (value.slice(0, 1) == "/") {
                return page_base + value;
            }
            return page_base + page_link.path + value;
        });

        return defn;
    });

    // Remove images
    defn.find('img').remove();

    // Add cases
    var casesdiv = $("<div class='slava-cases'/>");
    $.each(cases, function (i, e) {
        var casediv = $("<div class='slava-case'/>");
        casediv.append(e);
        casesdiv.append(casediv);
    });

    // Build output structure
    var res = $("<div class='slava-res'/>");
    res.append(defn);
    res.append(casesdiv);
    return res;

}


export function get_entries(token, callback) {
    var lemmas = {[token.lemma]: 1};
    
    var src_lang = 'en';
    var word = token.text;
    var target_lang = 'ru';
    var lang_pair = slavaConfig.langpairs[src_lang][target_lang];
    var ajax_queries = $.map(_.keys(lemmas), function (lemma) {
        var url = 'https://' + src_lang + '.wiktionary.org/w/api.php?action=parse&format=json&page=' + lemma + '&prop=text&origin=*';
        return $.getJSON(url);
    });

    $.when.apply($, ajax_queries).done(function () {
        var odom = Array();

        var res = arguments;
        if (ajax_queries.length < 2) {
            res = [arguments];
        }
        $.each(res, function (i, a1) {
            var parsed = a1[0].parse;
            if (parsed) {
                var html = parsed.text['*'];
                var dom = $(html, virtualDocument);
                var freq = lemmas[parsed.title];
                dom = parse_wiki(dom, word, parsed.title, freq, src_lang, lang_pair);
                if (dom.children().children().length) {
                    odom.push(dom);
                }
            }
        });
        console.log('retrieved', lemmas, odom);
        callback(odom);
    });
}
