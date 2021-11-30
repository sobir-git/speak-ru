<script>
    import Token from "./Token.svelte";

    export var sentence = { spacy_tokens: [] },
        codedIndices = new Set();

    $: tokenList = sentence.spacy_tokens;
    $: words = tokenList.map((el) => el.text);

    export function getWords() {
        return words;
    }

    export function revealTokens(text) {
        // reveals tokens that the text covers
        let textTokens = text.split(" ");
        let tokensA = words.map((el) => el.toLowerCase());
        let tokensB = textTokens.map((el) => el.toLowerCase());
        let _codedIndices = new Set(codedIndices);
        for (let i = 0; i < tokensA.length; i++) {
            let index = tokensB.indexOf(tokensA[i]);
            if (index > -1) {
                tokensB.splice(index, 1);
                _codedIndices.delete(i);
            }
        }
        codedIndices = _codedIndices;
    }

    const specialRightPunctuations = ".,?!:;”»)";
    const specialLeftPunctuations = "““(«";
    const otherPunctuations = "-‒‒–—";
    const allPunktuations =
        specialRightPunctuations + specialLeftPunctuations + otherPunctuations;

    function createRenderList(tokenList) {
        if (tokenList.length == 0) {
            return new Array();
        }
        let result = new Array();
        if (allPunktuations.includes(tokenList[0].text)) {
            result.push({
                type: "token-punct",
                value: tokenList[0].text,
                idx: 0,
            });
        } else {
            result.push({ type: "token", value: tokenList[0], idx: 0 });
        }

        for (let i = 1; i < tokenList.length; i++) {
            const token = tokenList[i];
            let needSpace = false;
            if (specialLeftPunctuations.includes(token.text)) {
                // add space before
                needSpace = true;
            } else if (specialRightPunctuations.includes(token.text)) {
                needSpace = false;
            } else if (otherPunctuations.includes(token.text)) {
                needSpace = true;
            } else {
                // not a punctuation
                let prevToken = tokenList[i - 1];
                if (!specialLeftPunctuations.includes(prevToken.text)) {
                    needSpace = true;
                }
            }
            if (needSpace) {
                result.push({ type: "space" });
            }

            if (allPunktuations.includes(token.text)) {
                // no space before
                result.push({ type: "token-punct", value: token.text, idx: i });
            } else {
                // space before
                result.push({ type: "token", value: token, idx: i });
            }
        }
        return result;
    }
    $: renderList = createRenderList(tokenList);
</script>

<div class={$$props.class}>
    {#each renderList as item, i (item)}
        {#if item.type == "space"}
            <span class="whitespace">{" "}</span>
        {:else if item.type == "token-punct"}
            <span class="word">{item.value}</span>
        {:else}
            <Token token={item.value} coded={codedIndices.has(item.idx)} />
        {/if}
    {/each}
</div>


