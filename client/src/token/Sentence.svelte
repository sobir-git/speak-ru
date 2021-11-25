<script>
    import Token from "./Token.svelte"
    const RU_WORD_REGEX = /[а-яА-Я]+[-]*[а-яА-Я]*/

    export var sentence = {spacy_tokens: []}, words, codedIndices=new Set(), effectiveRegex=RU_WORD_REGEX;

    $: tokenList = sentence.spacy_tokens;
    $: words = tokenList.map(el=>el.text)

    export function getWords() {
        return words;
    }

    export function revealTokens(text) {
        // reveals tokens that the text covers
        let textTokens = text.split(" ");
        let tokensA = words.map(el=>el.toLowerCase())
        let tokensB = textTokens.map(el=>el.toLowerCase())
        let _codedIndices = new Set(codedIndices);
        for (let i=0; i<tokensA.length; i++){
            let index = tokensB.indexOf(tokensA[i]);
            if (index > -1) {  
                tokensB.splice(index, 1);
                _codedIndices.delete(i);
            }
        }
        codedIndices = _codedIndices;
    }

    function computeCodedIndices(codedIndices, effectiveRegex) {
        let result = new Set(codedIndices);
        if (effectiveRegex !== undefined) {
            for (let i=0; i<words.length; i++) {
                if (!words[i].match(effectiveRegex))
                    result.delete(i)
            }
        }
        return result;
    }
    $: finalCodedIndices = computeCodedIndices(codedIndices, effectiveRegex)

</script>


{#each tokenList as token, i (token)}
    <Token token={token} coded={finalCodedIndices.has(i)}/>
    <span />
{/each}