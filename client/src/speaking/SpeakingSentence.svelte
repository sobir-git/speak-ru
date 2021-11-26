<script>
    import { createEventDispatcher } from "svelte";

    import AudioPlayer from "../AudioPlayer.svelte";
    import Sentence from "../token/Sentence.svelte";
    import Recognizer from "./Recognizer.svelte";
    import SentenceSelector from "./SentenceSelector.svelte";

    export let sentenceIdx;
    export let passage;
    $: passageId = passage.id;
    $: pair = passage.pairs[sentenceIdx];
    $: numSentences = passage.pairs.length;
    $: console.assert(sentenceIdx >= 0 && sentenceIdx < numSentences, {sentenceIdx,numSentences})

    const dispatch = new createEventDispatcher();
    let sentenceComponent;
    let text = "",
        lastPiece,
        recognizer;

    function handleRecognition(e) {
        lastPiece = e.detail.lastPiece;
        text = e.detail.text;
        console.log(e.detail);
        handleTextChange();
    }

    function handleClickNext(e) {
        gotoSentence(sentenceIdx + 1);
    }

    function handleClickPrevious(e) {
        gotoSentence(sentenceIdx - 1);
    }

    function handleTextChange() {
        console.log("textChange", text);
        sentenceComponent.revealTokens(text);
    }

    function gotoSentence(idx) {
        text = "";
        recognizer.reset();
        dispatch("gotoSentence", {
            sentenceIdx: idx,
        });
    }
</script>

<div>
    <div>{pair.en.sentence}</div>
    <Sentence
        bind:this={sentenceComponent}
        sentence={pair.ru}
        codedIndices={new Set([...Array(pair.ru.spacy_tokens.length).keys()])}
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
    <AudioPlayer url={"/api/audio/" + passageId + "/" + pair.ru.audio} />
</div>
<textarea bind:value={text} on:change={handleTextChange} rows:3 />

<style>
    textarea {
        width: 100%;
    }
</style>
