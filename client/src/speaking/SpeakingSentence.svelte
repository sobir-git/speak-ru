<script>
    import { createEventDispatcher } from "svelte";

    import AudioPlayer from "../AudioPlayer.svelte";
    import Sentence from "../token/Sentence.svelte";
    import Recognizer from "./Recognizer.svelte";
    import SentenceSelector from "./SentenceSelector.svelte";

    export let sentenceIdx;
    export let passage;
    let textarea;
    $: passageId = passage.id;
    $: pair = passage.pairs[sentenceIdx];
    $: numSentences = passage.pairs.length;
    $: console.assert(sentenceIdx >= 0 && sentenceIdx < numSentences, {
        sentenceIdx,
        numSentences,
    });

    const dispatch = new createEventDispatcher();
    let sentenceComponent;
    let text = "",
        lastPiece,
        recognizer;

    function handleRecognition(e) {
        lastPiece = e.detail;
        let lastChar = text.substr(text.length - 1);
        if (lastChar !== " ") text += " ";
        text += lastPiece;
        handleTextChange();
    }

    function handleClickNext(e) {
        gotoSentence(sentenceIdx + 1);
    }

    function handleClickPrevious(e) {
        gotoSentence(sentenceIdx - 1);
    }

    function handleTextChange() {
        // console.log("textChange", text);
        sentenceComponent.revealTokens(text);
        textarea.scrollTop = textarea.scrollHeight;
    }

    function gotoSentence(idx) {
        text = "";
        dispatch("gotoSentence", {
            sentenceIdx: idx,
        });
    }
</script>

<div class="sentence-parent">
    <div class="english">{pair.en.sentence}</div>
    <Sentence
        bind:this={sentenceComponent}
        sentence={pair.ru}
        codedIndices={new Set([...Array(pair.ru.spacy_tokens.length).keys()])}
        class="sentence-ru"
    />
</div>
<div>
    <Recognizer bind:this={recognizer} on:recognition={handleRecognition} />
    <button on:click={handleClickPrevious} disabled={sentenceIdx == 0}
        >Prev</button
    >
    <button
        on:click={handleClickNext}
        disabled={sentenceIdx == numSentences - 1}>Next</button
    >
    {sentenceIdx + 1} / {numSentences}
    <SentenceSelector
        {passage}
        {sentenceIdx}
        on:selectSentence={(e) => gotoSentence(e.detail.sentenceIdx)}
    />
    {#if pair.ru.audio}
        <AudioPlayer url={"/api/audio/" + passageId + "/" + pair.ru.audio} />
    {/if}
</div>
<textarea
    bind:this={textarea}
    bind:value={text}
    on:input={handleTextChange}
    rows="4"
/>

<style>
    textarea {
        width: 100%;
        font-family: monospace;
    }
    .english {
        font-size: 1.2em;
        margin-bottom: 1em;
    }
    .sentence-parent :global(.sentence-ru) {
        margin-top: 0.5em;
        margin-bottom: 1.2em;
    }
    .sentence-parent :global(.sentence-ru > .word) {
        font-weight: bold;
        font-family: monospace;
        font-size: 1.8em;
        color: orange;
    }
</style>
